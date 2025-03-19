"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function BuyChipsForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    memberId: "",
    amount: "",
    paymentMethod: "",
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 實際應用中，這裡會調用API保存數據
    console.log("買籌碼交易:", formData)

    // 模擬保存成功後跳轉
    router.push("/transactions")
  }

  // 模擬會員列表
  const members = [
    { id: "M001", name: "張三" },
    { id: "M002", name: "李四" },
    { id: "M003", name: "王五" },
    { id: "M004", name: "趙六" },
  ]

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="memberId">會員 *</Label>
              <Select
                value={formData.memberId}
                onValueChange={(value) => handleSelectChange("memberId", value)}
                required
              >
                <SelectTrigger id="memberId">
                  <SelectValue placeholder="選擇會員" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">金額 (HKD) *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">支付方式 *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                required
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="選擇支付方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">現金</SelectItem>
                  <SelectItem value="bank">銀行轉賬</SelectItem>
                  <SelectItem value="wechat">微信支付</SelectItem>
                  <SelectItem value="alipay">支付寶</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">備註</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/transactions")}>
            取消
          </Button>
          <Button type="submit">確認交易</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

