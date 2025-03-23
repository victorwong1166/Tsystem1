"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, MoveUp, MoveDown, Loader2 } from "lucide-react"
import { toast } from "sonner"

type ButtonType = "transaction" | "payment"

interface CustomButton {
  id: number
  name: string
  displayName: string
  buttonType: ButtonType
  value: string
  color: string
  icon?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface FormData {
  name: string
  displayName: string
  buttonType: ButtonType
  value: string
  color: string
  icon?: string
  sortOrder: number
  isActive: boolean
}

export default function CustomButtonsManager() {
  const [buttons, setButtons] = useState<CustomButton[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingButton, setEditingButton] = useState<CustomButton | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
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

  useEffect(() => {
    fetchButtons()
  }, [])

  useEffect(() => {
    if (editingButton) {
      setValue("name", editingButton.name)
      setValue("displayName", editingButton.displayName)
      setValue("buttonType", editingButton.buttonType)
      setValue("value", editingButton.value)
      setValue("color", editingButton.color)
      setValue("icon", editingButton.icon || "")
      setValue("sortOrder", editingButton.sortOrder)
      setValue("isActive", editingButton.isActive)
    }
  }, [editingButton, setValue])

  const fetchButtons = async () => {
    try {
      setLoading(true)
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
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const url = "/api/custom-buttons"
      const method = editingButton ? "PUT" : "POST"
      const body = editingButton ? JSON.stringify({ id: editingButton.id, ...data }) : JSON.stringify(data)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      })

      const result = await response.json()

      if (result.success) {
        toast.success(editingButton ? "按鈕已更新" : "按鈕已創建")
        setIsDialogOpen(false)
        reset()
        setEditingButton(null)
        fetchButtons()
      } else {
        toast.error(result.error || "操作失敗")
      }
    } catch (error) {
      console.error("Error saving button:", error)
      toast.error("保存按鈕時發生錯誤")
    }
  }

  const handleEdit = (button: CustomButton) => {
    setEditingButton(button)
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/custom-buttons?id=${deleteId}`, {
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
    } finally {
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleMoveUp = async (id: number, currentOrder: number) => {
    const prevButton = buttons.find((b) => b.sortOrder < currentOrder)
    if (!prevButton) return

    try {
      // 更新當前按鈕
      await fetch("/api/custom-buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          sortOrder: prevButton.sortOrder,
        }),
      })

      // 更新前一個按鈕
      await fetch("/api/custom-buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: prevButton.id,
          sortOrder: currentOrder,
        }),
      })

      fetchButtons()
    } catch (error) {
      console.error("Error reordering buttons:", error)
      toast.error("重新排序按鈕時發生錯誤")
    }
  }

  const handleMoveDown = async (id: number, currentOrder: number) => {
    const nextButton = buttons.find((b) => b.sortOrder > currentOrder)
    if (!nextButton) return

    try {
      // 更新當前按鈕
      await fetch("/api/custom-buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          sortOrder: nextButton.sortOrder,
        }),
      })

      // 更新下一個按鈕
      await fetch("/api/custom-buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: nextButton.id,
          sortOrder: currentOrder,
        }),
      })

      fetchButtons()
    } catch (error) {
      console.error("Error reordering buttons:", error)
      toast.error("重新排序按鈕時發生錯誤")
    }
  }

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await fetch("/api/custom-buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          isActive: !isActive,
        }),
      })

      fetchButtons()
    } catch (error) {
      console.error("Error toggling button state:", error)
      toast.error("切換按鈕狀態時發生錯誤")
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingButton(null)
    reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">自定義按鈕列表</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingButton(null)
                reset()
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              新增按鈕
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingButton ? "編輯按鈕" : "新增按鈕"}</DialogTitle>
              <DialogDescription>
                {editingButton ? "修改自定義按鈕的屬性" : "創建一個新的自定義按鈕，用於交易或支付方式"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    按鈕標識
                  </Label>
                  <Input id="name" className="col-span-3" {...register("name", { required: "必填項" })} />
                  {errors.name && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="displayName" className="text-right">
                    顯示名稱
                  </Label>
                  <Input id="displayName" className="col-span-3" {...register("displayName", { required: "必填項" })} />
                  {errors.displayName && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.displayName.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="buttonType" className="text-right">
                    按鈕類型
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("buttonType", value as ButtonType)}
                    defaultValue={editingButton?.buttonType || "transaction"}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="選擇按鈕類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transaction">交易類型</SelectItem>
                      <SelectItem value="payment">支付方式</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    按鈕值
                  </Label>
                  <Input id="value" className="col-span-3" {...register("value", { required: "必填項" })} />
                  {errors.value && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.value.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    按鈕顏色
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input id="color" type="color" className="w-12 h-10 p-1" {...register("color")} />
                    <Input type="text" className="flex-1" {...register("color")} />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">
                    圖標 (可選)
                  </Label>
                  <Input id="icon" className="col-span-3" {...register("icon")} placeholder="lucide-react 圖標名稱" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sortOrder" className="text-right">
                    排序順序
                  </Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    className="col-span-3"
                    {...register("sortOrder", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isActive" className="text-right">
                    啟用狀態
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="isActive"
                      checked={editingButton?.isActive ?? true}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                    />
                    <Label htmlFor="isActive">{(editingButton?.isActive ?? true) ? "啟用" : "禁用"}</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  取消
                </Button>
                <Button type="submit">{editingButton ? "更新" : "創建"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>按鈕列表</CardTitle>
          <CardDescription>管理系統中使用的自定義交易類型和支付方式按鈕</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : buttons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暫無自定義按鈕，點擊"新增按鈕"創建</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>顯示名稱</TableHead>
                    <TableHead>標識</TableHead>
                    <TableHead>類型</TableHead>
                    <TableHead>值</TableHead>
                    <TableHead>顏色</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buttons.map((button) => (
                    <TableRow key={button.id}>
                      <TableCell className="font-medium">{button.displayName}</TableCell>
                      <TableCell>{button.name}</TableCell>
                      <TableCell>{button.buttonType === "transaction" ? "交易類型" : "支付方式"}</TableCell>
                      <TableCell>{button.value}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: button.color }} />
                          {button.color}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{button.sortOrder}</span>
                          <div className="flex flex-col ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => handleMoveUp(button.id, button.sortOrder)}
                              disabled={buttons.findIndex((b) => b.sortOrder < button.sortOrder) === -1}
                            >
                              <MoveUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => handleMoveDown(button.id, button.sortOrder)}
                              disabled={buttons.findIndex((b) => b.sortOrder > button.sortOrder) === -1}
                            >
                              <MoveDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={button.isActive}
                          onCheckedChange={() => handleToggleActive(button.id, button.isActive)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(button)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog
                            open={isDeleteDialogOpen && deleteId === button.id}
                            onOpenChange={(open) => {
                              setIsDeleteDialogOpen(open)
                              if (!open) setDeleteId(null)
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => setDeleteId(button.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>確認刪除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  您確定要刪除按鈕 "{button.displayName}" 嗎？此操作無法撤銷。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>刪除</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

