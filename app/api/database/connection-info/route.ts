import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET() {
  try {
    // 检查环境变量
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL 环境变量未设置",
        connectionInfo: null,
      })
    }

    // 解析连接字符串以提取信息
    const connectionInfo = parseConnectionString(process.env.DATABASE_URL)

    // 尝试连接以验证信息
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 5000,
    })

    try {
      const client = await pool.connect()
      try {
        // 获取更多数据库信息
        const result = await client.query(`
          SELECT 
            current_database() as database_name,
            current_user as username,
            version() as version,
            inet_server_addr() as server_address,
            inet_server_port() as server_port
        `)

        const dbInfo = result.rows[0]

        return NextResponse.json({
          success: true,
          connectionInfo: {
            ...connectionInfo,
            databaseName: dbInfo.database_name,
            username: dbInfo.username,
            version: dbInfo.version,
            serverAddress: dbInfo.server_address,
            serverPort: dbInfo.server_port,
          },
        })
      } finally {
        client.release()
      }
    } finally {
      await pool.end()
    }
  } catch (error) {
    console.error("Error getting database connection info:", error)

    return NextResponse.json({
      success: false,
      error: "获取数据库连接信息失败",
      details: error.message,
      // 仍然返回解析的连接信息，即使连接失败
      connectionInfo: parseConnectionString(process.env.DATABASE_URL),
    })
  }
}

// 解析连接字符串以提取信息
function parseConnectionString(connectionString) {
  if (!connectionString) return null

  try {
    // 假设格式为: postgresql://username:password@host:port/database
    const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/
    const match = connectionString.match(regex)

    if (match) {
      return {
        provider: "postgresql",
        username: match[1],
        // 不返回密码，只返回掩码
        passwordMasked: "********",
        host: match[3],
        port: Number.parseInt(match[4]),
        database: match[5],
        ssl: connectionString.includes("sslmode=require"),
      }
    }

    // 如果格式不匹配，返回部分信息
    return {
      provider: "postgresql",
      connectionStringValid: false,
      message: "无法解析连接字符串格式",
    }
  } catch (e) {
    return {
      provider: "postgresql",
      connectionStringValid: false,
      error: e.message,
    }
  }
}

