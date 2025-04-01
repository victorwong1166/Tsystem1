import { NextResponse } from "next/server"
import { setupDatabase } from "@/lib/db-setup"

export async function GET() {
  try {
    console.log("开始数据库设置...")
    const result = await setupDatabase()
    console.log("数据库设置结果:", result)

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    })
  } catch (error) {
    console.error("数据库设置 API 错误:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

