"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, TrendingUp, TrendingDown } from "lucide-react"

interface SignRecord {
  id: number
  member: string
  memberId: string
  amount: number
  typeId: string
  type: string
  date: string
  status: string
  description?: string
}

export function SignTableList() {
  const [signRecords, setSignRecords] = useState<SignRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSignRecords() {
      try {
        // 使用模擬數據 API
        const response = await fetch("/api/mock-data?type=signTable")
        const data = await response.json()

        if (data && data.records) {
          setSignRecords(data.records)
        }
      } catch (error) {
        console.error("Error loading sign records:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSignRecords()
  }, [])

  // 計算總盈虧
  const totalProfit = signRecords.reduce((total, transaction) => {
    if (transaction.typeId === "sign") {
      return total + transaction.amount
    } else if (transaction.typeId === "return") {
      return total - transaction.amount
    }
    return total
  }, 0)

  // 計算簽碼總額
  const totalSign = signRecords.reduce((total, transaction) => {
    if (transaction.typeId === "sign") {
      return total + transaction.amount
    }
    return total
  }, 0)

  // 計算還碼總額
  const totalReturn = signRecords.reduce((total, transaction) => {
    if (transaction.typeId === "return") {
      return total + transaction.amount
    }
    return total
  }, 0)

  // 按會員分組數據
  const memberSummary = signRecords.reduce(
    (acc, transaction) => {
      if (!acc[transaction.memberId]) {
        acc[transaction.memberId] = {
          member: transaction.member,
          memberId: transaction.memberId,
          signAmount: 0,
          returnAmount: 0,
          netProfit: 0,
        }
      }

      if (transaction.typeId === "sign") {
        acc[transaction.memberId].signAmount += transaction.amount
        acc[transaction.memberId].netProfit += transaction.amount
      } else if (transaction.typeId === "return") {
        acc[transaction.memberId].returnAmount += transaction.amount
        acc[transaction.memberId].netProfit -= transaction.amount
      }

      return acc
    },
    {} as Record<string, any>,
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-8">加載中...</div>
        </CardContent>
      </Card>
    )
  }

  if (signRecords.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-8">沒有簽碼記錄</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 簽碼表摘要 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>簽碼表摘要 - {new Date().toLocaleDateString("zh-HK")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <h3 className="text-sm font-medium text-green-700">簽碼總額</h3>
              <p className="mt-2 text-2xl font-bold text-green-600">+${totalSign}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <h3 className="text-sm font-medium text-red-700">還碼總額</h3>
              <p className="mt-2 text-2xl font-bold text-red-600">-${totalReturn}</p>
            </div>
            <div className={`rounded-lg p-4 text-center ${totalProfit >= 0 ? "bg-blue-50" : "bg-orange-50"}`}>
              <h3 className={`text-sm font-medium ${totalProfit >= 0 ? "text-blue-700" : "text-orange-700"}`}>
                淨盈虧
              </h3>
              <p className={`mt-2 text-2xl font-bold ${totalProfit >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                {totalProfit >= 0 ? "+" : "-"}${Math.abs(totalProfit)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 會員簽碼摘要 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>會員簽碼摘要</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                  <th className="px-4 py-3">會員</th>
                  <th className="px-4 py-3 text-right">簽碼金額</th>
                  <th className="px-4 py-3 text-right">還碼金額</th>
                  <th className="px-4 py-3 text-right">淨盈虧</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(memberSummary).map((summary: any) => (
                  <tr key={summary.memberId} className="border-b text-sm">
                    <td className="px-4 py-3">
                      <Link href={`/members/${summary.memberId}`} className="text-blue-600 hover:underline">
                        {summary.member}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">+${summary.signAmount}</td>
                    <td className="px-4 py-3 text-right text-red-600 font-medium">-${summary.returnAmount}</td>
                    <td className="px-4 py-3 text-right font-bold">
                      <span className={summary.netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                        {summary.netProfit >= 0 ? "+" : "-"}${Math.abs(summary.netProfit)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/members/${summary.memberId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          詳情
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-medium">
                <tr>
                  <td className="px-4 py-3">總計</td>
                  <td className="px-4 py-3 text-right text-green-600">+${totalSign}</td>
                  <td className="px-4 py-3 text-right text-red-600">-${totalReturn}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={totalProfit >= 0 ? "text-green-600" : "text-red-600"}>
                      {totalProfit >= 0 ? "+" : "-"}${Math.abs(totalProfit)}
                    </span>
                  </td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 交易明細 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>交易明細</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">會員</th>
                  <th className="px-4 py-3">類型</th>
                  <th className="px-4 py-3">金額</th>
                  <th className="px-4 py-3">日期</th>
                  <th className="px-4 py-3">說明</th>
                  <th className="px-4 py-3">狀態</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {signRecords.map((transaction) => (
                  <tr key={transaction.id} className="border-b text-sm">
                    <td className="px-4 py-3">{transaction.id}</td>
                    <td className="px-4 py-3">
                      <Link href={`/members/${transaction.memberId}`} className="text-blue-600 hover:underline">
                        {transaction.member}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {transaction.typeId === "sign" ? (
                        <span className="flex items-center text-green-600">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          {transaction.type}
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <TrendingDown className="mr-1 h-4 w-4" />
                          {transaction.type}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {transaction.typeId === "sign" ? (
                        <span className="text-green-600">+${transaction.amount}</span>
                      ) : (
                        <span className="text-red-600">-${transaction.amount}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{transaction.date}</td>
                    <td className="px-4 py-3">{transaction.description || "-"}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={transaction.status === "盈利" ? "success" : "destructive"}
                        className={
                          transaction.status === "盈利" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/transactions/${transaction.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">查看</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignTableList

