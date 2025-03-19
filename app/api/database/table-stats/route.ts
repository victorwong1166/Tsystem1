import { NextResponse } from "next/server"
import { getTableStatistics } from "@/lib/db-test"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get("table")

    if (!table) {
      return NextResponse.json({ success: false, error: "缺少表名參數" }, { status: 400 })
    }

    const result = await getTableStatistics(table)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("獲取表統計信息錯誤:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

