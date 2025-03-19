import { NextResponse } from "next/server"
import { checkTablesExist, initializeDatabase } from "@/lib/db-init"
import { testConnection } from "@/lib/db"

export async function GET() {
  try {
    // 测试数据库连接
    const connectionTest = await testConnection()

    // 检查表是否存在
    const tablesExist = await checkTablesExist()

    // 如果表不存在，初始化数据库
    let initResult = null
    if (!tablesExist.allExist) {
      initResult = await initializeDatabase()
    }

    return NextResponse.json({
      success: true,
      connectionTest,
      tablesExist,
      initResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("初始化数据库时出错:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "初始化数据库时出错",
      usingMock: true,
      timestamp: new Date().toISOString(),
    })
  }
}

