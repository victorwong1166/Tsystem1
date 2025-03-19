"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTransactions: 0,
    totalDividends: 0,
    totalAgents: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }
        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError("無法加載統計數據。請確保數據庫已初始化。")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">系統概覽</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="會員總數"
          value={loading ? "載入中..." : stats.totalMembers.toString()}
          description="系統中的會員總數"
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="交易總數"
          value={loading ? "載入中..." : stats.totalTransactions.toString()}
          description="系統中的交易總數"
          icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="分紅總數"
          value={loading ? "載入中..." : stats.totalDividends.toString()}
          description="系統中的分紅總數"
          icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="代理總數"
          value={loading ? "載入中..." : stats.totalAgents.toString()}
          description="系統中的代理總數"
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">概覽</TabsTrigger>
          <TabsTrigger value="members">會員</TabsTrigger>
          <TabsTrigger value="transactions">交易</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <h3 className="text-lg font-medium">系統狀態</h3>
          <p>系統運行正常。使用上方的數據庫初始化面板來管理數據庫結構。</p>

          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <a href="/admin/members">管理會員</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/transactions">管理交易</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/dividends">管理分紅</a>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="members">
          <p>會員管理功能將在此顯示。</p>
        </TabsContent>
        <TabsContent value="transactions">
          <p>交易管理功能將在此顯示。</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: string
  description: string
  icon?: React.ReactNode
}

function DashboardCard({ title, value, description, icon }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

