"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Pencil, Trash2, Plus, MoveUp, MoveDown } from "lucide-react"
import { toast } from "sonner"

// 按鈕類型定義
interface CustomButton {
  id: number
  name: string
  displayName: string
  buttonType: string
  value: string
  color: string
  icon?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// 表單驗證模式
const buttonFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "名稱不能為空"),
  displayName: z.string().min(1, "顯示名稱不能為空"),
  buttonType: z.string().min(1, "按鈕類型不能為空"),
  value: z.string().min(1, "值不能為空"),
  color: z.string().default("#3b82f6"),
  icon: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
})

export default function CustomButtonsManager() {
  const [buttons, setButtons] = useState<CustomButton[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingButton, setEditingButton] = useState<CustomButton | null>(null)

  // 初始化表單
  const form = useForm<z.infer<typeof buttonFormSchema>>({
    resolver: zodResolver(buttonFormSchema),
    defaultValues: {
      name: "",
      displayName: "",
      buttonType: "transaction",
      value: "",
      color: "#3b82f6",
      icon: "",
      sortOrder: 0,
      isActive: true,
    },
  })

  // 加載按鈕數據
  const fetchButtons = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/custom-buttons")
      const result = await response.json()

      if (result.success) {
        setButtons(result.data)
      } else {
        toast.error("獲取按鈕失敗")
      }
    } catch (error) {
      console.error("Error fetching buttons:", error)
      toast.error("獲取按鈕時發生錯誤")
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加載
  useEffect(() => {
    fetchButtons()
  }, [])

  // 打開編輯對話框
  const handleEdit = (button: CustomButton) => {
    setEditingButton(button)
    form.reset({
      id: button.id,
      name: button.name,
      displayName: button.displayName,
      buttonType: button.buttonType,
      value: button.value,
      color: button.color,
      icon: button.icon || "",
      sortOrder: button.sortOrder,
      isActive: button.isActive,
    })
    setIsDialogOpen(true)
  }

  // 打開新增對話框
  const handleAdd = () => {
    setEditingButton(null)
    form.reset({
      name: "",
      displayName: "",
      buttonType: "transaction",
      value: "",
      color: "#3b82f6",
      icon: "",
      sortOrder: buttons.length,
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  // 提交表單
  const onSubmit = async (values: z.infer<typeof buttonFormSchema>) => {
    try {
      setIsSubmitting(true)

      const url = "/api/custom-buttons"
      const method = editingButton ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(editingButton ? "按鈕已更新" : "按鈕已創建")
        setIsDialogOpen(false)
        fetchButtons()
      } else {
        toast.error(result.error || "操作失敗")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("提交表單時發生錯誤")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 刪除按鈕
  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此按鈕嗎？")) {
      return
    }

    try {
      const response = await fetch(`/api/custom-buttons?id=${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast.success("按鈕已刪除")
        fetchButtons()
      } else {
        toast.error(result.error || "刪除失敗")
      }
    } catch (error) {
      console.error("Error deleting button:", error)
      toast.error("刪除按鈕時發生錯誤")
    }
  }

  // 調整排序
  const handleReorder = async (id: number, direction: "up" | "down") => {
    const buttonIndex = buttons.findIndex((b) => b.id === id)
    if (buttonIndex === -1) return

    const newButtons = [...buttons]
    const button = newButtons[buttonIndex]

    if (direction === "up" && buttonIndex > 0) {
      const prevButton = newButtons[buttonIndex - 1]

      // 交換排序值
      try {
        await Promise.all([
          fetch("/api/custom-buttons", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: button.id,
              sortOrder: prevButton.sortOrder,
            }),
          }),
          fetch("/api/custom-buttons", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: prevButton.id,
              sortOrder: button.sortOrder,
            }),
          }),
        ])

        fetchButtons()
      } catch (error) {
        console.error("Error reordering buttons:", error)
        toast.error("調整順序失敗")
      }
    } else if (direction === "down" && buttonIndex < newButtons.length - 1) {
      const nextButton = newButtons[buttonIndex + 1]

      // 交換排序值
      try {
        await Promise.all([
          fetch("/api/custom-buttons", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: button.id,
              sortOrder: nextButton.sortOrder,
            }),
          }),
          fetch("/api/custom-buttons", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: nextButton.id,
              sortOrder: button.sortOrder,
            }),
          }),
        ])

        fetchButtons()
      } catch (error) {
        console.error("Error reordering buttons:", error)
        toast.error("調整順序失敗")
      }
    }
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>自定義按鈕列表</CardTitle>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            新增按鈕
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : buttons.length === 0 ? (
            <div className="text-center p-4 text-gray-500">尚未創建任何自定義按鈕</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>排序</TableHead>
                  <TableHead>名稱</TableHead>
                  <TableHead>顯示名稱</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>值</TableHead>
                  <TableHead>顏色</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buttons.map((button) => (
                  <TableRow key={button.id}>
                    <TableCell className="flex items-center space-x-1">
                      <span>{button.sortOrder}</span>
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorder(button.id, "up")}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorder(button.id, "down")}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{button.name}</TableCell>
                    <TableCell>{button.displayName}</TableCell>
                    <TableCell>
                      {button.buttonType === "transaction"
                        ? "交易類型"
                        : button.buttonType === "payment"
                          ? "支付方式"
                          : button.buttonType}
                    </TableCell>
                    <TableCell>{button.value}</TableCell>
                    <TableCell>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: button.color }} />
                    </TableCell>
                    <TableCell>
                      {button.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          啟用
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          停用
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(button)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(button.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingButton ? "編輯按鈕" : "新增按鈕"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {editingButton && (
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => <input type="hidden" {...field} value={editingButton.id} />}
                />
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名稱 (系統標識)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="例如: deposit" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>顯示名稱</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="例如: 存款" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>按鈕類型</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇按鈕類型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="transaction">交易類型</SelectItem>
                        <SelectItem value="payment">支付方式</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>值</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="例如: deposit" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>顏色</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input {...field} type="color" className="w-12 h-10" />
                      </FormControl>
                      <Input value={field.value} onChange={field.onChange} className="flex-1" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>圖標 (可選)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="例如: ArrowUp" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>排序順序</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>啟用狀態</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    取消
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      處理中...
                    </div>
                  ) : editingButton ? (
                    "更新"
                  ) : (
                    "創建"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

