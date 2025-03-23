"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit, Plus, MoveUp, MoveDown } from "lucide-react"

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
}

export default function CustomButtonsManager() {
  const [buttons, setButtons] = useState<CustomButton[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentButton, setCurrentButton] = useState<CustomButton | null>(null)

  // 新按鈕表單狀態
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    buttonType: "transaction",
    value: "",
    color: "#3b82f6",
    icon: "",
    isActive: true,
  })

  // 獲取所有按鈕
  const fetchButtons = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/custom-buttons")
      const data = await response.json()

      if (data.success) {
        // 按排序順序排列
        const sortedButtons = data.data.sort((a: CustomButton, b: CustomButton) => a.sortOrder - b.sortOrder)
        setButtons(sortedButtons)
      } else {
        toast({
          title: "錯誤",
          description: data.error || "獲取按鈕失敗",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching buttons:", error)
      toast({
        title: "錯誤",
        description: "獲取按鈕時發生錯誤",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchButtons()
  }, [])

  // 處理表單輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 處理選擇變化
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 處理開關變化
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // 添加新按鈕
  const handleAddButton = async () => {
    try {
      const response = await fetch("/api/custom-buttons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sortOrder: buttons.length, // 默認添加到最後
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "成功",
          description: "按鈕已成功添加",
        })

        // 重置表單並關閉對話框
        setFormData({
          name: "",
          displayName: "",
          buttonType: "transaction",
          value: "",
          color: "#3b82f6",
          icon: "",
          isActive: true,
        })
        setIsAddDialogOpen(false)

        // 重新獲取按鈕列表
        fetchButtons()
      } else {
        toast({
          title: "錯誤",
          description: data.error || "添加按鈕失敗",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding button:", error)
      toast({
        title: "錯誤",
        description: "添加按鈕時發生錯誤",
        variant: "destructive",
      })
    }
  }

  // 打開編輯對話框
  const openEditDialog = (button: CustomButton) => {
    setCurrentButton(button)
    setFormData({
      name: button.name,
      displayName: button.displayName,
      buttonType: button.buttonType,
      value: button.value,
      color: button.color,
      icon: button.icon || "",
      isActive: button.isActive,
    })
    setIsEditDialogOpen(true)
  }

  // 更新按鈕
  const handleUpdateButton = async () => {
    if (!currentButton) return

    try {
      const response = await fetch("/api/custom-buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentButton.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "成功",
          description: "按鈕已成功更新",
        })

        setIsEditDialogOpen(false)
        fetchButtons()
      } else {
        toast({
          title: "錯誤",
          description: data.error || "更新按鈕失敗",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating button:", error)
      toast({
        title: "錯誤",
        description: "更新按鈕時發生錯誤",
        variant: "destructive",
      })
    }
  }

  // 刪除按鈕
  const handleDeleteButton = async (id: number) => {
    if (!confirm("確定要刪除此按鈕嗎？")) return

    try {
      const response = await fetch(`/api/custom-buttons?id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "成功",
          description: "按鈕已成功刪除",
        })

        fetchButtons()
      } else {
        toast({
          title: "錯誤",
          description: data.error || "刪除按鈕失敗",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting button:", error)
      toast({
        title: "錯誤",
        description: "刪除按鈕時發生錯誤",
        variant: "destructive",
      })
    }
  }

  // 移動按鈕順序
  const handleMoveButton = async (id: number, direction: "up" | "down") => {
    const buttonIndex = buttons.findIndex((b) => b.id === id)
    if (buttonIndex === -1) return

    // 如果已經是第一個或最後一個，則不能再移動
    if (direction === "up" && buttonIndex === 0) return
    if (direction === "down" && buttonIndex === buttons.length - 1) return

    const newIndex = direction === "up" ? buttonIndex - 1 : buttonIndex + 1
    const targetButton = buttons[newIndex]

    try {
      // 更新當前按鈕的排序
      await fetch("/api/custom-buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          sortOrder: targetButton.sortOrder,
        }),
      })

      // 更新目標按鈕的排序
      await fetch("/api/custom-buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: targetButton.id,
          sortOrder: buttons[buttonIndex].sortOrder,
        }),
      })

      // 重新獲取按鈕列表
      fetchButtons()
    } catch (error) {
      console.error("Error moving button:", error)
      toast({
        title: "錯誤",
        description: "移動按鈕順序時發生錯誤",
        variant: "destructive",
      })
    }
  }

  // 切換按鈕啟用狀態
  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch("/api/custom-buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          isActive: !isActive,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "成功",
          description: `按鈕已${!isActive ? "啟用" : "禁用"}`,
        })

        fetchButtons()
      } else {
        toast({
          title: "錯誤",
          description: data.error || "更新按鈕狀態失敗",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling button state:", error)
      toast({
        title: "錯誤",
        description: "更新按鈕狀態時發生錯誤",
        variant: "destructive",
      })
    }
  }

  // 按鈕類型過濾
  const transactionButtons = buttons.filter((button) => button.buttonType === "transaction")
  const paymentButtons = buttons.filter((button) => button.buttonType === "payment")
  const otherButtons = buttons.filter((button) => button.buttonType === "other")

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">自定義按鈕列表</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> 添加按鈕
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">載入中...</div>
      ) : (
        <Tabs defaultValue="transaction">
          <TabsList className="mb-4">
            <TabsTrigger value="transaction">交易類型按鈕</TabsTrigger>
            <TabsTrigger value="payment">支付方式按鈕</TabsTrigger>
            <TabsTrigger value="other">其他按鈕</TabsTrigger>
          </TabsList>

          <TabsContent value="transaction">
            {transactionButtons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">暫無交易類型按鈕</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transactionButtons.map((button) => (
                  <ButtonCard
                    key={button.id}
                    button={button}
                    onEdit={openEditDialog}
                    onDelete={handleDeleteButton}
                    onMove={handleMoveButton}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="payment">
            {paymentButtons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">暫無支付方式按鈕</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentButtons.map((button) => (
                  <ButtonCard
                    key={button.id}
                    button={button}
                    onEdit={openEditDialog}
                    onDelete={handleDeleteButton}
                    onMove={handleMoveButton}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="other">
            {otherButtons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">暫無其他按鈕</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherButtons.map((button) => (
                  <ButtonCard
                    key={button.id}
                    button={button}
                    onEdit={openEditDialog}
                    onDelete={handleDeleteButton}
                    onMove={handleMoveButton}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* 添加按鈕對話框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加新按鈕</DialogTitle>
            <DialogDescription>創建一個新的自定義按鈕。填寫以下信息並點擊保存。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名稱
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="按鈕內部名稱 (英文)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                顯示名稱
              </Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="按鈕顯示名稱"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="buttonType" className="text-right">
                按鈕類型
              </Label>
              <Select value={formData.buttonType} onValueChange={(value) => handleSelectChange("buttonType", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="選擇按鈕類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transaction">交易類型</SelectItem>
                  <SelectItem value="payment">支付方式</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                值
              </Label>
              <Input
                id="value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="按鈕值 (英文)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                顏色
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-12"
                />
                <Input
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                圖標
              </Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="圖標名稱 (可選)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                啟用
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
                <Label htmlFor="isActive">{formData.isActive ? "啟用" : "禁用"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddButton}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 編輯按鈕對話框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>編輯按鈕</DialogTitle>
            <DialogDescription>修改按鈕信息。填寫以下信息並點擊保存。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                名稱
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="按鈕內部名稱 (英文)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-displayName" className="text-right">
                顯示名稱
              </Label>
              <Input
                id="edit-displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="按鈕顯示名稱"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-buttonType" className="text-right">
                按鈕類型
              </Label>
              <Select value={formData.buttonType} onValueChange={(value) => handleSelectChange("buttonType", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="選擇按鈕類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transaction">交易類型</SelectItem>
                  <SelectItem value="payment">支付方式</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-value" className="text-right">
                值
              </Label>
              <Input
                id="edit-value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="按鈕值 (英文)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-color" className="text-right">
                顏色
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="edit-color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-12"
                />
                <Input
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-icon" className="text-right">
                圖標
              </Label>
              <Input
                id="edit-icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="圖標名稱 (可選)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isActive" className="text-right">
                啟用
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
                <Label htmlFor="edit-isActive">{formData.isActive ? "啟用" : "禁用"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateButton}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 按鈕卡片組件
function ButtonCard({
  button,
  onEdit,
  onDelete,
  onMove,
  onToggleActive,
}: {
  button: CustomButton
  onEdit: (button: CustomButton) => void
  onDelete: (id: number) => void
  onMove: (id: number, direction: "up" | "down") => void
  onToggleActive: (id: number, isActive: boolean) => void
}) {
  return (
    <Card className={`${!button.isActive ? "opacity-60" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: button.color }}></div>
            {button.displayName}
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onMove(button.id, "up")}>
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onMove(button.id, "down")}>
              <MoveDown className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {button.name} ({button.value})
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-500">類型:</div>
          <div>
            {button.buttonType === "transaction" && "交易類型"}
            {button.buttonType === "payment" && "支付方式"}
            {button.buttonType === "other" && "其他"}
          </div>
          <div className="text-gray-500">顏色:</div>
          <div className="flex items-center">
            {button.color}
            <div className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: button.color }}></div>
          </div>
          <div className="text-gray-500">狀態:</div>
          <div>{button.isActive ? "啟用" : "禁用"}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(button)}>
            <Edit className="h-4 w-4 mr-1" /> 編輯
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(button.id)}>
            <Trash2 className="h-4 w-4 mr-1" /> 刪除
          </Button>
        </div>
        <Switch checked={button.isActive} onCheckedChange={() => onToggleActive(button.id, button.isActive)} />
      </CardFooter>
    </Card>
  )
}

