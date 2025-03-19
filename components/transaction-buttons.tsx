"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownRight,
  Users,
  Building,
  Laptop,
  Receipt,
  Briefcase,
  PiggyBank,
  Plus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

// 支出交易類型
const expenseTransactions = [
  { id: "buy", name: "買碼", icon: DollarSign, color: "text-blue-500" },
  { id: "redeem", name: "兌碼", icon: CreditCard, color: "text-green-500" },
  { id: "return", name: "還碼", icon: TrendingDown, color: "text-red-500" },
  { id: "withdrawal", name: "取款", icon: ArrowDownRight, color: "text-orange-500" },
  { id: "labor", name: "人工", icon: Users, color: "text-purple-500" },
  { id: "rent", name: "場租", icon: Building, color: "text-indigo-500" },
  { id: "system", name: "系統", icon: Laptop, color: "text-cyan-500" },
  { id: "misc", name: "雜費", icon: Receipt, color: "text-gray-500" },
]

// 收入交易類型
const incomeTransactions = [
  { id: "sign", name: "簽碼", icon: TrendingUp, color: "text-green-500" },
  { id: "deposit", name: "存款", icon: ArrowUpCircle, color: "text-blue-500" },
  { id: "accounting", name: "帳房", icon: Briefcase, color: "text-indigo-500" },
  { id: "capital", name: "本金", icon: PiggyBank, color: "text-amber-500" },
]

// 自定義交易按鈕組件
export default function TransactionButtons({ onTransactionSelect }) {
  const [transactionMode, setTransactionMode] = useState("expense")
  const [customAmount, setCustomAmount] = useState("")
  const [showCustomAmount, setShowCustomAmount] = useState(false)

  // 處理交易按鈕點擊
  const handleTransactionClick = (transaction) => {
    // 根據模式設置金額正負號
    const amountSign = transactionMode === "expense" ? -1 : 1

    // 如果有自定義金額，使用自定義金額
    const amount = customAmount ? customAmount : "1000"

    // 創建交易數據
    const transactionData = {
      type: transaction.id,
      name: transaction.name,
      amount: amountSign * Math.abs(Number(amount)),
      mode: transactionMode,
    }

    // 調用父組件的回調函數
    if (onTransactionSelect) {
      onTransactionSelect(transactionData)
    }

    // 顯示提示
    toast({
      title: `${transaction.name}交易`,
      description: `已創建${transactionMode === "expense" ? "支出" : "收入"}交易: ${Math.abs(Number(amount)).toLocaleString()} 元`,
    })

    // 重置自定義金額
    setCustomAmount("")
    setShowCustomAmount(false)
  }

  // 獲取當前模式下的交易類型
  const currentTransactions = transactionMode === "expense" ? expenseTransactions : incomeTransactions

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">快速交易</CardTitle>
          <Tabs value={transactionMode} onValueChange={setTransactionMode} className="h-8">
            <TabsList className="h-8">
              <TabsTrigger value="expense" className="h-7 px-3 text-xs">
                支出
              </TabsTrigger>
              <TabsTrigger value="income" className="h-7 px-3 text-xs">
                收入
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-4 gap-2">
          {currentTransactions.map((transaction) => {
            const Icon = transaction.icon
            return (
              <Button
                key={transaction.id}
                variant="outline"
                className="h-auto flex-col py-3 text-center"
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="flex items-center justify-center">
                  <Icon className={`h-5 w-5 ${transaction.color}`} />
                </div>
                <span className="mt-1 text-xs">{transaction.name}</span>
                {!showCustomAmount && (
                  <Badge
                    variant="outline"
                    className={`mt-1 ${transactionMode === "expense" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
                  >
                    {transactionMode === "expense" ? "-" : "+"}1,000
                  </Badge>
                )}
              </Button>
            )
          })}

          {/* 自定義金額按鈕 */}
          <Button
            variant="outline"
            className="h-auto flex-col py-3 text-center"
            onClick={() => setShowCustomAmount(!showCustomAmount)}
          >
            <div className="flex items-center justify-center">
              <Plus className="h-5 w-5 text-gray-500" />
            </div>
            <span className="mt-1 text-xs">自定義</span>
            {showCustomAmount && (
              <input
                type="number"
                className="mt-1 w-full text-xs p-1 border rounded"
                placeholder="輸入金額"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (customAmount && Number(customAmount) > 0) {
                      // 使用第一個交易類型作為默認
                      handleTransactionClick(currentTransactions[0])
                    }
                  }
                }}
              />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

