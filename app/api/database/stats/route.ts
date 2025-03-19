import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"

export async function GET() {
  try {
    // 测试数据库连接
    const connectionTest = await testConnection()

    // 使用模拟数据
    const mockStats = {
      members: 3,
      transactions: 2,
      signs: 2,
      points: 0,
      funds: 0,
    }

    return NextResponse.json({
      success: true,
      connectionTest,
      stats: connectionTest.usingMock ? mockStats : {}, // 如果使用模拟数据库，返回模拟统计数据
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("获取数据库统计信息时出错:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "获取数据库统计信息时出错",
      usingMock: true,
      timestamp: new Date().toISOString(),
    })
  }
}

