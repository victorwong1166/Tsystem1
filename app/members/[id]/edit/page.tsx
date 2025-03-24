import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import MemberForm from "@/components/member-form"
import { getMemberById } from "@/lib/members-db"

export default async function EditMemberPage({
  params,
}: {
  params: { id: string }
}) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const member = await getMemberById(id)

  if (!member) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">編輯會員</h1>
          <Button asChild variant="outline">
            <Link href={`/members/${id}`}>返回詳情</Link>
          </Button>
        </div>

        <MemberForm member={member} isEdit={true} />
      </main>
    </div>
  )
}

