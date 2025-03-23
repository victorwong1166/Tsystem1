"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createTransaction } from "@/app/actions"

interface QuickTransactionProps {
  memberId: number
  memberName: string
}

interface CustomButton {
  id: number
  name: string
  displayName: string
  buttonType: string
  value: string
  color: string
  icon?: string
  isActive: boolean
}

export default function QuickTransaction({ memberId, memberName }: QuickTransactionProps) {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [transactionType, setTransactionType] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null)
  const [customButtons, setCustomButtons] = useState<CustomButton[]>([])

  // 獲取自定義按鈕
  useEffect(() => {
    const fetchCustomButtons = async () => {
      try {
        const response = await fetch("/api/custom-buttons")
        const data = await response.json()

        if (data.success) {
          setCustomButtons(data.data.filter((button: CustomButton) => button.isActive))
        }
      } catch (error) {
        console.error("Error fetching custom buttons:", error)
      }
    }

    fetchCustomButtons()
  }, [])

  // 過濾交易類型按鈕
  const transactionButtons = customButtons.filter((button) => button.buttonType === "transaction")

  // 過濾支付方式按鈕
  const paymentButtons = customButtons.filter((button) => button.buttonType === "payment")

  // 如果沒有自定義按鈕，使用默認按鈕
  const defaultTransactionButtons = [
    {
      id: -1,
      name: "buy_chips",
      displayName: "買碼",
      buttonType: "transaction",
      value: "buy_chips",
      color: "#3b82f6",
      isActive: true,
    },
    {
      id: -2,
      name: "sell_chips",
      displayName: "賣碼",
      buttonType: "transaction",
      value: "sell_chips",
      color: "#ef4444",
      isActive: true,
    },
    {
      id: -3,
      name: "sign_table",
      displayName: "簽枱",
      buttonType: "transaction",
      value: "sign_table",
      color: "#10b981",
      isActive: true,
    },
  ]

  const defaultPaymentButtons = [
    {
      id: -4,
      name: "cash",
      displayName: "現金",
      buttonType: "payment",
      value: "cash",
      color: "#f59e0b",
      isActive: true,
    },
    {
      id: -5,
      name: "bank",
      displayName: "銀行",
      buttonType: "payment",
      value: "bank",
      color: "#6366f1",
      isActive: true,
    },
    {
      id: -6,
      name: "wechat",
      displayName: "微信",
      buttonType: "payment",
      value: "wechat",
      color: "#10b981",
      isActive: true,
    },
    {
      id: -7,
      name: "alipay",
      displayName: "支付寶",
      buttonType: "payment",
      value: "alipay",
      color: "#3b82f6",
      isActive: true,
    },
  ]

  // 使用自定義按鈕或默認按鈕
  const displayTransactionButtons = transactionButtons.length > 0 ? transactionButtons : defaultTransactionButtons
  const displayPaymentButtons = paymentButtons.length > 0 ? paymentButtons : defaultPaymentButtons

  const handleTransactionTypeClick = (type: string, buttonId: number) => {
    setTransactionType(type)
    setSelectedButtonId(buttonId)
  }

  const handlePaymentMethodClick = (method: string) => {
    setPaymentMethod(method)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionType) {
      toast({
        title: "錯誤",
        description: "請選擇交易類型",
        variant: "destructive",
      })
      return
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "錯誤",
        description: "請輸入有效金額",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createTransaction({
        memberId,
        type: transactionType,
        amount: Number(amount),
        paymentMethod: paymentMethod || undefined,
        notes,
      })

      if (result.success) {
        toast({
          title: "成功",
          description: `交易已成功創建`,
        })

        // 重置表單
        setAmount("")
        setNotes("")
        setTransactionType("")
        setPaymentMethod("")
        setSelectedButtonId(null)

        // 刷新頁面
        router.refresh()
      } else {
        toast({
          title: "錯誤",
          description: result.error || "創建交易失敗",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Transaction error:", error)
      toast({
        title: "錯誤",
        description: "創建交易時發生錯誤",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">快速交易 - {memberName}</h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* 交易類型按鈕 */}
          <div>
            <Label className="block mb-2">交易類型</Label>
            <div className="flex flex-wrap gap-2">
              {displayTransactionButtons.map((button) => (
                <Button
                  key={button.id}
                  type="button"
                  onClick={() => handleTransactionTypeClick(button.value, button.id)}
                  className={`${selectedButtonId === button.id ? "ring-2 ring-offset-2" : ""}`}
                  style={{ backgroundColor: button.color }}
                >
                  {button.displayName}
                </Button>
              ))}
            </div>
          </div>

          {/* 金額輸入 */}
          <div>
            <Label htmlFor="amount">金額</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="輸入金額"
              className="mt-1"
              required
            />
          </div>

          {/* 支付方式 */}
          <div>
            <Label className="block mb-2">支付方式 (可選)</Label>
            <div className="flex flex-wrap gap-2">
              {displayPaymentButtons.map((button) => (
                <Button
                  key={button.id}
                  type="button"
                  variant={paymentMethod === button.value ? "default" : "outline"}
                  onClick={() => handlePaymentMethodClick(button.value)}
                  className="border-gray-300"
                >
                  {button.displayName}
                </Button>
              ))}
            </div>
          </div>

          {/* 備註 */}
          <div>
            <Label htmlFor="notes">備註 (可選)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="輸入備註"
              className="mt-1"
            />
          </div>

          {/* 提交按鈕 */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "處理中..." : "提交交易"}
          </Button>
        </div>
      </form>
    </div>
  )
}

