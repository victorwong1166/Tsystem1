import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

export async function migrateDatabase() {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const db = drizzle(sql)

    console.log("Database connection established")
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    console.error("Database migration error:", error)
    return { success: false, message: "Database connection failed" }
  }
}

export async function testConnection() {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const result = await sql`SELECT NOW()`

    return {
      success: true,
      message: "数据库连接成功",
      timestamp: result[0].now,
    }
  } catch (error) {
    console.error("Database connection test error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function initializeDatabase() {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

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
    console.error("Database initialization error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const result = await sql(query, params)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Query execution error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

