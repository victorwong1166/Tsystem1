import { NextResponse } from "next/server"

export async function GET() {
  // 模擬數據
  const signRecords = [
    { customer: "張三", amount: 2000, date: "2025-03-17", status: "已簽" },
    { customer: "李四", amount: 3000, date: "2025-03-16", status: "已簽" },
    { customer: "王五", amount: 1500, date: "2025-03-15", status: "待簽" },
  ]

  return NextResponse.json(signRecords)
}

