import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db-migrate"

export async function POST() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("數據庫初始化錯誤:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

