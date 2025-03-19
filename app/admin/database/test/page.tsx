import type { Metadata } from "next"
import DatabaseTestingPanel from "@/components/admin/database-testing-panel"

export const metadata: Metadata = {
  title: "數據庫測試 | 管理後台",
  description: "測試數據庫連接和執行查詢",
}

export default function DatabaseTestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">數據庫測試</h3>
        <p className="text-sm text-muted-foreground">測試數據庫連接、執行查詢和檢查數據庫狀態</p>
      </div>
      <DatabaseTestingPanel />
    </div>
  )
}

