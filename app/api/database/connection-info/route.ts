import { NextResponse } from "next/server"

export async function GET(request: Request) {
  let databaseUrl: string | null = null // Declare databaseUrl here

  try {
    // Get the URL parameters
    const url = new URL(request.url)
    const connectionString = url.searchParams.get("connectionString")

    // Use the provided connection string or fall back to environment variable
    databaseUrl = connectionString || process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json({
        connected: false,
        error: "DATABASE_URL 環境變量未設置",
        connectionInfo: null,
      })
    }

    // 解析連接字符串以提取信息
    const connectionInfo = parseConnectionString(databaseUrl)

    // 嘗試連接以獲取更多信息
    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(databaseUrl)

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
        connected: true,
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
        connected: false,
        error: "無法連接到數據庫",
        details: error.message,
        connectionInfo: connectionInfo,
      })
    }
  } catch (error) {
    console.error("Error getting database connection info:", error)

    // 提供更詳細的錯誤信息
    let errorDetails = "未知錯誤"
    let errorCode = ""

    if (error instanceof Error) {
      errorDetails = error.message
      // 嘗試提取 PostgreSQL 錯誤代碼
      const pgErrorMatch = error.message.match(/SQLSTATE\[(\w+)\]/)
      if (pgErrorMatch) {
        errorCode = pgErrorMatch[1]
      }
    }

    return NextResponse.json({
      connected: false,
      error: "獲取數據庫連接信息失敗",
      details: errorDetails,
      errorCode: errorCode,
      // 如果有連接字符串，返回掩碼版本以便調試
      connectionStringProvided: !!databaseUrl,
      connectionStringMasked: databaseUrl ? maskConnectionString(databaseUrl) : null,
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

// 添加一個函數來掩碼連接字符串中的敏感信息
function maskConnectionString(connectionString) {
  try {
    return connectionString.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@")
  } catch (e) {
    return "無法掩碼連接字符串"
  }
}

