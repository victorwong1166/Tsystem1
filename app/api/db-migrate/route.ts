import { NextResponse } from "next/server"
import { runMigrations } from "@/lib/db-setup"

export async function POST() {
  try {
    console.log("开始执行数据库迁移...")

    // 执行数据库迁移
    const result = await runMigrations()

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error("数据库迁移 API 错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: "数据库迁移失败",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

