import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // 尝试执行一个简单的数据库查询
    const result = await prisma.$queryRaw`SELECT 1 as connected`

    return NextResponse.json({
      status: "success",
      message: "数据库连接成功",
      result,
    })
  } catch (error) {
    console.error("数据库连接测试失败:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "数据库连接失败",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

