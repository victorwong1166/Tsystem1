import { NextResponse } from "next/server"
import { executeTestQuery } from "@/lib/db-test"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ success: false, error: "缺少查詢參數" }, { status: 400 })
    }

    const result = await executeTestQuery(query)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("查詢執行錯誤:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

