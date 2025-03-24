import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function POST(request: Request) {
  console.log("Received test-direct-connection request")

  try {
    // Parse the request body
    let body
    let connectionString

    try {
      const requestText = await request.text()
      console.log("Request body:", requestText.replace(/:[^:@]+@/, ":****@")) // Log the request body with password masked

      try {
        body = JSON.parse(requestText)
        connectionString = body?.connectionString
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError)
        return NextResponse.json(
          {
            success: false,
            error: "Invalid JSON in request body: " + parseError.message,
          },
          { status: 400 },
        )
      }
    } catch (readError) {
      console.error("Error reading request body:", readError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to read request body: " + readError.message,
        },
        { status: 400 },
      )
    }

    if (!connectionString) {
      console.error("No connection string provided")
      return NextResponse.json(
        {
          success: false,
          error: "未提供連接字符串",
        },
        { status: 400 },
      )
    }

    // 記錄連接字符串（隱藏密碼）
    const maskedConnectionString = connectionString.replace(/:[^:@]+@/, ":****@")
    console.log("測試連接字符串:", maskedConnectionString)

    // 驗證連接字符串格式
    if (!connectionString.startsWith("postgres://")) {
      console.error("Invalid connection string format")
      return NextResponse.json(
        {
          success: false,
          error: "連接字符串格式無效，應以 'postgres://' 開頭",
        },
        { status: 400 },
      )
    }

    // 創建一個臨時連接池
    let pool = null
    try {
      const poolConfig = {
        connectionString,
        // 設置較短的超時時間，以便快速失敗
        connectionTimeoutMillis: 5000,
      }

      // Handle SSL configuration
      if (connectionString.includes("sslmode=require")) {
        poolConfig.ssl = { rejectUnauthorized: false }
        console.log("SSL enabled with rejectUnauthorized=false")
      } else if (connectionString.includes("sslmode=prefer")) {
        poolConfig.ssl = { rejectUnauthorized: false }
        console.log("SSL preferred with rejectUnauthorized=false")
      } else if (connectionString.includes("sslmode=disable")) {
        // No SSL
        console.log("SSL disabled")
      } else {
        // Default SSL behavior
        poolConfig.ssl = { rejectUnauthorized: false }
        console.log("Using default SSL configuration")
      }

      console.log(
        "Creating connection pool with config:",
        JSON.stringify({
          ...poolConfig,
          connectionString: maskedConnectionString,
        }),
      )

      pool = new Pool(poolConfig)
      console.log("Connection pool created successfully")
    } catch (error) {
      console.error("創建連接池錯誤:", error)
      return NextResponse.json(
        {
          success: false,
          error: `創建連接池失敗: ${error instanceof Error ? error.message : "未知錯誤"}`,
          details: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 },
      )
    }

    if (!pool) {
      console.error("Pool creation failed but didn't throw an error")
      return NextResponse.json(
        {
          success: false,
          error: "無法創建數據庫連接池",
        },
        { status: 500 },
      )
    }

    try {
      // 獲取連接
      console.log("嘗試連接到數據庫...")
      const client = await pool.connect()
      console.log("成功獲取數據庫連接")

      try {
        // 執行簡單查詢
        console.log("執行測試查詢...")
        const startTime = Date.now()
        const result = await client.query("SELECT 1 as test")
        const endTime = Date.now()
        console.log("基本測試查詢執行成功")

        // 如果基本查詢成功，執行更詳細的查詢
        console.log("執行詳細信息查詢...")
        const detailsQuery = `
          SELECT 
            current_database() as database,
            current_user as username,
            version() as version,
            inet_server_addr() as host,
            inet_server_port() as port,
            NOW() as timestamp
        `

        const detailsResult = await client.query(detailsQuery)
        console.log("詳細信息查詢執行成功")

        const dbInfo = detailsResult.rows[0]

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
      } catch (queryError) {
        console.error("查詢執行錯誤:", queryError)
        return NextResponse.json(
          {
            success: false,
            error: `查詢執行失敗: ${queryError instanceof Error ? queryError.message : "未知錯誤"}`,
            details: queryError instanceof Error ? queryError.stack : undefined,
          },
          { status: 500 },
        )
      } finally {
        // 釋放客戶端
        console.log("釋放數據庫連接")
        try {
          client.release()
        } catch (releaseError) {
          console.error("釋放連接時出錯:", releaseError)
        }
      }
    } catch (error) {
      console.error("數據庫連接錯誤:", error)
      // 提供更詳細的錯誤信息
      let errorMessage = "未知數據庫連接錯誤"
      if (error instanceof Error) {
        errorMessage = error.message

        // 針對常見錯誤提供更友好的錯誤信息
        if (errorMessage.includes("connect ECONNREFUSED")) {
          errorMessage = "無法連接到數據庫服務器，請檢查主機名和端口是否正確，以及服務器是否在運行"
        } else if (errorMessage.includes("password authentication failed")) {
          errorMessage = "用戶名或密碼不正確"
        } else if (errorMessage.includes("database") && errorMessage.includes("does not exist")) {
          errorMessage = "指定的數據庫不存在"
        } else if (errorMessage.includes("role") && errorMessage.includes("does not exist")) {
          errorMessage = "指定的用戶名不存在"
        } else if (errorMessage.includes("no pg_hba.conf entry")) {
          errorMessage = "服務器拒絕連接，可能是由於 pg_hba.conf 配置問題"
        } else if (errorMessage.includes("SSL")) {
          errorMessage = "SSL 連接問題: " + errorMessage
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          originalError: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 },
      )
    } finally {
      // 關閉連接池
      if (pool) {
        console.log("關閉連接池")
        try {
          await pool.end()
          console.log("連接池已關閉")
        } catch (err) {
          console.error("關閉連接池時出錯:", err)
        }
      }
    }
  } catch (error) {
    console.error("處理請求錯誤:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "處理請求時發生未知錯誤",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

