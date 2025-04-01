"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function CustomButtonsPage() {
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 只在客户端渲染时检查会话状态
  if (isClient && status === "unauthenticated") {
    redirect("/api/auth/signin")
  }

  // 在服务器端渲染或会话加载时显示加载状态
  if (!isClient || status === "loading") {
    return <div>加载中...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">自定义按钮</h1>
      <p>欢迎, {session?.user?.name || "用户"}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2">按钮 1</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">操作 1</button>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2">按钮 2</h2>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">操作 2</button>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2">按钮 3</h2>
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">操作 3</button>
        </div>
      </div>
    </div>
  )
}

