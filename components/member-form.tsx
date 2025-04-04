"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { showMemberCreationSuccess, showErrorNotification } from "@/lib/notifications"
import { UserPlus, Save, ArrowLeft, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MemberForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dbInitializing, setDbInitializing] = useState(false)
  const [showDbAlert, setShowDbAlert] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "regular",
    agent_id: "",
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const initializeDatabase = async () => {
    try {
      setDbInitializing(true)
      const response = await fetch("/api/init-db", {
        method: "GET",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "數據庫初始化成功",
          description: data.message,
        })
        setShowDbAlert(false)
        return true
      } else {
        toast({
          variant: "destructive",
          title: "數據庫初始化失敗",
          description: data.error,
        })
        return false
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "數據庫初始化錯誤",
        description: error.message,
      })
      return false
    } finally {
      setDbInitializing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 檢查必填欄位
      if (!formData.name) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "請填寫會員姓名",
        })
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // 如果是資料表不存在的錯誤，顯示初始化數據庫選項
        if (errorData.error && errorData.error.includes("會員資料表不存在")) {
          setShowDbAlert(true)
          setIsLoading(false)
          return
        }

        throw new Error(errorData.error || "創建會員失敗")
      }

      const member = await response.json()

      // 顯示成功通知
      showMemberCreationSuccess(member.name)

      // 重定向到會員列表頁面
      router.push("/members")
    } catch (error) {
      console.error("創建會員錯誤:", error)
      showErrorNotification("創建會員失敗", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          新增會員
        </CardTitle>
        <CardDescription>添加新會員到系統</CardDescription>
      </CardHeader>

      {showDbAlert && (
        <div className="px-6 pt-6">
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <Database className="h-4 w-4" />
            <AlertTitle>數據庫未初始化</AlertTitle>
            <AlertDescription>
              <p className="mb-2">系統檢測到會員資料表不存在，需要初始化數據庫。</p>
              <Button onClick={initializeDatabase} disabled={dbInitializing} className="mt-2">
                {dbInitializing ? "初始化中..." : "初始化數據庫"}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">
                姓名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="請輸入會員姓名"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">電話號碼</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="請輸入電話號碼"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">會員類型</Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="選擇會員類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">普通會員</SelectItem>
                  <SelectItem value="agent">代理</SelectItem>
                  <SelectItem value="shareholder">股東</SelectItem>
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
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="請輸入備註信息（可選）"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-gray-50 px-6 py-4 border-t">
          <Button variant="outline" type="button" onClick={() => router.back()} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          <Button type="submit" disabled={isLoading} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            {isLoading ? "處理中..." : "保存"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

