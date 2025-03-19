"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Settings, Database, Globe, Activity, Layers } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon?: React.ReactNode
    submenu?: {
      href: string
      title: string
    }[]
  }[]
}

export function AdminSidebar({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => {
        const isActive = pathname === item.href
        const hasSubmenu = item.submenu && item.submenu.length > 0

        return (
          <div key={item.href} className="flex flex-col">
            <Link
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground",
                hasSubmenu && "mb-1",
              )}
            >
              {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
              <span>{item.title}</span>
            </Link>
            {hasSubmenu && (
              <div className="ml-6 flex flex-col space-y-1 mb-1">
                {item.submenu.map((subitem) => {
                  const isSubActive = pathname === subitem.href
                  return (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                        isSubActive ? "bg-primary/80 text-primary-foreground" : "hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span>{subitem.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default function AdminSidebarNav() {
  return (
    <AdminSidebar
      items={[
        {
          title: "儀表板",
          href: "/admin",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          title: "用戶管理",
          href: "/admin/users",
          icon: <Users className="h-4 w-4" />,
        },
        {
          title: "數據庫管理",
          href: "/admin/database",
          icon: <Database className="h-4 w-4" />,
          submenu: [
            {
              title: "數據庫連接",
              href: "/admin/database/connection",
            },
            {
              title: "數據庫測試",
              href: "/admin/database/test",
            },
          ],
        },
        {
          title: "網站管理",
          href: "/admin/websites",
          icon: <Globe className="h-4 w-4" />,
        },
        {
          title: "項目管理",
          href: "/admin/projects",
          icon: <Layers className="h-4 w-4" />,
        },
        {
          title: "系統監控",
          href: "/admin/monitoring",
          icon: <Activity className="h-4 w-4" />,
        },
        {
          title: "系統設置",
          href: "/admin/settings",
          icon: <Settings className="h-4 w-4" />,
        },
      ]}
    />
  )
}

