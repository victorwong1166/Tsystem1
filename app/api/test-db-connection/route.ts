import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET() {
  try {
    // 检查环境变量是否存在
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL 环境变量未设置",
        },
        { status: 500 },
      )
    }

    // 尝试连接数据库
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      // 设置较短的超时时间以快速检测连接问题
      connectionTimeoutMillis: 5000,
    })

    // 测试连接
    const client = await pool.connect()
    try {
      // 执行简单查询
      const result = await client.query("SELECT NOW() as time")

      // 获取数据库信息
      const dbInfoResult = await client.query(`
        SELECT current_database() as db_name, 
               version() as version
      `)

      const dbInfo = dbInfoResult.rows[0]

      return NextResponse.json({
        success: true,
        message: "数据库连接成功",
        timestamp: result.rows[0].time,
        dbName: dbInfo.db_name,
        version: dbInfo.version,
        // 返回掩码后的连接字符串，用于显示
        connectionString: maskConnectionString(process.env.DATABASE_URL),
      })
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error) {
    console.error("Database connection test failed:", error)

    // 提供更详细的错误信息
    let errorMessage = "数据库连接失败"
    let errorDetails = error.message || "未知错误"

    // 检查常见错误类型
    if (error.message.includes("authentication failed")) {
      errorMessage = "数据库身份验证失败"
      errorDetails = "用户名或密码不正确，请检查 DATABASE_URL 环境变量"
    } else if (error.message.includes("connect ETIMEDOUT")) {
      errorMessage = "数据库连接超时"
      errorDetails = "无法连接到数据库服务器，请检查主机名和端口是否正确"
    } else if (error.message.includes("database") && error.message.includes("does not exist")) {
      errorMessage = "数据库不存在"
      errorDetails = "指定的数据库不存在，请检查 DATABASE_URL 中的数据库名称"
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}

// 掩码连接字符串，隐藏敏感信息
function maskConnectionString(connectionString) {
  if (!connectionString) return null

  try {
    // 假设格式为: postgresql://username:password@host:port/database
    const regex = /(postgresql:\/\/)([^:]+):([^@]+)@(.+)/
    return connectionString.replace(regex, "$1$2:****@$4")
  } catch (e) {
    // 如果格式不匹配，返回一个通用的掩码字符串
    return "数据库连接字符串已设置 (格式已掩码)"
  }
}

