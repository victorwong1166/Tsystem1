// components/transaction-form.jsx
"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { recordTransaction } from "@/app/actions"
import { showTransactionSuccess, showErrorNotification } from "@/lib/notifications"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionForm() {
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    member_id: "",
    type: "buy",
    amount: "",
    description: "",
  })

  // 獲取所有會員
  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch("/api/members")
        if (response.ok) {
          const data = await response.json()
          setMembers(data)
        } else {
          showErrorNotification("獲取會員列表失敗")
        }
      } catch (error) {
        console.error("獲取會員錯誤:", error)
        showErrorNotification(error)
      }
    }

    fetchMembers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.member_id) {
      showErrorNotification("請選擇會員")
      return
    }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      showErrorNotification("請輸入有效金額")
      return
    }

    setIsSubmitting(true)

    try {
      // 創建 FormData 對象
      const submitData = new FormData()
      submitData.append("member_id", formData.member_id)
      submitData.append("type", formData.type)
      submitData.append("amount", formData.amount)
      submitData.append("description", formData.description || "")

      const result = await recordTransaction(submitData)

      if (result.success) {
        // 找到會員名稱
        const memberName = members.find((m) => m.id === formData.member_id)?.name || ""

        // 顯示成功通知
        showTransactionSuccess(Number.parseFloat(formData.amount), formData.type, memberName)

        // 請求瀏覽器通知權限（如果尚未授權）
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission !== "granted" &&
          Notification.permission !== "denied"
        ) {
          await Notification.requestPermission()
        }

        router.push("/transactions")
      } else {
        showErrorNotification(result.error || "記錄交易失敗")
      }
    } catch (error) {
      console.error("交易錯誤:", error)
      showErrorNotification(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>記錄交易</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="member_id">
                會員 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.member_id}
                onValueChange={(value) => handleSelectChange("member_id", value)}
                required
              >
                <SelectTrigger id="member_id">
                  <SelectValue placeholder="選擇會員" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">交易類型</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">買碼</SelectItem>
                  <SelectItem value="redeem">兌碼</SelectItem>
                  <SelectItem value="sign">簽碼</SelectItem>
                  <SelectItem value="return">還碼</SelectItem>
                  <SelectItem value="deposit">存款</SelectItem>
                  <SelectItem value="withdrawal">取款</SelectItem>
                  <SelectItem value="labor">人工</SelectItem>
                  <SelectItem value="misc">雜費</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">
                金額 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">說明</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/transactions")} disabled={isSubmitting}>
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "處理中..." : "記錄交易"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

