"use client"

import { useEffect, useState } from "react"

export default function DbTestPage() {
  const [neonStatus, setNeonStatus] = useState<{
    success?: boolean
    message?: string
    error?: string
    timestamp?: string
    loading: boolean
  }>({
    loading: true,
  })

  const [vercelStatus, setVercelStatus] = useState<{
    success?: boolean
    message?: string
    error?: string
    timestamp?: string
    loading: boolean
  }>({
    loading: true,
  })

  useEffect(() => {
    // 测试 Neon 连接
    async function checkNeonStatus() {
      try {
        const response = await fetch("/api/db-status")
        const data = await response.json()
        setNeonStatus({
          ...data,
          loading: false,
        })
      } catch (error) {
        setNeonStatus({
          success: false,
          error: error instanceof Error ? error.message : "未知错误",
          loading: false,
        })
      }
    }

    // 测试 Vercel Postgres 连接
    async function checkVercelStatus() {
      try {
        const response = await fetch("/api/vercel-db-status")
        const data = await response.json()
        setVercelStatus({
          ...data,
          loading: false,
        })
      } catch (error) {
        setVercelStatus({
          success: false,
          error: error instanceof Error ? error.message : "未知错误",
          loading: false,
        })
      }
    }

    checkNeonStatus()
    checkVercelStatus()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">数据库连接测试</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Neon 连接状态 */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Neon 连接</h2>

          {neonStatus.loading ? (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p>正在检查 Neon 数据库连接...</p>
            </div>
          ) : neonStatus.success ? (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">连接成功</h3>
              <p>{neonStatus.message}</p>
              {neonStatus.timestamp && <p className="mt-2">数据库时间: {neonStatus.timestamp}</p>}
            </div>
          ) : (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">连接失败</h3>
              <p>{neonStatus.error || "未知错误"}</p>
            </div>
          )}
        </div>

        {/* Vercel Postgres 连接状态 */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Vercel Postgres 连接</h2>

          {vercelStatus.loading ? (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p>正在检查 Vercel Postgres 连接...</p>
            </div>
          ) : vercelStatus.success ? (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">连接成功</h3>
              <p>{vercelStatus.message}</p>
              {vercelStatus.timestamp && <p className="mt-2">数据库时间: {vercelStatus.timestamp}</p>}
            </div>
          ) : (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">连接失败</h3>
              <p>{vercelStatus.error || "未知错误"}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">故障排除</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">检查环境变量</h3>
            <p>确保 DATABASE_URL 环境变量已正确设置在 Vercel 项目设置中。</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">连接字符串格式</h3>
            <p>确保您的连接字符串格式正确：</p>
            <pre className="p-3 bg-gray-100 rounded mt-2 overflow-x-auto">
              postgres://username:password@hostname:port/database
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">数据库权限</h3>
            <p>确保您的数据库用户有足够的权限执行查询。</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">网络访问</h3>
            <p>确保您的数据库允许从 Vercel 的服务器 IP 范围访问。</p>
          </div>
        </div>
      </div>
    </div>
  )
}

