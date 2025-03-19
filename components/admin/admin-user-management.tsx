"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, UserPlus, Key, Edit, Trash, Eye } from "lucide-react"

// 模擬用戶數據
const mockUsers = [
  {
    id: 1,
    username: "user1",
    name: "張三",
    role: "前台用戶",
    status: "活躍",
    lastLogin: "2023-05-15 14:30",
  },
  {
    id: 2,
    username: "user2",
    name: "李四",
    role: "前台用戶",
    status: "活躍",
    lastLogin: "2023-05-14 09:15",
  },
  {
    id: 3,
    username: "manager1",
    name: "王五",
    role: "前台用戶",
    status: "停用",
    lastLogin: "2023-05-10 16:45",
  },
  {
    id: 4,
    username: "admin",
    name: "系統管理員",
    role: "管理員",
    status: "活躍",
    lastLogin: "2023-05-15 18:20",
  },
]

export default function AdminUserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // 過濾用戶
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 處理密碼更改
  const handleChangePassword = () => {
    setPasswordError("")

    if (!newPassword || !confirmPassword) {
      setPasswordError("請填寫所有密碼欄位")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("密碼與確認密碼不符")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("密碼長度必須至少為8個字符")
      return
    }

    // 在實際應用中，這裡應該調用API更改密碼
    console.log(`更改用戶 ${selectedUser.username} 的密碼`)

    // 重置表單並關閉對話框
    setNewPassword("")
    setConfirmPassword("")
    setIsChangePasswordOpen(false)
    setSelectedUser(null)

    // 顯示成功消息
    alert(`用戶 ${selectedUser.name} 的密碼已成功更改`)
  }

  // 打開更改密碼對話框
  const openChangePasswordDialog = (user) => {
    setSelectedUser(user)
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setIsChangePasswordOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索用戶..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddUserOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          添加用戶
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用戶名</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>最後登入</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "活躍" ? "success" : "secondary"}
                    className={user.status === "活躍" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">打開菜單</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => console.log("查看用戶", user.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        查看詳情
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log("編輯用戶", user.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        編輯用戶
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openChangePasswordDialog(user)}>
                        <Key className="mr-2 h-4 w-4" />
                        修改密碼
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => console.log("刪除用戶", user.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        刪除用戶
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 修改密碼對話框 */}
      {selectedUser && (
        <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>修改用戶密碼</DialogTitle>
              <DialogDescription>
                為用戶 {selectedUser.name} ({selectedUser.username}) 設置新密碼
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-password" className="text-right">
                  新密碼
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  確認密碼
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {passwordError && <div className="col-span-4 text-red-500 text-sm mt-1">{passwordError}</div>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                取消
              </Button>
              <Button onClick={handleChangePassword}>更改密碼</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 添加用戶對話框 - 實際實現中需要添加表單內容 */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加新用戶</DialogTitle>
            <DialogDescription>創建新的系統用戶帳號</DialogDescription>
          </DialogHeader>
          {/* 添加用戶表單 */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsAddUserOpen(false)}>創建用戶</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

