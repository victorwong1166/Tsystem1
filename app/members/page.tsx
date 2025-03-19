import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import MemberList from "@/components/member-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "交易系統 - 會員管理",
  description: "交易系統會員管理",
}

export default function MembersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">會員管理</h1>
          <Link href="/members/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              新增會員
            </Button>
          </Link>
        </div>

        <MemberList />
      </main>
    </div>
  )
}

