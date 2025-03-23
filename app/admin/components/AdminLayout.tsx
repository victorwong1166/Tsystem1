import type { ReactNode } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { LayoutDashboard, Users, Settings, Database, BarChart3, Layers } from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions)

  // 檢查用戶是否已登錄且是管理員
  if (!session || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin")
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 側邊欄 */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">管理後台</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span>儀表板</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Users className="w-5 h-5 mr-3" />
                <span>用戶管理</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/transactions"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Database className="w-5 h-5 mr-3" />
                <span>交易記錄</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reports"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                <span>報表統計</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/custom-buttons"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Layers className="w-5 h-5 mr-3" />
                <span>自定義按鈕</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>系統設置</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* 主要內容 */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

