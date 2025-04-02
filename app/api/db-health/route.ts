import { NextResponse } from "next/server"
import { performHealthCheck } from "@/lib/db-manager"

export async function GET() {
  try {
    console.log("执行数据库健康检查...")

    // 执行健康检查
    const healthCheck = await performHealthCheck()

    return NextResponse.json(healthCheck, {
      status: healthCheck.success ? 200 : 500,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("数据库健康检查错误:", error)
    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: "数据库健康检查失败",
        error: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

