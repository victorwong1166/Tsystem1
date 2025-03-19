import { NextResponse } from "next/server"
import { testDatabasePerformance } from "@/lib/db-test"

export async function GET() {
  try {
    const result = await testDatabasePerformance()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("數據庫性能測試錯誤:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

