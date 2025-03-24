import Link from "next/link"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import MemberList from "@/components/member-list"
import { getAllMembers } from "@/lib/members-db"

export default async function MembersPage() {
  // 從數據庫獲取會員數據
  const members = await getAllMembers()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">會員管理</h1>
          <Link href="/members/new">
            <Button>新增會員</Button>
          </Link>
        </div>

        <MemberList initialMembers={members} />
      </main>
    </div>
  )
}

