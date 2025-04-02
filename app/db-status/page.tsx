"use client"

import { useState, useEffect } from "react"

interface DbStatus {
  status: string
  message: string
  tables?: Record<string, number>
  error?: string
}

export default function DbStatusPage() {
  const [status, setStatus] = useState<DbStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkDbStatus() {
      try {
        const response = await fetch("/api/db-status")
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        setStatus({
          status: "error",
          message: "获取数据库状态时出错",
          error: error instanceof Error ? error.message : String(error),
        })
      } finally {
        setLoading(false)
      }
    }

    checkDbStatus()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">数据库状态检查</h1>

      {loading ? (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-center">正在检查数据库状态...</p>
        </div>
      ) : status ? (
        <div className={`p-4 rounded-lg ${status.status === "connected" ? "bg-green-100" : "bg-red-100"}`}>
          <h2 className="text-xl font-semibold mb-2">连接状态</h2>
          <p className="font-medium">状态: {status.status}</p>
          <p className="mt-2">{status.message}</p>

          {status.error && (
            <div className="mt-4">
              <h3 className="font-medium">错误信息:</h3>
              <pre className="mt-2 p-3 bg-gray-800 text-white rounded overflow-x-auto">{status.error}</pre>
            </div>
          )}

          {status.tables && (
            <div className="mt-4">
              <h3 className="font-medium">数据表信息:</h3>
              <ul className="mt-2 space-y-1">
                {Object.entries(status.tables).map(([table, count]) => (
                  <li key={table}>
                    {table}: {count} 条记录
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-red-100 rounded-lg">
          <p className="text-center">无法获取数据库状态</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">解决方案</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">1. 安装缺少的依赖</h3>
            <pre className="mt-2 p-3 bg-gray-800 text-white rounded overflow-x-auto">
              npm install @vercel/postgres idb pg drizzle-orm bcryptjs web-push
            </pre>
            <p className="mt-2 text-sm text-gray-600">或者运行我们提供的脚本:</p>
            <pre className="mt-2 p-3 bg-gray-800 text-white rounded overflow-x-auto">
              npx ts-node scripts/install-deps.ts
            </pre>
          </div>

          <div>
            <h3 className="font-medium">2. 初始化数据库</h3>
            <pre className="mt-2 p-3 bg-gray-800 text-white rounded overflow-x-auto">
              npx prisma migrate dev --name init npx ts-node scripts/init-db.ts
            </pre>
          </div>

          <div>
            <h3 className="font-medium">3. 重新部署</h3>
            <p>安装依赖并初始化数据库后，重新部署您的应用。</p>
          </div>
        </div>
      </div>
    </div>
  )
}

