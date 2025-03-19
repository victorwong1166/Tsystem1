import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User, Bell, Lock, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "交易系統 - 用戶設置",
  description: "管理您的帳戶設置",
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回儀表板
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">用戶設置</h1>
          <p className="mt-2 text-gray-500">管理您的帳戶設置和偏好</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/settings/profile">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  個人資料
                </CardTitle>
                <CardDescription>更新您的個人資料和聯繫方式</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">管理您的姓名、電子郵件、電話號碼等個人信息</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/notifications">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-amber-500" />
                  通知設置
                </CardTitle>
                <CardDescription>管理系統通知和提醒</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">設置您希望接收的通知類型和方式</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/security">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-green-500" />
                  安全設置
                </CardTitle>
                <CardDescription>管理密碼和帳戶安全</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">更改密碼、設置雙因素認證等安全選項</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/telegram">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                  Telegram 綁定
                </CardTitle>
                <CardDescription>綁定 Telegram 帳號接收通知</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">將您的帳號與 Telegram 綁定，接收即時通知和提醒</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}

