"use client"

import { useEffect, useState } from "react"

interface DatabaseStatus {
  userCount: number
  postCount: number
  latestUsers: Array<{
    id: string
    name: string
    email: string
    createdAt: string
  }>
  latestPosts: Array<{
    id: string
    title: string
    published: boolean
    createdAt: string
    author: {
      name: string
    }
  }>
}

export default function DatabaseManagementPage() {
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [setupResult, setSetupResult] = useState<any | null>(null)

  // 获取数据库状态
  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/db-status/data")
      const data = await response.json()

      if (data.success) {
        setStatus(data.data)
      } else {
        setError(data.error || "获取数据库状态失败")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setLoading(false)
    }
  }

  // 设置数据库
  const setupDatabase = async () => {
    try {
      setSetupLoading(true)
      setError(null)
      setSetupResult(null)

      const response = await fetch("/api/db-setup")
      const data = await response.json()

      setSetupResult(data)

      if (data.success) {
        // 重新获取状态
        fetchStatus()
      } else {
        setError(data.error || "数据库设置失败")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setSetupLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">数据库管理</h1>

      {/* 操作按钮 */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "加载中..." : "刷新状态"}
        </button>

        <button
          onClick={setupDatabase}
          disabled={setupLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {setupLoading ? "设置中..." : "初始化数据库"}
        </button>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          <h2 className="font-semibold mb-2">错误</h2>
          <p>{error}</p>
        </div>
      )}

      {/* 设置结果 */}
      {setupResult && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
          <h2 className="font-semibold mb-2">设置结果</h2>
          <p>{setupResult.message}</p>
          {setupResult.data && (
            <pre className="mt-2 p-2 bg-blue-50 rounded overflow-x-auto">
              {JSON.stringify(setupResult.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* 数据库状态 */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 统计信息 */}
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">数据库统计</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 rounded-lg text-center">
                <p className="text-sm text-blue-800">用户数量</p>
                <p className="text-3xl font-bold">{status.userCount}</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg text-center">
                <p className="text-sm text-green-800">帖子数量</p>
                <p className="text-3xl font-bold">{status.postCount}</p>
              </div>
            </div>
          </div>

          {/* 最新用户 */}
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">最新用户</h2>
            {status.latestUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">名称</th>
                      <th className="px-4 py-2 text-left">邮箱</th>
                      <th className="px-4 py-2 text-left">创建时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.latestUsers.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{new Date(user.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">暂无用户数据</p>
            )}
          </div>

          {/* 最新帖子 */}
          <div className="p-4 border rounded-lg md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">最新帖子</h2>
            {status.latestPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">标题</th>
                      <th className="px-4 py-2 text-left">作者</th>
                      <th className="px-4 py-2 text-left">状态</th>
                      <th className="px-4 py-2 text-left">创建时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.latestPosts.map((post) => (
                      <tr key={post.id} className="border-t">
                        <td className="px-4 py-2">{post.title}</td>
                        <td className="px-4 py-2">{post.author.name}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {post.published ? "已发布" : "草稿"}
                          </span>
                        </td>
                        <td className="px-4 py-2">{new Date(post.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">暂无帖子数据</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

