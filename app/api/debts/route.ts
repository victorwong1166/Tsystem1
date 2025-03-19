import { NextResponse } from "next/server"

export async function GET() {
  // 模擬數據
  const debts = [
    { customer: "張三", amount: 5000, date: "2025-03-15" },
    { customer: "李四", amount: 8000, date: "2025-03-14" },
    { customer: "王五", amount: 3500, date: "2025-03-12" },
  ]

  return NextResponse.json(debts)
}

