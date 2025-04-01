import { NextResponse } from "next/server"
import { getDatabaseStatus } from "@/lib/db-setup"

export async function GET() {
  try {
    console.log("获取数据库状态...")
    const result = await getDatabaseStatus()

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    })
  } catch (error) {
    console.error("获取数据库状态 API 错误:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

