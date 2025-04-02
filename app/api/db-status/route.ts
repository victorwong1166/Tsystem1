import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // 尝试执行一个简单的数据库查询
    await prisma.$queryRaw`SELECT 1 as test`

    // 获取数据库表信息
    const userCount = await prisma.user.count()

    return NextResponse.json({
      status: "connected",
      message: "数据库连接成功",
      tables: {
        users: userCount,
      },
    })
  } catch (error) {
    console.error("数据库连接错误:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "数据库连接失败",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

