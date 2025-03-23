import { Pool } from "pg"

// 檢查環境變量
if (!process.env.DATABASE_URL) {
  console.error("環境變量 DATABASE_URL 未設置")
}

// 創建 PostgreSQL 連接池
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// 檢查連接
export async function testConnection() {
  if (!process.env.DATABASE_URL) {
    return {
      success: false,
      message: "環境變量 DATABASE_URL 未設置",
    }
  }

  try {
    const client = await pool.connect()
    try {
      const result = await client.query("SELECT NOW() as time")
      return {
        success: true,
        message: "數據庫連接成功",
        time: result.rows[0].time,
      }
    } finally {
      client.release()
    }
  } catch (error: any) {
    return {
      success: false,
      message: "數據庫連接失敗",
      error: error.message,
    }
  }
}

// 檢查表是否存在
export async function checkTableExists(tableName: string): Promise<boolean> {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName],
    )
    return rows[0].exists
  } catch (error) {
    console.error("Error checking table existence:", error)
    return false
  } finally {
    client.release()
  }
}

// 創建 posts 表
export async function createPostsTable() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER,
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Posts table created or already exists")
    return true
  } catch (error) {
    console.error("Error creating posts table:", error)
    return false
  } finally {
    client.release()
  }
}

// 獲取所有文章
export async function getAllPosts() {
  // 檢查表是否存在，如果不存在則創建
  const tableExists = await checkTableExists("posts")
  if (!tableExists) {
    await createPostsTable()
    return [] // 返回空數組，因為新表中沒有數據
  }

  const client = await pool.connect()
  try {
    const { rows } = await client.query("SELECT * FROM posts ORDER BY created_at DESC")
    return rows
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  } finally {
    client.release()
  }
}

// 獲取單個文章
export async function getPostById(id: number) {
  // 檢查表是否存在
  const tableExists = await checkTableExists("posts")
  if (!tableExists) {
    await createPostsTable()
    return null
  }

  const client = await pool.connect()
  try {
    const { rows } = await client.query("SELECT * FROM posts WHERE id = $1", [id])
    return rows[0] || null
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error)
    return null
  } finally {
    client.release()
  }
}

// 創建文章
export async function createPost(title: string, content: string, authorId: number | null = null) {
  // 檢查表是否存在
  const tableExists = await checkTableExists("posts")
  if (!tableExists) {
    await createPostsTable()
  }

  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      "INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, authorId],
    )
    return rows[0]
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  } finally {
    client.release()
  }
}

// 更新文章
export async function updatePost(id: number, title: string, content: string) {
  // 檢查表是否存在
  const tableExists = await checkTableExists("posts")
  if (!tableExists) {
    await createPostsTable()
    return null
  }

  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      "UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [title, content, id],
    )
    return rows[0] || null
  } catch (error) {
    console.error(`Error updating post with id ${id}:`, error)
    return null
  } finally {
    client.release()
  }
}

// 刪除文章
export async function deletePost(id: number) {
  // 檢查表是否存在
  const tableExists = await checkTableExists("posts")
  if (!tableExists) {
    return false
  }

  const client = await pool.connect()
  try {
    const { rowCount } = await client.query("DELETE FROM posts WHERE id = $1", [id])
    return rowCount > 0
  } catch (error) {
    console.error(`Error deleting post with id ${id}:`, error)
    return false
  } finally {
    client.release()
  }
}

// 發布或取消發布文章
export async function togglePublishPost(id: number, published: boolean) {
  // 檢查表是否存在
  const tableExists = await checkTableExists("posts")
  if (!tableExists) {
    await createPostsTable()
    return null
  }

  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      "UPDATE posts SET published = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [published, id],
    )
    return rows[0] || null
  } catch (error) {
    console.error(`Error toggling publish status for post with id ${id}:`, error)
    return null
  } finally {
    client.release()
  }
}

