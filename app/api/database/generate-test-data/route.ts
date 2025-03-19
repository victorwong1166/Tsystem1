import { NextResponse } from "next/server"
import { generateTestData } from "@/lib/db-test"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { table, count } = body

    if (!table) {
      return NextResponse.json({ success: false, error: "缺少表名參數" }, { status: 400 })
    }

    if (!count || count <= 0 || count > 1000) {
      return NextResponse.json({ success: false, error: "記錄數必須在1到1000之間" }, { status: 400 })
    }

    const result = await generateTestData(table, count)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("生成測試數據錯誤:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

