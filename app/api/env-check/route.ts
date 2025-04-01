import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 检查环境变量是否存在
    const hasDbUrl = !!process.env.DATABASE_URL

    // 如果存在，只返回前缀部分（出于安全考虑）
    const dbUrlPrefix = hasDbUrl ? `${process.env.DATABASE_URL.substring(0, 10)}...` : "Not set"

    // 返回环境信息
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      databaseUrlSet: hasDbUrl,
      databaseUrlPrefix: dbUrlPrefix,
      vercelEnv: process.env.VERCEL_ENV || "Not a Vercel environment",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

