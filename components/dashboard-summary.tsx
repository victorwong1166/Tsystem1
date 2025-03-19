"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSummaryProps {
  onDebtClick?: () => void
}

export default function DashboardSummary({ onDebtClick }: DashboardSummaryProps) {
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    pendingPayments: 0,
    todayTransactions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        // 使用模擬數據 API
        const response = await fetch("/api/mock-data?type=dashboard")
        const data = await response.json()

        if (data && data.summary) {
          setSummary(data.summary)
        }
      } catch (error) {
        console.error("Error fetching summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">加載中...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cardData = [
    {
      title: "總交易數",
      value: summary.totalTransactions,
      formattedValue: summary.totalTransactions.toString(),
      icon: <Clock className="h-4 w-4 text-blue-600" />,
      bgClass: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      description: "所有已完成交易",
    },
    {
      title: "總交易金額",
      value: summary.totalAmount,
      formattedValue: `$${summary.totalAmount.toLocaleString()}`,
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
      bgClass: "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
      description: "累計交易總額",
    },
    {
      title: "待付款項",
      value: summary.pendingPayments,
      formattedValue: `$${summary.pendingPayments.toLocaleString()}`,
      icon: <AlertCircle className="h-4 w-4 text-amber-600" />,
      bgClass: "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900",
      description: "點擊查看詳情",
      onClick: onDebtClick,
    },
    {
      title: "今日交易",
      value: summary.todayTransactions,
      formattedValue: summary.todayTransactions.toString(),
      icon: <Users className="h-4 w-4 text-purple-600" />,
      bgClass: "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
      description: "今日完成交易數",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {cardData.map((card, index) => (
        <Card
          key={index}
          className={cn("overflow-hidden transition-all hover:shadow-md", card.onClick ? "cursor-pointer" : "")}
          onClick={card.onClick}
        >
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", card.bgClass)}>
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{card.formattedValue}</div>
            <p className="text-xs text-gray-500 mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

