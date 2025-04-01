import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

export async function migrateDatabase() {
  try {
    // 检查环境变量是否存在
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL 环境变量未设置")
      return {
        success: false,
        message: "DATABASE_URL 环境变量未设置。请确保在环境变量中设置了有效的数据库连接字符串。",
      }
    }

    console.log("尝试连接到数据库...")
    const sql = neon(process.env.DATABASE_URL)
    const db = drizzle(sql)

    // 测试连接
    const result = await sql`SELECT 1 as test`
    console.log("数据库连接成功:", result)

    return { success: true, message: "数据库连接成功" }
  } catch (error) {
    console.error("数据库迁移错误:", error)
    return {
      success: false,
      message: `数据库连接失败: ${error instanceof Error ? error.message : "未知错误"}`,
    }
  }
}

export async function testConnection() {
  try {
    // 检查环境变量是否存在
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL 环境变量未设置")
      return {
        success: false,
        error: "DATABASE_URL 环境变量未设置。请确保在环境变量中设置了有效的数据库连接字符串。",
      }
    }

    console.log("尝试测试数据库连接...")
    console.log("DATABASE_URL 前缀:", process.env.DATABASE_URL.substring(0, 20) + "...")

    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT NOW() as current_time`

    console.log("SQL 查询结果:", JSON.stringify(result))

    // 检查结果是否为空或未定义
    if (!result || result.length === 0) {
      return {
        success: false,
        error: "数据库查询返回空结果",
      }
    }

    // 安全地访问结果
    const timestamp = result[0]?.current_time || new Date().toISOString()

    return {
      success: true,
      message: "数据库连接成功",
      timestamp: timestamp,
    }
  } catch (error) {
    console.error("数据库连接测试错误:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

export async function initializeDatabase() {
  try {
    // 检查环境变量是否存在
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL 环境变量未设置")
      return {
        success: false,
        error: "DATABASE_URL 环境变量未设置。请确保在环境变量中设置了有效的数据库连接字符串。",
      }
    }

    const sql = neon(process.env.DATABASE_URL)

    // 创建用户表
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // 创建帖子表
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        content TEXT,
        published BOOLEAN DEFAULT FALSE,
        author_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    return {
      success: true,
      message: "数据库初始化成功",
    }
  } catch (error) {
    console.error("数据库初始化错误:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

export async function executeQuery(query: string, params: any[] = []) {
  try {
    // 检查环境变量是否存在
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL 环境变量未设置")
      return {
        success: false,
        error: "DATABASE_URL 环境变量未设置。请确保在环境变量中设置了有效的数据库连接字符串。",
      }
    }

    const sql = neon(process.env.DATABASE_URL)
    const result = await sql(query, params)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("查询执行错误:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

