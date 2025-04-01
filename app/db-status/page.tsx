"use client"

import { useEffect, useState } from "react"

export default function DbStatusPage() {
  const [status, setStatus] = useState<{
    success?: boolean
    message?: string
    error?: string
    timestamp?: string
    loading: boolean
  }>({
    loading: true,
  })

  useEffect(() => {
    async function checkDbStatus() {
      try {
        const response = await fetch("/api/db-status")
        const data = await response.json()
        setStatus({
          ...data,
          loading: false,
        })
      } catch (error) {
        setStatus({
          success: false,
          error: error instanceof Error ? error.message : "未知错误",
          loading: false,
        })
      }
    }

    checkDbStatus()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">数据库连接状态</h1>

      {status.loading ? (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p>正在检查数据库连接...</p>
        </div>
      ) : status.success ? (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">连接成功</h2>
          <p>{status.message}</p>
          {status.timestamp && <p className="mt-2">数据库时间: {status.timestamp}</p>}
        </div>
      ) : (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">连接失败</h2>
          <p>{status.error || "未知错误"}</p>

          <div className="mt-4 p-4 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">可能的解决方案:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>确保 DATABASE_URL 环境变量已正确设置</li>
              <li>检查数据库连接字符串格式是否正确</li>
              <li>确认数据库服务器是否在运行</li>
              <li>检查网络连接和防火墙设置</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">环境变量检查</h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p>DATABASE_URL 环境变量: {process.env.DATABASE_URL ? "已设置" : "未设置"}</p>
          <p className="mt-2 text-sm text-gray-600">
            注意: 客户端无法直接访问服务器端环境变量，除非它们以 NEXT_PUBLIC_ 开头
          </p>
        </div>
      </div>
    </div>
  )
}

