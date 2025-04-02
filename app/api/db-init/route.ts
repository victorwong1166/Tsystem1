import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db-setup"

export async function POST(request: Request) {
  try {
    console.log("开始初始化数据库...")

    // 获取请求参数
    const body = await request.json().catch(() => ({}))
    const force = body.force === true

    // 初始化数据库
    const result = await initializeDatabase(force)

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error("数据库初始化 API 错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: "数据库初始化失败",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

