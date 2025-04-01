"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>加载中...</div>
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className="admin-layout">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">管理后台</h1>
          <p>欢迎, {session?.user?.name}</p>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex">
          <aside className="w-64 bg-gray-100 p-4">
            <nav>
              <ul>
                <li className="mb-2">
                  <a href="/admin" className="block p-2 hover:bg-gray-200 rounded">
                    仪表盘
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/admin/database" className="block p-2 hover:bg-gray-200 rounded">
                    数据库管理
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/admin/custom-buttons" className="block p-2 hover:bg-gray-200 rounded">
                    自定义按钮
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}

