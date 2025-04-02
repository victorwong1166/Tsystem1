"use client"

import { useState, useEffect } from "react"

interface ConnectionStatus {
  success: boolean
  message?: string
  error?: string
  timestamp?: string
  provider: string
}

interface DatabaseInfo {
  success: boolean
  schemas?: any[]
  size?: any[]
  connections?: any[]
  timestamp?: string
  error?: string
}

interface DatabaseStatus {
  success: boolean
  initialized?: boolean
  message?: string
  error?: string
  data?: {
    counts: {
      userCount: number
      postCount: number
      commentCount: number
    }
    latestUsers: any[]
    latestPosts: any[]
  }
}

interface AllStatusResponse {
  connections: {
    prisma: ConnectionStatus
    vercel: ConnectionStatus
    neon: ConnectionStatus
    timestamp: string
    databaseUrl: string
  }
  info: DatabaseInfo | null
  status: DatabaseStatus | null
  timestamp: string
}

export default function DatabaseDiagnosticsPage() {
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [status, setStatus] = useState<AllStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [initResult, setInitResult] = useState<any | null>(null)
  const [migrateResult, setMigrateResult] = useState<any | null>(null)

  // 获取数据库状态
  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/db-status/all")
      const data = await response.json()

      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setLoading(false)
    }
  }

  // 初始化数据库
  const initializeDatabase = async (force = false) => {
    try {
      setInitializing(true)
      setError(null)
      setInitResult(null)

      const response = await fetch("/api/db-init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ force }),
      })
      const data = await response.json()

      setInitResult(data)

      if (data.success) {
        // 重新获取状态
        fetchStatus()
      } else {
        setError(data.error || "数据库初始化失败")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setInitializing(false)
    }
  }

  // 执行数据库迁移
  const runMigration = async () => {
    try {
      setMigrating(true)
      setError(null)
      setMigrateResult(null)

      const response = await fetch("/api/db-migrate", {
        method: "POST",
      })
      const data = await response.json()

      setMigrateResult(data)

      if (data.success) {
        // 重新获取状态
        fetchStatus()
      } else {
        setError(data.error || "数据库迁移失败")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setMigrating(false)
    }
  }

  // 初始加载
  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">数据库诊断</h1>

      {/* 操作按钮 */}
      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "加载中..." : "刷新状态"}
        </button>

        <button
          onClick={() => initializeDatabase(false)}
          disabled={initializing || loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {initializing ? "初始化中..." : "初始化数据库"}
        </button>

        <button
          onClick={() => initializeDatabase(true)}
          disabled={initializing || loading}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          {initializing ? "初始化中..." : "强制重新初始化"}
        </button>

        <button
          onClick={runMigration}
          disabled={migrating || loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {migrating ? "迁移中..." : "执行数据库迁移"}
        </button>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          <h2 className="font-semibold mb-2">错误</h2>
          <p>{error}</p>
        </div>
      )}

      {/* 初始化结果 */}
      {initResult && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
          <h2 className="font-semibold mb-2">初始化结果</h2>
          <p>{initResult.message}</p>
          {initResult.data && (
            <pre className="mt-2 p-2 bg-blue-50 rounded overflow-x-auto">
              {JSON.stringify(initResult.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* 迁移结果 */}
      {migrateResult && (
        <div className="mb-6 p-4 bg-purple-100 text-purple-800 rounded-lg">
          <h2 className="font-semibold mb-2">迁移结果</h2>
          <p>{migrateResult.message}</p>
          {migrateResult.migrationId && <p className="mt-2">迁移 ID: {migrateResult.migrationId}</p>}
        </div>
      )}

      {/* 数据库连接状态 */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 连接信息 */}
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">数据库连接</h2>
            <p className="mb-2">
              <span className="font-medium">DATABASE_URL:</span> {status.connections.databaseUrl}
            </p>
            <p className="mb-2">
              <span className="font-medium">检查时间:</span> {new Date(status.timestamp).toLocaleString()}
            </p>

            <div className="mt-4 space-y-4">
              {/* Prisma 连接 */}
              <div className={`p-3 rounded-lg ${status.connections.prisma.success ? "bg-green-100" : "bg-red-100"}`}>
                <h3 className="font-medium">Prisma 连接</h3>
                {status.connections.prisma.success ? (
                  <p className="text-green-700">{status.connections.prisma.message}</p>
                ) : (
                  <p className="text-red-700">{status.connections.prisma.error}</p>
                )}
              </div>

              {/* Vercel 连接 */}
              <div className={`p-3 rounded-lg ${status.connections.vercel.success ? "bg-green-100" : "bg-red-100"}`}>
                <h3 className="font-medium">Vercel Postgres 连接</h3>
                {status.connections.vercel.success ? (
                  <p className="text-green-700">{status.connections.vercel.message}</p>
                ) : (
                  <p className="text-red-700">{status.connections.vercel.error}</p>
                )}
              </div>

              {/* Neon 连接 */}
              <div className={`p-3 rounded-lg ${status.connections.neon.success ? "bg-green-100" : "bg-red-100"}`}>
                <h3 className="font-medium">Neon 连接</h3>
                {status.connections.neon.success ? (
                  <p className="text-green-700">{status.connections.neon.message}</p>
                ) : (
                  <p className="text-red-700">{status.connections.neon.error}</p>
                )}
              </div>
            </div>
          </div>

          {/* 数据库信息 */}
          {status.info && status.info.success && (
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">数据库信息</h2>

              {/* 数据库大小 */}
              {status.info.size && status.info.size.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">数据库大小</h3>
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">数据库名</th>
                        <th className="px-4 py-2 text-left">大小</th>
                      </tr>
                    </thead>
                    <tbody>
                      {status.info.size.map((item: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.database_name}</td>
                          <td className="px-4 py-2">{item.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 活跃连接 */}
              {status.info.connections && status.info.connections.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">活跃连接</h3>
                  <p className="text-xl font-bold">{status.info.connections[0]?.active_connections || 0}</p>
                </div>
              )}

              {/* 数据库架构 */}
              {status.info.schemas && status.info.schemas.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">数据库架构</h3>
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">架构名</th>
                        <th className="px-4 py-2 text-left">表数量</th>
                      </tr>
                    </thead>
                    <tbody>
                      {status.info.schemas.map((item: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.table_schema}</td>
                          <td className="px-4 py-2">{item.table_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 数据库状态 */}
          {status.status && status.status.success && (
            <div className="p-4 border rounded-lg md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">数据库状态</h2>

              {status.status.initialized ? (
                <div>
                  <div className="p-3 bg-green-100 text-green-700 rounded-lg mb-4">
                    <p>{status.status.message}</p>
                  </div>

                  {status.status.data && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-blue-100 rounded-lg text-center">
                        <p className="text-sm text-blue-800">用户数量</p>
                        <p className="text-3xl font-bold">{status.status.data.counts.userCount}</p>
                      </div>
                      <div className="p-4 bg-green-100 rounded-lg text-center">
                        <p className="text-sm text-green-800">文章数量</p>
                        <p className="text-3xl font-bold">{status.status.data.counts.postCount}</p>
                      </div>
                      <div className="p-4 bg-purple-100 rounded-lg text-center">
                        <p className="text-sm text-purple-800">评论数量</p>
                        <p className="text-3xl font-bold">{status.status.data.counts.commentCount}</p>
                      </div>
                    </div>
                  )}

                  {/* 最新用户 */}
                  {status.status.data && status.status.data.latestUsers.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">最新用户</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-2 text-left">ID</th>
                              <th className="px-4 py-2 text-left">名称</th>
                              <th className="px-4 py-2 text-left">邮箱</th>
                              <th className="px-4 py-2 text-left">创建时间</th>
                            </tr>
                          </thead>
                          <tbody>
                            {status.status.data.latestUsers.map((user: any) => (
                              <tr key={user.id} className="border-t">
                                <td className="px-4 py-2">{user.id}</td>
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{new Date(user.createdAt).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 最新文章 */}
                  {status.status.data && status.status.data.latestPosts.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">最新文章</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-2 text-left">ID</th>
                              <th className="px-4 py-2 text-left">标题</th>
                              <th className="px-4 py-2 text-left">作者</th>
                              <th className="px-4 py-2 text-left">状态</th>
                              <th className="px-4 py-2 text-left">创建时间</th>
                            </tr>
                          </thead>
                          <tbody>
                            {status.status.data.latestPosts.map((post: any) => (
                              <tr key={post.id} className="border-t">
                                <td className="px-4 py-2">{post.id}</td>
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
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
                  <p>{status.status.message}</p>
                  <p className="mt-2">请点击"初始化数据库"按钮来初始化数据库。</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 故障排除指南 */}
      <div className="mt-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">故障排除指南</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">连接问题</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>确保 DATABASE_URL 环境变量已正确设置</li>
              <li>检查数据库服务器是否在运行</li>
              <li>确认网络连接和防火墙设置</li>
              <li>检查数据库用户名和密码是否正确</li>
              <li>如果使用 SSL 连接，确保 SSL 设置正确</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">初始化问题</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>确保数据库用户有创建表的权限</li>
              <li>检查是否有足够的磁盘空间</li>
              <li>如果初始化失败，尝试使用"强制重新初始化"选项</li>
              <li>检查 Prisma 模型是否有语法错误</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">迁移问题</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>确保数据库用户有修改表结构的权限</li>
              <li>检查是否有其他迁移正在进行</li>
              <li>如果迁移失败，检查迁移日志</li>
              <li>考虑手动解决迁移冲突</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">性能问题</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>检查数据库连接池设置</li>
              <li>优化查询和索引</li>
              <li>考虑使用缓存</li>
              <li>监控数据库负载和资源使用情况</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

