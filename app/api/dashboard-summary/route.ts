import { NextResponse } from "next/server"

export async function GET() {
  // 這裡應該從數據庫獲取實際數據
  // 現在我們返回模擬數據
  const summaryData = {
    totalTransactions: 156,
    totalAmount: 245000,
    pendingPayments: 32500,
    todayTransactions: 12,
  }

  return NextResponse.json(summaryData)
}

