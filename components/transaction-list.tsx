"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowDownCircle, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Transaction {
  id: number
  customer: string
  amount: number
  type: string
  date: string
  status: string
}

interface TransactionListProps {
  showOnlyToday?: boolean
  showAllTypes?: boolean
  activeType?: string
}

export default function TransactionList({
  showOnlyToday = false,
  showAllTypes = true,
  activeType = "",
}: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        // 使用模擬數據 API
        const response = await fetch("/api/mock-data?type=dashboard")
        const data = await response.json()

        if (data && data.transactions) {
          setTransactions(data.transactions)
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  // 根據 showOnlyToday 和 activeType 過濾交易
  const filteredTransactions = transactions.filter((transaction) => {
    if (showOnlyToday) {
      const today = new Date().toISOString().split("T")[0]
      if (transaction.date !== today) return false
    }

    if (activeType && !showAllTypes) {
      return transaction.type.toLowerCase().includes(activeType.toLowerCase())
    }

    return true
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>交易記錄</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">加載中...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (filteredTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>交易記錄</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500">沒有交易記錄</p>
            <p className="text-sm text-gray-400">嘗試調整過濾條件或創建新交易</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTransactionIcon = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("buy") || lowerType.includes("deposit")) {
      return <ArrowUpCircle className="h-4 w-4 text-green-500" />
    }
    if (lowerType.includes("redeem") || lowerType.includes("withdrawal")) {
      return <ArrowDownCircle className="h-4 w-4 text-red-500" />
    }
    return <Clock className="h-4 w-4 text-blue-500" />
  }

  const getTransactionTypeClass = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("buy") || lowerType.includes("deposit")) {
      return "bg-green-100 text-green-800 border-green-200"
    }
    if (lowerType.includes("redeem") || lowerType.includes("withdrawal")) {
      return "bg-red-100 text-red-800 border-red-200"
    }
    if (lowerType.includes("sign")) {
      return "bg-amber-100 text-amber-800 border-amber-200"
    }
    return "bg-blue-100 text-blue-800 border-blue-200"
  }

  const getStatusClass = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes("completed") || lowerStatus.includes("成功")) {
      return "bg-green-100 text-green-800 border-green-200"
    }
    if (lowerStatus.includes("pending") || lowerStatus.includes("處理中")) {
      return "bg-amber-100 text-amber-800 border-amber-200"
    }
    if (lowerStatus.includes("failed") || lowerStatus.includes("失敗")) {
      return "bg-red-100 text-red-800 border-red-200"
    }
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>交易記錄</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">客戶</th>
                <th className="px-4 py-3">類型</th>
                <th className="px-4 py-3">金額</th>
                <th className="px-4 py-3">日期</th>
                <th className="px-4 py-3">狀態</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b text-sm hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{transaction.id}</td>
                  <td className="px-4 py-3 font-medium">{transaction.customer}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getTransactionIcon(transaction.type)}
                      <Badge variant="outline" className={cn(getTransactionTypeClass(transaction.type))}>
                        {transaction.type}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">${transaction.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{transaction.date}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn(getStatusClass(transaction.status))}>
                      {transaction.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

