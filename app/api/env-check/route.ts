import { NextResponse } from "next/server"

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return NextResponse.json(
      {
        success: false,
        message: "環境變量 DATABASE_URL 未設置",
      },
      { status: 500 },
    )
  }

  // 為了安全起見，只返回連接字符串的一部分
  const maskedUrl = databaseUrl.replace(/\/\/(.+?):.+?@/, "//***:***@")

  return NextResponse.json({
    success: true,
    message: "環境變量 DATABASE_URL 已設置",
    url: maskedUrl,
  })
}

