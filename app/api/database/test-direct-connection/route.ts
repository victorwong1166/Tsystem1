import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function POST(request: Request) {
  try {
    const { connectionString } = await request.json()

    if (!connectionString) {
      return NextResponse.json({ success: false, error: "未提供連接字符串" }, { status: 400 })
    }

    console.log("測試連接字符串:", connectionString.replace(/:[^:@]+@/, ":****@"))

    // 創建一個臨時連接池
    const pool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
      // 設置較短的超時時間，以便快速失敗
      connectionTimeoutMillis: 5000,
    })

    try {
      // 獲取連接
      const client = await pool.connect()

      try {
        // 執行簡單查詢
        const startTime = Date.now()
        const result = await client.query(`
          SELECT 
            current_database() as database,
            current_user as username,
            version() as version,
            inet_server_addr() as host,
            inet_server_port() as port,
            NOW() as timestamp
        `)
        const endTime = Date.now()

        const dbInfo = result.rows[0]

        return NextResponse.json({
          success: true,
          database: dbInfo.database,
          username: dbInfo.username,
          version: dbInfo.version,
          host: dbInfo.host,
          port: dbInfo.port,
          timestamp: dbInfo.timestamp,
          responseTime: `${endTime - startTime}ms`,
          message: "數據庫連接成功",
        })
      } finally {
        // 釋放客戶端
        client.release()
      }
    } catch (error) {
      console.error("數據庫連接錯誤:", error)
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "未知數據庫連接錯誤",
        },
        { status: 500 },
      )
    } finally {
      // 關閉連接池
      await pool.end()
    }
  } catch (error) {
    console.error("處理請求錯誤:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "處理請求時發生未知錯誤",
      },
      { status: 500 },
    )
  }
}

