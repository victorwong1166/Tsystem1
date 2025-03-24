import Link from "next/link"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import MemberForm from "@/components/member-form"

export default function NewMemberPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">新增會員</h1>
          <Button asChild variant="outline">
            <Link href="/members">返回列表</Link>
          </Button>
        </div>

        <MemberForm />
      </main>
    </div>
  )
}

