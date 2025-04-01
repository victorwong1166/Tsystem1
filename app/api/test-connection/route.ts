import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET() {
  // 不要在生产环境中暴露此端点，仅用于测试
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 })
    }

    // 创建一个临时连接池
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // 注意：在生产环境中应设置为 true
      },
    })

    // 测试连接
    const client = await pool.connect()
    try {
      const result = await client.query("SELECT NOW() as current_time")
      return NextResponse.json({
        success: true,
        message: "连接成功",
        timestamp: result.rows[0].current_time,
      })
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error) {
    console.error("连接测试错误:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

