import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import TelegramBindingForm from "@/components/telegram/telegram-binding-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "交易系統 - Telegram 綁定",
  description: "綁定 Telegram 帳號以接收通知",
}

export default function TelegramBindingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/settings">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回設置
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Telegram 綁定</h1>
          <p className="mt-2 text-gray-500">綁定您的 Telegram 帳號以接收即時通知</p>
        </div>
        <div className="max-w-md">
          <TelegramBindingForm />
        </div>
      </main>
    </div>
  )
}

