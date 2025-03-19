import { NextResponse } from "next/server"
import { getDatabaseStats } from "@/lib/db-connect"

export async function GET() {
  try {
    const result = await getDatabaseStats()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("獲取數據庫統計信息錯誤:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

