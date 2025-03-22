"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { transactionTypes, transactionCategories } from "@/lib/transaction-types"
import type { Project } from "./project-management"
import { Loader2, CheckCircle } from "lucide-react"
import { createTransaction } from "@/lib/transactions"
import { MemberSelect } from "./member-select"

// 模擬會員數據
const mockMembers = [
  { id: "M001", name: "張三", balance: -2000 },
  { id: "M002", name: "李四", balance: 0 },
  { id: "M003", name: "王五", balance: -5000 },
  { id: "M004", name: "趙六", balance: 1000 },
  { id: "M005", name: "張偉", balance: -3500 },
  { id: "M006", name: "王偉", balance: -800 },
  { id: "M007", name: "李明", balance: 500 },
  { id: "M008", name: "陳明", balance: -1200 },
  { id: "M009", name: "黃小明", balance: -7000 },
  { id: "M010", name: "劉德華", balance: 2000 },
]

// 預設項目
const defaultProjects: Project[] = [
  {
    id: "project-deposit-to-accounting",
    name: "存款轉至帳房",
    description: "將資金從存款轉移到帳房",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: "transfer",
  },
  {
    id: "project-accounting-to-deposit",
    name: "帳房轉至存款",
    description: "將資金從帳房轉移到存款",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: "transfer",
  },
  {
    id: "project-accounting-withdrawal",
    name: "帳房取款",
    description: "從帳房提取資金",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: "expense",
  },
]

// 在 QuickTransaction 組件的參數中添加 initialData 參數
export default function QuickTransaction({ initialData = null }) {
  const [transactionType, setTransactionType] = useState("deposit")
  const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null) // 新增：跟踪選中的按鈕ID
  const [selectedMember, setSelectedMember] = useState(null)
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionResult, setTransactionResult] = useState(null)
  const [memberName, setMemberName] = useState("")
  const [filteredMembers, setFilteredMembers] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [itemDescription, setItemDescription] = useState("")
  const [activeCategory, setActiveCategory] = useState("basic")
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectType, setNewProjectType] = useState("expense")
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  // 在其他 state 定義之後添加
  const [customButtons, setCustomButtons] = useState(() => {
    // 從本地存儲加載自定義按鈕，如果沒有則使用默認值
    if (typeof window !== "undefined") {
      const savedButtons = localStorage.getItem("custom-transaction-buttons")
      if (savedButtons) {
        return JSON.parse(savedButtons)
      }
    }
    // 默認按鈕
    return [
      { id: 1, name: "簽賬", type: "expense" },
      { id: 2, name: "還款", type: "income" },
      { id: 3, name: "轉帳", type: "transfer" },
      { id: 4, name: "工資", type: "expense" },
      { id: 5, name: "獎金", type: "expense" },
      { id: 6, name: "租金", type: "expense" },
      { id: 7, name: "水電", type: "expense" },
      { id: 8, name: "材料", type: "expense" },
      { id: 9, name: "設備", type: "expense" },
      { id: 10, name: "其他", type: "expense" },
    ]
  })
  const [isCustomButtonDialogOpen, setIsCustomButtonDialogOpen] = useState(false)
  const [editingButton, setEditingButton] = useState(null)
  const [newButtonName, setNewButtonName] = useState("")
  const [newButtonType, setNewButtonType] = useState("expense")

  const handleSubmit = async () => {
    if (!selectedMember || !amount) {
      setTransactionResult({
        success: false,
        message: "請選擇會員並輸入金額",
      })
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (amountValue > 10000000) {
      setTransactionResult({
        success: false,
        message: "交易金額不能超過一千萬",
      })
      return
    }

    setIsSubmitting(true)
    setTransactionResult(null)

    try {
      const result = await createTransaction({
        member_id: selectedMember.id,
        type: transactionType,
        amount: amountValue,
        notes: notes,
        status: "completed",
      })

      setTransactionResult({
        success: true,
        message: `交易成功！交易ID: ${result[0].id}`,
      })

      // 重置表單
      setAmount("")
      setNotes("")
    } catch (error) {
      setTransactionResult({
        success: false,
        message: `交易失敗: ${error.message}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 加載保存的項目
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProjects = localStorage.getItem("transaction-projects")
      let projectsToUse = savedProjects ? JSON.parse(savedProjects) : []

      // 檢查是否已經有預設項目
      const hasDefaultProjects = projectsToUse.some((p) => defaultProjects.some((dp) => dp.id === p.id))

      // 如果沒有預設項目，添加它們
      if (!hasDefaultProjects) {
        projectsToUse = [...projectsToUse, ...defaultProjects]
        localStorage.setItem("transaction-projects", JSON.stringify(projectsToUse))
      }

      setProjects(projectsToUse)
    }
  }, [])

  // 當交易類型改變時，重置相關字段
  useEffect(() => {
    // 如果切換到轉帳類型，自動清空會員並設置為選填
    if (transactionType === "transfer") {
      setMemberName("")
      setSelectedMember(null)
    }
  }, [transactionType])

  // 處理會員搜索
  useEffect(() => {
    if (memberName.trim() === "") {
      setFilteredMembers(mockMembers)
      setSelectedMember(null)
    } else {
      const filtered = mockMembers.filter((member) => member.name.includes(memberName))
      setFilteredMembers(filtered)

      // 如果只有一個完全匹配的會員，自動選擇該會員
      const exactMatch = mockMembers.find((member) => member.name === memberName)
      if (exactMatch) {
        setSelectedMember(exactMatch)
      } else {
        setSelectedMember(null)
      }
    }
  }, [memberName])

  // 點擊外部關閉下拉框
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 處理來自交易按鈕的初始數據
  useEffect(() => {
    if (initialData) {
      // 設置交易類型
      setTransactionType(initialData.type)

      // 設置金額（去掉負號）
      setAmount(Math.abs(initialData.amount).toString())

      // 如果有項目說明，設置它
      if (initialData.description) {
        setItemDescription(initialData.description)
      }

      // 如果有選定的項目，設置它
      if (initialData.project) {
        const project = projects.find((p) => p.name === initialData.project)
        if (project) {
          setSelectedProject(project)
        }
      }
    }
  }, [initialData, projects])

  const handleAmountButtonClick = (value: number) => {
    // 如果已有金額，則添加到現有金額
    const currentAmount = amount ? Number.parseInt(amount) : 0
    const newAmount = currentAmount + value

    // 檢查是否超過一千萬上限
    if (newAmount > 10000000) {
      toast({
        title: "金額超出限制",
        description: "交易金額不能超過一千萬",
        variant: "destructive",
      })
      return
    }

    setAmount(newAmount.toString())
  }

  const handleMemberSelect = (member) => {
    setMemberName(member.name)
    setSelectedMember(member)
    setShowDropdown(false)
  }

  // 保存新項目
  const handleSaveProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "錯誤",
        description: "項目名稱不能為空",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toISOString()
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: newProjectName.trim(),
      description: "",
      createdAt: now,
      updatedAt: now,
      type: newProjectType,
    }

    const updatedProjects = [...projects, newProject]
    localStorage.setItem("transaction-projects", JSON.stringify(updatedProjects))
    setProjects(updatedProjects)
    setSelectedProject(newProject)
    setNewProjectName("")
    setIsProjectDialogOpen(false)

    toast({
      title: "項目已添加",
      description: `項目 "${newProject.name}" 已成功添加並選擇`,
    })
  }

  // 檢查當前交易類型是否需要會員
  const isTransfer = transactionType === "transfer"
  const needsMember =
    ["buy", "redeem", "sign", "return", "deposit", "withdrawal", "labor", "repayment", "clay", "codeFeed"].includes(
      transactionType,
    ) &&
    !selectedProject &&
    !isTransfer
  const needsDescription =
    ["rent", "system", "misc", "accounting", "capital"].includes(transactionType) && !selectedProject

  // 按類別過濾交易類型，只顯示基本交易類別
  const filteredTransactionTypes = transactionTypes.filter((type) => type.category === activeCategory)

  // 只顯示基本交易類別
  const visibleCategories = transactionCategories.filter((cat) => cat.id === "basic")

  // 在其他函數之後添加
  const handleSaveCustomButton = () => {
    if (!newButtonName.trim()) {
      toast({
        title: "錯誤",
        description: "按鈕名稱不能為空",
        variant: "destructive",
      })
      return
    }

    let updatedButtons
    if (editingButton) {
      // 更新現有按鈕
      updatedButtons = customButtons.map((button) =>
        button.id === editingButton.id ? { ...button, name: newButtonName.trim(), type: newButtonType } : button,
      )
    } else {
      // 添加新按鈕
      const newId = Math.max(0, ...customButtons.map((b) => b.id)) + 1
      updatedButtons = [...customButtons, { id: newId, name: newButtonName.trim(), type: newButtonType }].slice(0, 10) // 限制最多10個按鈕
    }

    setCustomButtons(updatedButtons)
    localStorage.setItem("custom-transaction-buttons", JSON.stringify(updatedButtons))
    setIsCustomButtonDialogOpen(false)
    setEditingButton(null)
    setNewButtonName("")
    setNewButtonType("expense")

    toast({
      title: editingButton ? "按鈕已更新" : "按鈕已添加",
      description: `自定義按鈕 "${newButtonName}" 已成功${editingButton ? "更新" : "添加"}`,
    })
  }

  const handleEditButton = (button) => {
    setEditingButton(button)
    setNewButtonName(button.name)
    setNewButtonType(button.type)
    setIsCustomButtonDialogOpen(true)
  }

  // 修改：更新按鈕點擊處理函數，同時設置交易類型和選中的按鈕ID
  const handleCustomButtonClick = (button) => {
    setTransactionType(button.type)
    setSelectedButtonId(button.id) // 設置選中的按鈕ID
  }

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">選擇會員</h3>
          <MemberSelect onSelect={(member) => setSelectedMember(member)} />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">交易類型</h3>
            {/* 移除自定義按鈕，只有管理員可見 */}
          </div>

          {/* 自定義按鈕 - 上下各5個 - 修改：使用selectedButtonId而不是transactionType來決定按鈕樣式 */}
          <div className="grid grid-cols-5 gap-1 mb-1">
            {customButtons.slice(0, 5).map((button) => (
              <Button
                key={button.id}
                variant={selectedButtonId === button.id ? "default" : "outline"}
                size="sm"
                className="text-xs p-1 h-8"
                onClick={() => handleCustomButtonClick(button)}
              >
                {button.name}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {customButtons.slice(5, 10).map((button) => (
              <Button
                key={button.id}
                variant={selectedButtonId === button.id ? "default" : "outline"}
                size="sm"
                className="text-xs p-1 h-8"
                onClick={() => handleCustomButtonClick(button)}
              >
                {button.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">金額</h3>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              placeholder="輸入金額"
              className="pl-8"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => handleAmountButtonClick(10)}>
              +10
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAmountButtonClick(100)}>
              +100
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAmountButtonClick(1000)}>
              +1000
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAmountButtonClick(10000)}>
              +10000
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">備註</h3>
          <Textarea placeholder="交易備註（選填）" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={!selectedMember || !amount || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              處理中...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              確認交易
            </>
          )}
        </Button>

        {transactionResult && (
          <div
            className={`mt-4 p-3 rounded-md ${
              transactionResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {transactionResult.message}
          </div>
        )}
      </CardContent>

      {selectedMember && needsMember && (
        <CardFooter className="border-t pt-4">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="font-medium mb-2 sm:mb-0">
                會員: {selectedMember.name} ({selectedMember.id})
              </div>
              <div
                className={`font-bold text-lg ${
                  selectedMember.balance < 0 ? "text-red-500" : selectedMember.balance > 0 ? "text-green-500" : ""
                }`}
              >
                當前結欠: ${selectedMember.balance}
              </div>
            </div>

            {selectedMember.balance < -5000 && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>警告: 該會員結欠金額較大，請注意風險控制</AlertDescription>
              </Alert>
            )}
          </div>
        </CardFooter>
      )}

      {/* 新增項目對話框 */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增項目</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-project-name">項目名稱</Label>
              <Input
                id="new-project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="輸入新項目名稱"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-project-type">項目類型</Label>
              <Select value={newProjectType} onValueChange={(value) => setNewProjectType(value)}>
                <SelectTrigger id="new-project-type">
                  <SelectValue placeholder="選擇項目類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">費用支出</SelectItem>
                  <SelectItem value="transfer">資金轉帳</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveProject}>保存項目</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 自定義按鈕對話框 */}
      <Dialog open={isCustomButtonDialogOpen} onOpenChange={setIsCustomButtonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingButton ? "編輯按鈕" : "新增自定義按鈕"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-button-name">按鈕名稱</Label>
              <Input
                id="new-button-name"
                value={newButtonName}
                onChange={(e) => setNewButtonName(e.target.value)}
                placeholder="輸入按鈕名稱"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-button-type">交易類型</Label>
              <Select value={newButtonType} onValueChange={(value) => setNewButtonType(value)}>
                <SelectTrigger id="new-button-type">
                  <SelectValue placeholder="選擇交易類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">收入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                  <SelectItem value="transfer">轉帳</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomButtonDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveCustomButton}>{editingButton ? "更新" : "保存"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

