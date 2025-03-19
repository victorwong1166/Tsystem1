import type { Metadata } from "next"
import AdminHeader from "@/components/admin/admin-header"
import ProjectManagement from "@/components/project-management"

export const metadata: Metadata = {
  title: "項目管理 | 管理後台",
  description: "交易系統項目管理",
}

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">項目管理</h1>
          <p className="mt-2 text-gray-500">管理交易項目，方便日後使用</p>
        </div>
        <ProjectManagement />
      </main>
    </div>
  )
}

