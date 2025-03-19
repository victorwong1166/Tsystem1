"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { ChevronLeft, TrendingUp, Wallet, Users, Loader2 } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { sendDividendNotification } from "@/lib/telegram-service"

export default function SettlementPage() {
  const router = useRouter()
  const [date, setDate] = useState(new Date())
  const [periodNumber, setPeriodNumber] = useState(1) // 默認為第1期
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingTelegram, setIsSendingTelegram] = useState(false)

  // 模擬數據 - 實際應用中應從表單或API獲取
  const [settlementData, setSettlementData] = useState({
    summary: {
      totalRevenue: 150000,
      totalExpenses: -23000,
      netProfit: 127000,
      period: 1, // 默認為第1期
    },
    revenue: {
      gaming: 120000,
      services: 30000,
      other: 0,
    },
    expenses: {
      operations: -15000,
      staff: -5000,
      misc: -3000,
      rent: 0,
      system: 0,
    },
    accounts: {
      cash: {
        opening: 10000,
        closing: 25000,
        difference: 15000,
        daily: 8000, // 當天現金變動
      },
      bank: {
        opening: -50000,
        closing: -30000,
        difference: 20000,
        daily: 5000, // 當天銀行變動
      },
      receivables: {
        opening: 80000,
        closing: 172000,
        difference: 92000,
        daily: 12000, // 當天應收款變動
      },
    },
    shares: {
      total: 10,
      valuePerShare: 12700,
      valuePerHalfShare: 6350,
    },
    dailyFunds: {
      signedChips: 35000, // 當天簽碼
      returnedChips: 23000, // 當天還碼
      deposits: 15000, // 當天存款
      withdrawals: 10000, // 當天提款
      debts: 8000, // 當天欠款
      collections: 5000, // 當天收款
    },
  })

  // 獲取最新期數
  useEffect(() => {
    async function fetchLatestPeriod() {
      try {
        // 模擬API調用 - 實際應用中應調用真實API
        // const response = await fetch('/api/settlements?action=latest-period')
        // if (!response.ok) throw new Error('獲取期數失敗')
        // const data = await response.json()
        // const latestPeriod = data.periodNumber || 1

        // 由於API可能還未實現，這裡使用模擬數據
        const latestPeriod = 1 // 模擬第1期

        setPeriodNumber(latestPeriod)
        setSettlementData((prev) => ({
          ...prev,
          summary: {
            ...prev.summary,
            period: latestPeriod,
          },
        }))
      } catch (error) {
        console.error("獲取期數失敗:", error)
        toast({
          title: "獲取期數失敗",
          description: "無法獲取最新期數，使用默認值",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // 短暫延遲以模擬加載
    const timer = setTimeout(() => {
      fetchLatestPeriod()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("zh-HK").format(amount)
  }

  const handleSaveSettlement = async () => {
    try {
      setIsLoading(true)

      // 模擬API調用 - 實際應用中應調用真實API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "結算已保存",
        description: `第${periodNumber}期結算已成功保存`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("保存結算失敗:", error)
      toast({
        title: "保存結算失敗",
        description: error.message || "處理結算時發生錯誤，請重試",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendToTelegram = async () => {
    try {
      setIsSendingTelegram(true)

      // 使用 Telegram 服務發送分紅通知
      const success = await sendDividendNotification(
        "default", // 使用默認群組 ID，實際應用中可能需要從設置中獲取
        settlementData.summary.netProfit,
        settlementData.shares.valuePerShare,
      )

      if (success) {
        toast({
          title: "發送成功",
          description: "結算報表已成功發送到 Telegram 群組",
        })
      } else {
        throw new Error("發送失敗")
      }
    } catch (error) {
      console.error("發送到 Telegram 失敗:", error)
      toast({
        title: "發送失敗",
        description: "無法將結算報表發送到 Telegram 群組",
        variant: "destructive",
      })
    } finally {
      setIsSendingTelegram(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>正在加載結算數據...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">結算報表</h1>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">{format(date, "yyyy年MM月dd日")}</div>
          <div className="text-sm font-medium">
            {format(date, "HH:mm")} - 第{periodNumber}期
          </div>
        </div>
      </div>

      {/* 盈虧明細卡片 */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
              盈虧明細
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold mb-2">收入</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm">遊戲收入:</span>
                  <span className="font-medium text-green-600">{formatCurrency(settlementData.revenue.gaming)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">服務收入:</span>
                  <span className="font-medium text-green-600">{formatCurrency(settlementData.revenue.services)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">其他收入:</span>
                  <span className="font-medium">{formatCurrency(settlementData.revenue.other)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">總收入:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(settlementData.summary.totalRevenue)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold mb-2">支出</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm">運營支出:</span>
                  <span className="font-medium text-red-600">{formatCurrency(settlementData.expenses.operations)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">人員支出:</span>
                  <span className="font-medium text-red-600">{formatCurrency(settlementData.expenses.staff)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">雜項支出:</span>
                  <span className="font-medium text-red-600">{formatCurrency(settlementData.expenses.misc)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">租金:</span>
                  <span className="font-medium">{formatCurrency(settlementData.expenses.rent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">系統費用:</span>
                  <span className="font-medium">{formatCurrency(settlementData.expenses.system)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">總支出:</span>
                  <span className="font-bold text-red-600">{formatCurrency(settlementData.summary.totalExpenses)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-t-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">淨盈虧:</span>
                <span
                  className={`font-bold text-xl ${settlementData.summary.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(settlementData.summary.netProfit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 賬戶變動和分紅信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-blue-500" />
              賬戶變動
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">賬戶</th>
                    <th className="text-right py-2 font-medium">期初</th>
                    <th className="text-right py-2 font-medium">期末</th>
                    <th className="text-right py-2 font-medium">變動</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">現金</td>
                    <td className="text-right py-2">{formatCurrency(settlementData.accounts.cash.opening)}</td>
                    <td className="text-right py-2">{formatCurrency(settlementData.accounts.cash.closing)}</td>
                    <td className="text-right py-2 text-green-600">
                      {formatCurrency(settlementData.accounts.cash.difference)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">銀行</td>
                    <td className="text-right py-2">{formatCurrency(settlementData.accounts.bank.opening)}</td>
                    <td className="text-right py-2">{formatCurrency(settlementData.accounts.bank.closing)}</td>
                    <td className="text-right py-2 text-green-600">
                      {formatCurrency(settlementData.accounts.bank.difference)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">應收款</td>
                    <td className="text-right py-2">{formatCurrency(settlementData.accounts.receivables.opening)}</td>
                    <td className="text-right py-2">{formatCurrency(settlementData.accounts.receivables.closing)}</td>
                    <td className="text-right py-2 text-green-600">
                      {formatCurrency(settlementData.accounts.receivables.difference)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 當天資金信息 */}
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-semibold mb-3">當天資金信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">簽碼:</span>
                    <span className="font-medium text-purple-600">
                      {formatCurrency(settlementData.dailyFunds.signedChips)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">還碼:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(settlementData.dailyFunds.returnedChips)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">存款:</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(settlementData.dailyFunds.deposits)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">提款:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(settlementData.dailyFunds.withdrawals)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">欠款:</span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(settlementData.dailyFunds.debts)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">收款:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(settlementData.dailyFunds.collections)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">當天資金淨變動:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(
                      settlementData.accounts.cash.daily +
                        settlementData.accounts.bank.daily +
                        settlementData.accounts.receivables.daily,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple-500" />
              分紅信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">期數:</span>
                <span className="font-medium">第 {periodNumber} 期</span>
              </div>

              <div className="border-t pt-2">
                <h3 className="text-sm font-semibold mb-2">三日利潤明細 (三天一期)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      第一天 ({format(new Date(date.getTime() - 2 * 24 * 60 * 60 * 1000), "MM/dd")}):
                    </span>
                    <span className="font-medium text-green-600">{formatCurrency(42800)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      第二天 ({format(new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000), "MM/dd")}):
                    </span>
                    <span className="font-medium text-red-600">{formatCurrency(-50500)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">第三天 ({format(date, "MM/dd")}):</span>
                    <span className="font-medium text-green-600">{formatCurrency(196300)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">三日總利潤:</span>
                    <span className="font-bold text-green-600">{formatCurrency(188600)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-2">
                <h3 className="text-sm font-semibold mb-2">分紅信息</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">總份數:</span>
                    <span className="font-medium text-green-600">{settlementData.shares.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">每份金額:</span>
                    <span className="font-medium text-green-600">{formatCurrency(18860)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">半份金額:</span>
                    <span className="font-medium text-green-600">{formatCurrency(9430)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-2">
                <div className="text-xs text-muted-foreground">
                  注: 股東分紅每三天結算一次，本期為第{Math.ceil(periodNumber / 3)}個分紅周期的第
                  {((periodNumber - 1) % 3) + 1}天
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => router.push("/dashboard")} disabled={isLoading}>
          返回儀表板
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSendToTelegram}
            disabled={isLoading || isSendingTelegram}
            className="flex items-center gap-1"
          >
            {isSendingTelegram ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                發送中...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M21.5 15a3 3 0 0 1-3 3h-13a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v6Z"></path>
                  <path d="m3.5 9 9 6 9-6"></path>
                </svg>
                發送到 Telegram
              </>
            )}
          </Button>
          <Button onClick={handleSaveSettlement} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </>
            ) : (
              "保存結算"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

