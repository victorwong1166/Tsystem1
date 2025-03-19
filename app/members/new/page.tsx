import DashboardHeader from "@/components/dashboard-header"
import MemberForm from "@/components/member-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewMemberPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/members">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回會員列表
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">新增會員</h1>
          <p className="mt-2 text-gray-500">創建新會員，只需填寫會員姓名即可快速完成註冊</p>
        </div>
        <div className="max-w-md">
          <MemberForm />
        </div>
      </main>
    </div>
  )
}

