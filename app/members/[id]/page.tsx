import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import { getMemberById } from "@/lib/members-db"

export default async function MemberDetailPage({
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
          <h1 className="text-3xl font-bold">會員詳情</h1>
          <div className="flex space-x-2">
            <Button asChild variant="outline">
              <Link href="/members">返回列表</Link>
            </Button>
            <Button asChild>
              <Link href={`/members/${id}/edit`}>編輯會員</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">基本信息</h2>
            <dl className="grid gap-3">
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-500">ID:</dt>
                <dd className="col-span-2">{member.id}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-500">姓名:</dt>
                <dd className="col-span-2">{member.name}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-500">電話:</dt>
                <dd className="col-span-2">{member.phone || "-"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-500">電子郵件:</dt>
                <dd className="col-span-2">{member.email || "-"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-500">地址:</dt>
                <dd className="col-span-2">{member.address || "-"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-500">類別:</dt>
                <dd className="col-span-2">{member.category || "regular"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-500">代理ID:</dt>
                <dd className="col-span-2">{member.agent_id || "-"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-500">創建時間:</dt>
                <dd className="col-span-2">{member.created_at ? new Date(member.created_at).toLocaleString() : "-"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-500">更新時間:</dt>
                <dd className="col-span-2">{member.updated_at ? new Date(member.updated_at).toLocaleString() : "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">備註</h2>
            <p className="whitespace-pre-wrap">{member.notes || "無備註"}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

