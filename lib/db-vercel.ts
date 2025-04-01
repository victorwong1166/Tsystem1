import { sql } from "@vercel/postgres"

export async function testVercelConnection() {
  try {
    // 检查环境变量是否存在
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL 环境变量未设置")
      return {
        success: false,
        error: "DATABASE_URL 环境变量未设置。请确保在环境变量中设置了有效的数据库连接字符串。",
      }
    }

    console.log("尝试使用 Vercel Postgres 连接数据库...")

    // 使用 Vercel Postgres 客户端执行简单查询
    const result = await sql`SELECT NOW() as current_time`

    console.log("Vercel Postgres 查询结果:", JSON.stringify(result))

    return {
      success: true,
      message: "数据库连接成功",
      timestamp: result.rows[0]?.current_time || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Vercel Postgres 连接测试错误:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

