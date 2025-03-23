import { NextResponse } from "next/server"
import { pool } from "@/lib/pg-connect"

export async function GET() {
  try {
    const client = await pool.connect()
    try {
      // 執行簡單查詢
      const result = await client.query("SELECT NOW() as time")

      // 檢查數據庫中的表
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `)

      return NextResponse.json({
        success: true,
        message: "數據庫連接成功",
        time: result.rows[0].time,
        tables: tablesResult.rows.map((row) => row.table_name),
      })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error("數據庫連接錯誤:", error)
    return NextResponse.json(
      {
        success: false,
        message: "數據庫連接失敗",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

