import { Pool } from "pg"

// 創建 PostgreSQL 連接池
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// 獲取所有文章
export async function getAllPosts() {
  const client = await pool.connect()
  try {
    const { rows } = await client.query("SELECT * FROM posts ORDER BY created_at DESC")
    return rows
  } finally {
    client.release()
  }
}

// 獲取單個文章
export async function getPostById(id: number) {
  const client = await pool.connect()
  try {
    const { rows } = await client.query("SELECT * FROM posts WHERE id = $1", [id])
    return rows[0] || null
  } finally {
    client.release()
  }
}

// 創建文章
export async function createPost(title: string, content: string, authorId: number) {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      "INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, authorId],
    )
    return rows[0]
  } finally {
    client.release()
  }
}

// 更新文章
export async function updatePost(id: number, title: string, content: string) {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      "UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [title, content, id],
    )
    return rows[0] || null
  } finally {
    client.release()
  }
}

// 刪除文章
export async function deletePost(id: number) {
  const client = await pool.connect()
  try {
    const { rowCount } = await client.query("DELETE FROM posts WHERE id = $1", [id])
    return rowCount > 0
  } finally {
    client.release()
  }
}

// 發布或取消發布文章
export async function togglePublishPost(id: number, published: boolean) {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      "UPDATE posts SET published = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [published, id],
    )
    return rows[0] || null
  } finally {
    client.release()
  }
}

