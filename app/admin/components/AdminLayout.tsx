import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { LayoutDashboard, Users, Settings, CreditCard, Package, BarChart3, BoxIcon as ButtonIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  {
    title: "儀表板",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "用戶管理",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "交易記錄",
    href: "/admin/transactions",
    icon: CreditCard,
  },
  {
    title: "產品管理",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "報表統計",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "自定義按鈕",
    href: "/admin/custom-buttons",
    icon: ButtonIcon,
  },
  {
    title: "系統設置",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin")
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* 側邊欄 */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold">管理後台</h1>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                  )}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 主內容區 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">{children}</main>
      </div>
    </div>
  )
}

