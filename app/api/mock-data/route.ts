import { NextResponse } from "next/server"

// 模擬數據
const mockData = {
  dashboard: {
    summary: {
      totalTransactions: 156,
      totalAmount: 25650,
      pendingPayments: 3200,
      todayTransactions: 12,
    },
    transactions: [
      { id: 1, customer: "張三", amount: 1000, type: "存款", date: "2025-03-17", status: "已完成" },
      { id: 2, customer: "李四", amount: 2000, type: "取款", date: "2025-03-17", status: "已完成" },
      { id: 3, customer: "王五", amount: 1500, type: "簽碼", date: "2025-03-17", status: "待處理" },
    ],
    debts: [
      { id: 1, customer: "張三", amount: 1000, date: "2025-03-15" },
      { id: 2, customer: "李四", amount: 2000, date: "2025-03-16" },
    ],
  },
  signTable: {
    records: [
      {
        id: 1,
        member: "張三",
        memberId: "user1",
        amount: 1000,
        typeId: "sign",
        type: "簽碼",
        date: "2025-03-17",
        status: "盈利",
        description: "晚場",
      },
      {
        id: 2,
        member: "李四",
        memberId: "user2",
        amount: 2000,
        typeId: "sign",
        type: "簽碼",
        date: "2025-03-17",
        status: "盈利",
        description: "晚場",
      },
      {
        id: 3,
        member: "張三",
        memberId: "user1",
        amount: 500,
        typeId: "return",
        type: "還碼",
        date: "2025-03-17",
        status: "虧損",
        description: "晚場",
      },
    ],
  },
}

export async function GET(request: Request) {
  // 從 URL 獲取數據類型
  const url = new URL(request.url)
  const dataType = url.searchParams.get("type") || "dashboard"

  // 返回相應的模擬數據
  return NextResponse.json(mockData[dataType as keyof typeof mockData] || {})
}

