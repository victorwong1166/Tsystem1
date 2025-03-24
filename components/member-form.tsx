"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Member } from "@/lib/members-db"

interface MemberFormProps {
  member?: Member
  isEdit?: boolean
}

export default function MemberForm({ member, isEdit = false }: MemberFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: member?.name || "",
    phone: member?.phone || "",
    email: member?.email || "",
    address: member?.address || "",
    category: member?.category || "regular",
    agent_id: member?.agent_id?.toString() || "",
    notes: member?.notes || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 驗證必填字段
      if (!formData.name.trim()) {
        throw new Error("會員姓名為必填項")
      }

      // 準備提交數據
      const submitData = {
        ...formData,
        agent_id: formData.agent_id ? Number.parseInt(formData.agent_id) : null,
      }

      // 根據是否為編輯模式決定API端點和方法
      const url = isEdit ? `/api/members/${member?.id}` : "/api/members"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "提交表單失敗")
      }

      const data = await response.json()

      if (data.success) {
        // 提交成功，重定向到會員列表或詳情頁
        if (isEdit) {
          router.push(`/members/${member?.id}`)
        } else {
          router.push("/members")
        }
        router.refresh() // 刷新頁面數據
      } else {
        throw new Error(data.error || "提交表單失敗")
      }
    } catch (error) {
      console.error("提交表單錯誤:", error)
      setError(error instanceof Error ? error.message : "提交表單失敗")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                姓名 <span className="text-red-500">*</span>
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">電話</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">類別</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇類別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">普通會員</SelectItem>
                  <SelectItem value="vip">VIP會員</SelectItem>
                  <SelectItem value="agent">代理</SelectItem>
                  <SelectItem value="shareholder">股東</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent_id">代理ID</Label>
              <Input id="agent_id" name="agent_id" type="number" value={formData.agent_id} onChange={handleChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">地址</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">備註</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "提交中..." : isEdit ? "更新會員" : "創建會員"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

