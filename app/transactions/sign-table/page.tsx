import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import SignTableList from "@/components/sign-table-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "交易系統 - 簽碼表",
  description: "交易系統簽碼表",
}

export default function SignTablePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/transactions">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回交易列表
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">簽碼表</h1>
          </div>
        </div>
        <SignTableList />
      </main>
    </div>
  )
}

