import { NextResponse } from "next/server"
import { initializeDatabase, checkTablesExist } from "@/lib/db-init"
import { testConnection } from "@/lib/db"

export async function GET() {
  try {
    console.log("检查数据库连接...")
    const connectionTest = await testConnection()
    if (!connectionTest.success) {
      console.error("数据库连接测试失败:", connectionTest.error)
      return NextResponse.json(
        {
          success: false,
          error: `数据库连接失败: ${connectionTest.error}`,
        },
        { status: 500 },
      )
    }

    console.log("数据库连接成功，检查表状态...")
    const tablesStatus = await checkTablesExist()

    return NextResponse.json({
      success: true,
      tablesStatus,
    })
  } catch (error) {
    console.error("API 路由错误:", error)
    return NextResponse.json(
      {
        success: false,
        error: `检查数据库表时出错: ${error.message}`,
        details: error.stack,
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("初始化数据库...")
    const result = await initializeDatabase()

    return NextResponse.json(result)
  } catch (error) {
    console.error("API 路由错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: `初始化数据库时出错: ${error.message}`,
        details: error.stack,
      },
      { status: 500 },
    )
  }
}

