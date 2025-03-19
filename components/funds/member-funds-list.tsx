"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw } from "lucide-react"

export function MemberFundsList() {
  const [funds, setFunds] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchFunds = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/funds")
      const data = await response.json()

      if (data.success) {
        setFunds(data.data)
      } else {
        setError(data.error || "獲取資金數據失敗")
      }
    } catch (err) {
      setError("獲取資金數據失敗: " + (err.message || "未知錯誤"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFunds()
  }, [])

  // 過濾會員
  const filteredFunds = funds.filter((fund) => fund.member_name.toLowerCase().includes(searchTerm.toLowerCase()))

  // 格式化金額
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>會員資金列表</CardTitle>
        <CardDescription>查看所有會員的資金狀況</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索會員..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="ml-2" onClick={fetchFunds} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>會員名稱</TableHead>
                <TableHead className="text-right">總餘額</TableHead>
                <TableHead className="text-right">可用餘額</TableHead>
                <TableHead className="text-right">凍結餘額</TableHead>
                <TableHead className="text-center">幣種</TableHead>
                <TableHead className="text-right">最後更新</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFunds.length > 0 ? (
                filteredFunds.map((fund) => (
                  <TableRow key={fund.id}>
                    <TableCell className="font-medium">{fund.member_name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(fund.balance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(fund.available_balance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(fund.frozen_balance)}</TableCell>
                    <TableCell className="text-center">{fund.currency}</TableCell>
                    <TableCell className="text-right">{new Date(fund.last_updated).toLocaleString("zh-CN")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {loading ? "加載中..." : "沒有找到資金記錄"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

