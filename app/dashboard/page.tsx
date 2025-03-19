"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSummary from "@/components/dashboard-summary"
import QuickTransaction from "@/components/quick-transaction"
import TransactionList from "@/components/transaction-list"
import CustomerDebtList from "@/components/customer-debt-list"
import CheckoutModal from "@/components/checkout-modal"
import { Button } from "@/components/ui/button"
import { ClockIcon, Users, PieChart, FileText, ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { addDays, format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const [showDebtList, setShowDebtList] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [showDividendInfo, setShowDividendInfo] = useState(false)
  const [showSignTable, setShowSignTable] = useState(false)
  const nextSettlementDate = addDays(new Date(), 3 - (new Date().getDate() % 3))

  const handleDebtClick = () => {
    setShowDebtList(true)
    setShowSignTable(false)
  }

  const handleRecentTransactionsClick = () => {
    setShowDebtList(false)
    setShowSignTable(false)
  }

  const handleDividendClick = () => {
    setShowDebtList(false)
    setShowDividendInfo(!showDividendInfo)
  }

  const handleSignTableClick = () => {
    setShowDebtList(false)
    setShowSignTable(true)
    setShowDividendInfo(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">儀表板</h1>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 border-green-300 text-green-700 hover:bg-green-50"
            asChild
          >
            <Link href="/settlements/new">
              <ClipboardCheck className="mr-2 h-3.5 w-3.5" />
              結算
            </Link>
          </Button>
        </div>

        {/* 交易表單模組 */}
        <div className="mb-6">
          <QuickTransaction />
        </div>

        {/* 將 DashboardSummary 移到這裡 */}
        <DashboardSummary onDebtClick={handleDebtClick} />

        <div className="mt-6 md:mt-8">
          <Card className="mb-4 shadow-sm">
            <CardHeader className="py-3 px-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <CardTitle className="text-lg sm:text-xl font-semibold">
                  {showDebtList ? "客戶結欠清單" : showSignTable ? "簽碼表" : "今日交易記錄"}
                </CardTitle>
                <div className="flex flex-wrap gap-2 sm:ml-4">
                  <Button
                    variant={showDebtList ? "outline" : "default"}
                    size="sm"
                    onClick={handleRecentTransactionsClick}
                    className="h-8 px-3"
                  >
                    <ClockIcon className="mr-2 h-3.5 w-3.5" />
                    今日交易
                  </Button>
                  <Button
                    variant={showDebtList ? "default" : "outline"}
                    size="sm"
                    onClick={handleDebtClick}
                    className="h-8 px-3"
                  >
                    <Users className="mr-2 h-3.5 w-3.5" />
                    客戶結欠
                  </Button>
                  <Button
                    variant={showSignTable ? "default" : "outline"}
                    size="sm"
                    onClick={handleSignTableClick}
                    className="h-8 px-3"
                  >
                    <FileText className="mr-2 h-3.5 w-3.5" />
                    簽碼表
                  </Button>
                  <Button
                    variant={showDividendInfo ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 ${
                      showDividendInfo
                        ? "bg-purple-600 text-white"
                        : "border-purple-300 text-purple-700 hover:bg-purple-50"
                    }`}
                    onClick={handleDividendClick}
                  >
                    <PieChart className="mr-2 h-3.5 w-3.5" />
                    股東分紅
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {showDebtList ? (
            <CustomerDebtList />
          ) : showSignTable ? (
            <TransactionList showOnlyToday={false} showAllTypes={false} activeType="sign_table" />
          ) : (
            <>
              {showDividendInfo && (
                <Card className="mb-4 bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <PieChart className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-medium text-purple-800">當期分紅情況</h3>
                      </div>
                      <Link href="/dividends">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white border-purple-300 text-purple-700 hover:bg-purple-100"
                        >
                          查看詳情
                        </Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                      <div className="bg-white rounded-md p-3 shadow-sm">
                        <div className="text-sm text-gray-600">當期盈利</div>
                        <div className="text-xl font-bold text-purple-700">$25,650</div>
                      </div>
                      <div className="bg-white rounded-md p-3 shadow-sm">
                        <div className="text-sm text-gray-600">每股分紅</div>
                        <div className="text-xl font-bold text-purple-700">$2,565</div>
                      </div>
                      <div className="bg-white rounded-md p-3 shadow-sm">
                        <div className="text-sm text-gray-600">結算日期</div>
                        <div className="text-lg font-medium text-purple-700">
                          {format(nextSettlementDate, "yyyy-MM-dd")}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <TransactionList showOnlyToday={true} />
            </>
          )}
        </div>
      </main>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  )
}

