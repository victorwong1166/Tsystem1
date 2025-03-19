"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Plus, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Custom button type definition
interface CustomButton {
  id: number
  name: string
  type: "income" | "expense" | "transfer"
  position: number
  transactionType?: "funds" | "points" | "both"
  pointType?: string
  pointAmount?: number
  pointMultiplier?: number
}

export default function TransactionButtonsManager() {
  const [buttons, setButtons] = useState<CustomButton[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentButton, setCurrentButton] = useState<CustomButton | null>(null)
  const { toast } = useToast()
  const [pointTypes, setPointTypes] = useState([])

  // 在useEffect中加载积分类型
  useEffect(() => {
    const fetchPointTypes = async () => {
      try {
        const response = await fetch("/api/points/types")
        if (response.ok) {
          const data = await response.json()
          setPointTypes(data.types || [])
        }
      } catch (error) {
        console.error("Failed to fetch point types:", error)
      }
    }

    fetchPointTypes()
  }, [])

  // Load buttons from localStorage
  useEffect(() => {
    const savedButtons = localStorage.getItem("customTransactionButtons")
    if (savedButtons) {
      try {
        setButtons(JSON.parse(savedButtons))
      } catch (error) {
        console.error("Error parsing custom buttons:", error)
        setButtons([])
      }
    }
  }, [])

  // Save buttons to localStorage
  const saveButtons = (newButtons: CustomButton[]) => {
    localStorage.setItem("customTransactionButtons", JSON.stringify(newButtons))
    setButtons(newButtons)
    toast({
      title: "已保存",
      description: "交易按鈕設置已成功保存",
    })
  }

  // Add or update a button
  const handleSaveButton = () => {
    if (!currentButton) return

    const newButtons = [...buttons]
    const index = newButtons.findIndex((b) => b.id === currentButton.id)

    if (index >= 0) {
      // Update existing button
      newButtons[index] = currentButton
    } else {
      // Add new button
      // Find the highest ID
      const maxId = newButtons.reduce((max, button) => Math.max(max, button.id), 0)
      newButtons.push({
        ...currentButton,
        id: maxId + 1,
      })
    }

    // Sort by position
    newButtons.sort((a, b) => a.position - b.position)

    saveButtons(newButtons)
    setIsDialogOpen(false)
    setCurrentButton(null)
  }

  // Delete a button
  const handleDeleteButton = (id: number) => {
    const newButtons = buttons.filter((button) => button.id !== id)
    saveButtons(newButtons)
  }

  // Open dialog for adding a new button
  const handleAddButton = () => {
    setCurrentButton({
      id: 0,
      name: "",
      type: "expense",
      position: buttons.length + 1,
      transactionType: "funds",
      pointType: "",
      pointAmount: 0,
      pointMultiplier: 1,
    })
    setIsDialogOpen(true)
  }

  // Open dialog for editing a button
  const handleEditButton = (button: CustomButton) => {
    setCurrentButton({ ...button })
    setIsDialogOpen(true)
  }

  // Reset all buttons to default
  const handleResetButtons = () => {
    const defaultButtons: CustomButton[] = [
      { id: 1, name: "簽賬", type: "expense", position: 1, transactionType: "funds" },
      { id: 2, name: "還款", type: "income", position: 2, transactionType: "funds" },
      { id: 3, name: "轉帳", type: "transfer", position: 3, transactionType: "funds" },
      { id: 4, name: "工資", type: "income", position: 4, transactionType: "funds" },
      { id: 5, name: "獎金", type: "income", position: 5, transactionType: "funds" },
      { id: 6, name: "租金", type: "expense", position: 6, transactionType: "funds" },
      { id: 7, name: "水電", type: "expense", position: 7, transactionType: "funds" },
      { id: 8, name: "材料", type: "expense", position: 8, transactionType: "funds" },
      { id: 9, name: "設備", type: "expense", position: 9, transactionType: "funds" },
      { id: 10, name: "其他", type: "expense", position: 10, transactionType: "funds" },
    ]
    saveButtons(defaultButtons)
  }

  // Get type display text
  const getTypeText = (type: "income" | "expense" | "transfer") => {
    switch (type) {
      case "income":
        return "收入"
      case "expense":
        return "支出"
      case "transfer":
        return "轉帳"
      default:
        return type
    }
  }

  // Get type color class
  const getTypeColorClass = (type: "income" | "expense" | "transfer") => {
    switch (type) {
      case "income":
        return "text-green-600"
      case "expense":
        return "text-red-600"
      case "transfer":
        return "text-blue-600"
      default:
        return ""
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>交易按鈕管理</CardTitle>
        <CardDescription>管理快速交易頁面上顯示的自定義交易按鈕</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button onClick={handleAddButton} variant="outline" className="flex items-center gap-1">
            <Plus size={16} />
            添加按鈕
          </Button>
          <Button onClick={handleResetButtons} variant="outline" className="flex items-center gap-1">
            <Trash2 size={16} />
            重置爲默認
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">位置</TableHead>
                <TableHead>名稱</TableHead>
                <TableHead>類型</TableHead>
                <TableHead className="w-24 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buttons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    尚未添加任何自定義按鈕
                  </TableCell>
                </TableRow>
              ) : (
                buttons.map((button) => (
                  <TableRow key={button.id}>
                    <TableCell>{button.position}</TableCell>
                    <TableCell>{button.name}</TableCell>
                    <TableCell>
                      <span className={getTypeColorClass(button.type)}>{getTypeText(button.type)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditButton(button)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteButton(button.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentButton && currentButton.id ? "編輯交易按鈕" : "添加交易按鈕"}</DialogTitle>
              <DialogDescription>設置交易按鈕的名稱、類型和位置。</DialogDescription>
            </DialogHeader>
            {currentButton && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    名稱
                  </Label>
                  <Input
                    id="name"
                    value={currentButton.name}
                    onChange={(e) => setCurrentButton({ ...currentButton, name: e.target.value })}
                    className="col-span-3"
                    maxLength={4}
                    placeholder="最多4個字符"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    類型
                  </Label>
                  <Select
                    value={currentButton.type}
                    onValueChange={(value: "income" | "expense" | "transfer") =>
                      setCurrentButton({ ...currentButton, type: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="選擇交易類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">收入</SelectItem>
                      <SelectItem value="expense">支出</SelectItem>
                      <SelectItem value="transfer">轉帳</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    位置
                  </Label>
                  <Input
                    id="position"
                    type="number"
                    min={1}
                    max={10}
                    value={currentButton.position}
                    onChange={(e) =>
                      setCurrentButton({
                        ...currentButton,
                        position: Number.parseInt(e.target.value) || 1,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transactionType" className="text-right">
                    交易類型
                  </Label>
                  <Select
                    value={currentButton.transactionType || "funds"}
                    onValueChange={(value) => setCurrentButton({ ...currentButton, transactionType: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="選擇交易類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funds">僅資金</SelectItem>
                      <SelectItem value="points">僅積分</SelectItem>
                      <SelectItem value="both">資金和積分</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(currentButton.transactionType === "points" || currentButton.transactionType === "both") && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pointType" className="text-right">
                        積分類型
                      </Label>
                      <Select
                        value={currentButton.pointType || ""}
                        onValueChange={(value) => setCurrentButton({ ...currentButton, pointType: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="選擇積分類型" />
                        </SelectTrigger>
                        <SelectContent>
                          {pointTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pointAmount" className="text-right">
                        積分數量
                      </Label>
                      <Input
                        id="pointAmount"
                        type="number"
                        className="col-span-3"
                        value={currentButton.pointAmount || ""}
                        onChange={(e) =>
                          setCurrentButton({
                            ...currentButton,
                            pointAmount: e.target.value ? Number.parseInt(e.target.value) : 0,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pointMultiplier" className="text-right">
                        積分倍數
                      </Label>
                      <div className="col-span-3 flex items-center gap-2">
                        <Input
                          id="pointMultiplier"
                          type="number"
                          step="0.01"
                          value={currentButton.pointMultiplier || "1"}
                          onChange={(e) =>
                            setCurrentButton({
                              ...currentButton,
                              pointMultiplier: e.target.value ? Number.parseFloat(e.target.value) : 1,
                            })
                          }
                        />
                        <div className="text-sm text-muted-foreground">(交易金額 × 倍數 = 積分)</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                取消
              </Button>
              <Button onClick={handleSaveButton} className="flex items-center gap-1">
                <Save size={16} />
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

