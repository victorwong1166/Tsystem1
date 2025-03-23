import type { Metadata } from "next"
import AdminDashboard from "@/components/admin/admin-dashboard"
import DatabaseTestingPanel from "@/components/admin/database-testing-panel"
import { DatabaseInitPanel } from "@/components/admin/database-init-panel"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "管理面板",
  description: "交易系統管理面板",
}

export default async function AdminPage() {
  // 注意：在實際生產環境中，應該實現適當的身份驗證和授權檢查
  // 目前我們簡化處理，假設訪問此頁面的用戶都有管理員權限

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">管理面板</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">访问前台</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <DatabaseInitPanel />
        <DatabaseTestingPanel />
        <AdminDashboard />
      </div>
    </div>
  )
}

