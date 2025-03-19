import { NextResponse } from "next/server"
import { getTableSchema } from "@/lib/db-connect"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tableName = searchParams.get("table")

    if (!tableName) {
      return NextResponse.json({ success: false, error: "Missing table parameter" }, { status: 400 })
    }

    const result = await getTableSchema(tableName)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("獲取表結構信息錯誤:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

