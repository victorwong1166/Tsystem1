"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// 資金類型定義
const fundTypes = [
  { id: "sign", name: "簽碼" },
  { id: "bank", name: "銀頭" },
  { id: "deposit", name: "存款" },
  { id: "debt", name: "欠款" },
  { id: "cash", name: "現金" },
]

// 快速金額按鈕定義
const quickAmounts = [
  { value: 10, label: "+十" },
  { value: 100, label: "+百" },
  { value: 1000, label: "+千" },
  { value: 10000, label: "+萬" },
]

interface TransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TransferDialog({ open, onOpenChange }: TransferDialogProps) {
  const [sourceType, setSourceType] = useState("")
  const [targetType, setTargetType] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 表單驗證
    if (!sourceType || !targetType) {
      setError("請選擇來源和目標資金類型")
      return
    }

    if (sourceType === targetType) {
      setError("來源和目標資金類型不能相同")
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("請輸入有效的金額")
      return
    }

    // 清除錯誤
    setError(null)

    // 這裡可以添加實際的轉帳邏輯
    console.log(`從 ${sourceType} 轉帳 $${amount} 到 ${targetType}`)

    // 顯示成功提示
    toast({
      title: "轉帳成功",
      description: `已從${fundTypes.find((f) => f.id === sourceType)?.name}轉帳 $${amount} 到${fundTypes.find((f) => f.id === targetType)?.name}`,
    })

    // 重置表單並關閉對話框
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setSourceType("")
    setTargetType("")
    setAmount("")
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  // 處理快速金額按鈕點擊
  const handleQuickAmount = (value: number) => {
    // 獲取當前金額，如果為空則設為0
    const currentAmount = amount === "" ? 0 : Number.parseFloat(amount)
    // 計算新金額並更新
    const newAmount = currentAmount + value
    setAmount(newAmount.toString())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>資金轉帳</DialogTitle>
          <DialogDescription>在不同資金類型之間轉移金額</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sourceType">從</Label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger id="sourceType">
                <SelectValue placeholder="選擇來源資金類型" />
              </SelectTrigger>
              <SelectContent>
                {fundTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetType">到</Label>
            <Select value={targetType} onValueChange={setTargetType}>
              <SelectTrigger id="targetType">
                <SelectValue placeholder="選擇目標資金類型" />
              </SelectTrigger>
              <SelectContent>
                {fundTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">金額</Label>
            <Input
              id="amount"
              type="number"
              placeholder="輸入轉帳金額"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />

            {/* 快速金額按鈕 */}
            <div className="flex flex-wrap gap-2 mt-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount.value)}
                >
                  {quickAmount.label}
                </Button>
              ))}
            </div>
          </div>

          {error && <div className="text-sm font-medium text-red-500">{error}</div>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button type="submit">確認轉帳</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

