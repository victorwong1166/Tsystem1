import type { Metadata } from "next"
import DatabaseManagement from "@/components/admin/database-management"

export const metadata: Metadata = {
  title: "數據庫管理 | 管理後台",
  description: "百家樂交易系統數據庫管理",
}

export default function DatabasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">數據庫管理</h3>
        <p className="text-sm text-muted-foreground">管理系統數據庫，執行備份和恢復操作</p>
      </div>
      <DatabaseManagement />
    </div>
  )
}

