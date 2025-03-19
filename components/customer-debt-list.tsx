"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Debt {
  id: number
  customer: string
  amount: number
  date: string
}

export default function CustomerDebtList() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDebts() {
      try {
        // 使用模擬數據 API
        const response = await fetch("/api/mock-data?type=dashboard")
        const data = await response.json()

        if (data && data.debts) {
          setDebts(data.debts)
        }
      } catch (error) {
        console.error("Error fetching debts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDebts()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-8">加載中...</div>
        </CardContent>
      </Card>
    )
  }

  if (debts.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-8">沒有欠款記錄</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">客戶</th>
                <th className="px-4 py-3">欠款金額</th>
                <th className="px-4 py-3">日期</th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt) => (
                <tr key={debt.id} className="border-b text-sm">
                  <td className="px-4 py-3">{debt.id}</td>
                  <td className="px-4 py-3">{debt.customer}</td>
                  <td className="px-4 py-3">${debt.amount}</td>
                  <td className="px-4 py-3">{debt.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

