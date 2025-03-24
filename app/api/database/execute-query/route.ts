import { NextResponse } from "next/server"
import { db } from "@/lib/db-mock"

export async function POST(request: Request) {
  let body

  try {
    // Read the request body ONCE and store it
    body = await request.json()
  } catch (error) {
    console.error("Error parsing request body:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body format",
      },
      { status: 400 },
    )
  }

  try {
    // Get custom database URL from header
    const customDatabaseUrl = request.headers.get("X-Custom-Database-Url")
    const dbUrl = customDatabaseUrl || process.env.DATABASE_URL

    const { query } = body

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "查询语句是必需的",
        },
        { status: 400 },
      )
    }

    console.log("执行查询:", query)

    // Start timing the query execution
    const startTime = Date.now()

    // 使用模拟数据库执行查询
    const result = await db.query(query)

    // Calculate query duration
    const duration = `${Date.now() - startTime}ms`

    return NextResponse.json({
      success: true,
      result,
      rowCount: Array.isArray(result) ? result.length : 0,
      duration,
    })
  } catch (error) {
    console.error("执行查询时出错:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "执行查询时出错",
      },
      { status: 500 },
    )
  }
}

