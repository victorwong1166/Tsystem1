import { NextResponse } from "next/server"
import { db } from "@/lib/db-mock"

export async function POST(request: Request) {
  try {
    // Add at the beginning of the handler function
    const customDatabaseUrl = request.headers.get("X-Custom-Database-Url")
    const dbUrl = customDatabaseUrl || process.env.DATABASE_URL

    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "查询语句是必需的" }, { status: 400 })
    }

    console.log("执行查询:", query)

    // 使用模拟数据库执行查询
    const result = await db.query(query)

    return NextResponse.json({ result })
  } catch (error) {
    console.error("执行查询时出错:", error)
    return NextResponse.json({ error: error.message || "执行查询时出错" }, { status: 500 })
  }
}

