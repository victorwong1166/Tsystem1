import { NextResponse } from "next/server"
import { testVercelConnection } from "@/lib/db-vercel"

export async function GET() {
  try {
    console.log("检查 Vercel Postgres 数据库连接...")

    // 测试数据库连接
    const result = await testVercelConnection()
    console.log("testVercelConnection 结果:", JSON.stringify(result))

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    })
  } catch (error) {
    console.error("Vercel Postgres 状态检查错误:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

