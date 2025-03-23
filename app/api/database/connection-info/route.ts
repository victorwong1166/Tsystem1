import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 檢查環境變量
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL 環境變量未設置",
        connectionInfo: null,
      })
    }

    // 解析連接字符串以提取信息
    const connectionInfo = parseConnectionString(process.env.DATABASE_URL)

    // 嘗試連接以獲取更多信息
    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL)

    try {
      // 獲取更多數據庫信息
      const result = await sql`
        SELECT 
          current_database() as database_name,
          current_user as username,
          version() as version,
          inet_server_addr() as server_address,
          inet_server_port() as server_port
      `

      const dbInfo = result[0]

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
    } catch (error) {
      console.error("Error getting detailed database info:", error)

      // 如果無法獲取詳細信息，僅返回解析的連接信息
      return NextResponse.json({
        success: true,
        connectionInfo: connectionInfo,
        note: "無法獲取詳細數據庫信息，僅顯示連接字符串解析結果",
      })
    }
  } catch (error) {
    console.error("Error getting database connection info:", error)

    return NextResponse.json({
      success: false,
      error: "獲取數據庫連接信息失敗",
      details: error.message,
      // 仍然返回解析的連接信息，即使連接失敗
      connectionInfo: parseConnectionString(process.env.DATABASE_URL),
    })
  }
}

// 解析連接字符串以提取信息
function parseConnectionString(connectionString) {
  if (!connectionString) return null

  try {
    // PostgreSQL 連接字符串格式: postgres://username:password@host:port/database
    const regex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/
    const match = connectionString.match(regex)

    if (match) {
      return {
        provider: "postgresql",
        username: match[1],
        // 不返回密碼，只返回掩碼
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
      message: "無法解析連接字符串格式",
    }
  } catch (e) {
    return {
      provider: "postgresql",
      connectionStringValid: false,
      error: e.message,
    }
  }
}

