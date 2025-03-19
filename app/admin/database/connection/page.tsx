import type { Metadata } from "next"
import DatabaseConnectionTest from "@/components/admin/database-connection-test"

export const metadata: Metadata = {
  title: "數據庫連接測試 | 管理後台",
  description: "交易系統數據庫連接測試",
}

export default function DatabaseConnectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">數據庫連接測試</h3>
        <p className="text-sm text-muted-foreground">測試與數據庫的連接並查看連接信息</p>
      </div>
      <DatabaseConnectionTest />
    </div>
  )
}

