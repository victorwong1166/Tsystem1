"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings, Users, PieChart, ClockIcon, DollarSign, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function DashboardHeader() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-10">
      <div className="flex h-16 items-center px-4 border-b bg-white">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard" className="flex items-center">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold hidden sm:inline-block">交易系統</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              <ClockIcon className="mr-1 h-4 w-4" />
              <span className="inline-block">交易記錄</span>
            </Button>
          </Link>
          <Link href="/members">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              <Users className="mr-1 h-4 w-4" />
              <span className="inline-block">會員管理</span>
            </Button>
          </Link>
          <Link href="/dividends">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              <PieChart className="mr-1 h-4 w-4" />
              <span className="inline-block">分紅設置</span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              <Settings className="mr-1 h-4 w-4" />
              <span className="inline-block">系統設置</span>
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              <Shield className="mr-1 h-4 w-4" />
              <span className="inline-block">後台管理</span>
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="管理員" />
                  <AvatarFallback>管</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>我的帳戶</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>個人資料</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>設置</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/">
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>登出</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

