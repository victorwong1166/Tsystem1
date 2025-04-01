import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db-migrate"

export async function GET() {
  try {
    // 记录环境变量状态（不包含敏感信息）
    console.log("检查数据库连接...")
    console.log("环境变量 DATABASE_URL 是否存在:", !!process.env.DATABASE_URL)

    if (process.env.DATABASE_URL) {
      // 只记录 URL 的前缀，不记录完整的连接字符串
      console.log("DATABASE_URL 前缀:", process.env.DATABASE_URL.substring(0, 20) + "...")
    } else {
      console.error("DATABASE_URL 环境变量未设置")
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL 环境变量未设置",
        },
        { status: 500 },
      )
    }

    // 测试数据库连接
    console.log("调用 testConnection 函数...")
    const result = await testConnection()
    console.log("testConnection 结果:", JSON.stringify(result))

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    })
  } catch (error) {
    console.error("数据库状态检查错误:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

