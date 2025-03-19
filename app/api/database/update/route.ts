import { NextResponse } from "next/server"
import { updateDatabase } from "@/lib/db-update"

export async function POST() {
  try {
    const result = await updateDatabase()

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("數據庫更新錯誤:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

