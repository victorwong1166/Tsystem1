import { NextResponse } from "next/server"
import {
  getLatestPeriodNumber,
  createSettlement,
  getSettlementHistory,
  getSettlementById,
} from "@/lib/settlement-service"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const id = searchParams.get("id")

    // 獲取最新期數
    if (action === "latest-period") {
      const periodNumber = await getLatestPeriodNumber()
      return NextResponse.json({ success: true, periodNumber })
    }

    // 獲取特定結算詳情
    if (id) {
      const result = await getSettlementById(id)
      return NextResponse.json(result)
    }

    // 獲取結算歷史
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const result = await getSettlementHistory(limit, offset)

    return NextResponse.json(result)
  } catch (error) {
    console.error("處理結算API請求失敗:", error)
    return NextResponse.json({ success: false, error: error.message || "處理請求失敗" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // 創建新結算
    const result = await createSettlement(data)

    return NextResponse.json(result)
  } catch (error) {
    console.error("創建結算失敗:", error)
    return NextResponse.json({ success: false, error: error.message || "創建結算失敗" }, { status: 500 })
  }
}

