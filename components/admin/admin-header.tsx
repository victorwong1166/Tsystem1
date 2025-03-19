"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, Shield, Lock, Globe, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    // 清除管理員 cookie
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/login")
  }

  const handleSwitchToFrontend = () => {
    // 設置前台用戶 cookie (管理員同時具有前台權限)
    document.cookie = "user_session=admin_as_user; path=/; max-age=86400"
    router.push("/dashboard")
  }

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handlePasswordChange = () => {
    // Reset error
    setPasswordError("")

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("所有密碼欄位都必須填寫")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("新密碼與確認密碼不符")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("新密碼長度必須至少為8個字符")
      return
    }

    // Here you would typically call an API to change the password
    console.log("Changing password...")

    // Reset form and close dialog
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setIsPasswordDialogOpen(false)

    // Show success message (in a real app, you might use a toast notification)
    alert("密碼已成功更改")
  }

  const activeClass = "text-sm font-medium text-white"
  const inactiveClass = "text-sm font-medium text-gray-200 hover:text-white"

  return (
    <header className="sticky top-0 z-10 border-b bg-slate-900 text-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-xl font-bold flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            交易系統管理後台
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex space-x-4">
              <li>
                <Link href="/admin" className={pathname === "/admin" ? activeClass : inactiveClass}>
                  儀表板
                </Link>
              </li>
              <li>
                <Link
                  href="/admin?tab=users"
                  className={pathname.startsWith("/admin?tab=users") ? activeClass : inactiveClass}
                >
                  用戶管理
                </Link>
              </li>
              <li>
                <Link
                  href="/admin?tab=transactions"
                  className={pathname.startsWith("/admin?tab=transactions") ? activeClass : inactiveClass}
                >
                  交易日誌
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/websites"
                  className={pathname.startsWith("/admin/websites") ? activeClass : inactiveClass}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  網站管理
                </Link>
              </li>
              <li>
                <Link
                  href="/admin?tab=settings"
                  className={pathname.startsWith("/admin?tab=settings") ? activeClass : inactiveClass}
                >
                  系統設置
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            className="bg-white text-slate-900 hover:bg-gray-200 hover:text-slate-800"
            onClick={handleSwitchToFrontend}
          >
            <User className="mr-2 h-4 w-4" />
            以管理員身份訪問前台
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="管理員" />
                  <AvatarFallback>管理</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">系統管理員</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/admin?tab=settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>設置</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
                <Lock className="mr-2 h-4 w-4" />
                <span>修改密碼</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>登出</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Password Change Dialog */}
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>修改管理員密碼</DialogTitle>
                <DialogDescription>請輸入您的當前密碼和新密碼。新密碼必須至少包含8個字符。</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="current-password" className="text-right">
                    當前密碼
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="col-span-3"
                  />
                </div>
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
                    確認新密碼
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
                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handlePasswordChange}>更改密碼</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}

