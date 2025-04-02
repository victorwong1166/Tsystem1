"use client"

import { useState } from "react"

export default function DatabaseDiagnosticsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>({})
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setLoading(true)
    setError(null)
    setResults({})

    try {
      // 检查环境变量
      const envCheck = await fetch("/api/env-check").then((res) => res.json())
      setResults((prev) => ({ ...prev, envCheck }))

      // 测试连接
      const connectionTest = await fetch("/api/test-connection").then((res) => res.json())
      setResults((prev) => ({ ...prev, connectionTest }))

      // 检查权限
      const permissionsCheck = await fetch("/api/check-permissions").then((res) => res.json())
      setResults((prev) => ({ ...prev, permissionsCheck }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">数据库诊断工具</h1>

      <button
        onClick={runTests}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mb-8"
      >
        {loading ? "正在运行诊断..." : "运行诊断"}
      </button>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">错误</h2>
          <p>{error}</p>
        </div>
      )}

      {Object.keys(results).length > 0 && (
        <div className="space-y-6">
          {/* 环境变量检查结果 */}
          {results.envCheck && (
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">环境变量检查</h2>
              <div className="space-y-2">
                <p>环境: {results.envCheck.environment}</p>
                <p>Vercel 环境: {results.envCheck.vercelEnv}</p>
                <p>DATABASE_URL 设置: {results.envCheck.databaseUrlSet ? "是" : "否"}</p>
                {results.envCheck.databaseUrlSet && <p>DATABASE_URL 前缀: {results.envCheck.databaseUrlPrefix}</p>}
              </div>
            </div>
          )}

          {/* 连接测试结果 */}
          {results.connectionTest && (
            <div className={`p-4 border rounded-lg ${results.connectionTest.success ? "bg-green-50" : "bg-red-50"}`}>
              <h2 className="text-xl font-semibold mb-4">连接测试</h2>
              {results.connectionTest.success ? (
                <div className="text-green-700">
                  <p>{results.connectionTest.message}</p>
                  <p>时间戳: {results.connectionTest.timestamp}</p>
                </div>
              ) : (
                <div className="text-red-700">
                  <p>错误: {results.connectionTest.error}</p>
                </div>
              )}
            </div>
          )}

          {/* 权限检查结果 */}
          {results.permissionsCheck && (
            <div className={`p-4 border rounded-lg ${results.permissionsCheck.success ? "bg-green-50" : "bg-red-50"}`}>
              <h2 className="text-xl font-semibold mb-4">权限检查</h2>
              {results.permissionsCheck.success ? (
                <div>
                  <p className="text-green-700 mb-2">{results.permissionsCheck.message}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(results.permissionsCheck.permissions).map(([perm, value]) => (
                      <div key={perm} className={`p-2 rounded ${value ? "bg-green-100" : "bg-red-100"}`}>
                        <span className="font-medium">{perm}:</span> {value ? "✓" : "✗"}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-red-700">
                  <p>错误: {results.permissionsCheck.error}</p>
                  {results.permissionsCheck.hint && <p className="mt-2">提示: {results.permissionsCheck.hint}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">故障排除指南</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">环境变量问题</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>确保在 Vercel 仪表板中设置了 DATABASE_URL</li>
              <li>确保环境变量应用于正确的环境（Production、Preview、Development）</li>
              <li>部署后，环境变量可能需要几分钟才能生效</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">连接字符串问题</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>确保连接字符串格式正确: postgres://username:password@hostname:port/database</li>
              <li>如果使用 Neon，添加 ?sslmode=require 参数</li>
              <li>如果密码包含特殊字符，确保进行 URL 编码</li>
              <li>考虑使用连接池: ?pgbouncer=true</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">权限问题</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>确保数据库用户有足够的权限（CREATE, ALTER, DROP, SELECT, INSERT, UPDATE, DELETE）</li>
              <li>检查数据库用户是否可以访问所需的架构</li>
              <li>如果使用 Neon，检查角色权限设置</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">网络问题</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>确保数据库允许从 Vercel 的服务器访问</li>
              <li>如果使用 Neon，确保网络访问设置为 "Allow from anywhere"</li>
              <li>考虑使用 Vercel Postgres 集成，避免网络问题</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Prisma 特定问题</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>确保 Prisma 在构建时生成（添加 postinstall 脚本）</li>
              <li>将 prisma 添加为依赖项，而不仅仅是开发依赖项</li>
              <li>使用 Prisma 单例模式避免冷启动问题</li>
              <li>考虑使用 directUrl 进行迁移</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

