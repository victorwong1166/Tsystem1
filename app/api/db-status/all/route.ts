import { NextResponse } from "next/server"
import { testAllConnections, getDatabaseInfo } from "@/lib/db-manager"
import { getDatabaseStatus } from "@/lib/db-setup"

export async function GET() {
  try {
    console.log("检查所有数据库连接...")

    // 测试所有数据库连接
    const connectionResults = await testAllConnections()

    // 获取数据库信息
    let dbInfo = null
    if (connectionResults.prisma.success) {
      dbInfo = await getDatabaseInfo()
    }

    // 获取数据库状态
    let dbStatus = null
    if (connectionResults.prisma.success) {
      dbStatus = await getDatabaseStatus()
    }

    return NextResponse.json({
      connections: connectionResults,
      info: dbInfo,
      status: dbStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("数据库状态检查错误:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

