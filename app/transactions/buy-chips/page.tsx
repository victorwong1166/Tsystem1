import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import BuyChipsForm from "@/components/buy-chips-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "交易系統 - 買籌碼",
  description: "交易系統買籌碼",
}

export default function BuyChipsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/transactions">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回交易列表
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">買籌碼</h1>
        </div>
        <BuyChipsForm />
      </main>
    </div>
  )
}

