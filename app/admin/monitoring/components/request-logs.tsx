"use client"

import { useState, useEffect } from "react"

interface RequestLog {
  id: string
  method: string
  path: string
  statusCode: number
  responseTime: number
  userAgent: string
  ip: string
  timestamp: string
}

export default function RequestLogs() {
  const [logs, setLogs] = useState<RequestLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")

  useEffect(() => {
    // 模拟从API获取请求日志
    const fetchRequestLogs = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch('/api/admin/monitoring/request-logs')
        // const data = await response.json()

        // 生成模拟数据
        const methods = ["GET", "POST", "PUT", "DELETE"]
        const paths = [
          "/api/users",
          "/api/posts",
          "/api/comments",
          "/api/auth/login",
          "/api/auth/logout",
          "/api/admin/settings",
          "/api/admin/users",
        ]
        const statusCodes = [200, 201, 400, 401, 403, 404, 500]

        const mockLogs: RequestLog[] = Array.from({ length: 20 }, (_, i) => {
          const method = methods[Math.floor(Math.random() * methods.length)]
          const path = paths[Math.floor(Math.random() * paths.length)]
          const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)]
          const responseTime = Math.floor(Math.random() * 500) // 0-500ms

          const date = new Date()
          date.setMinutes(date.getMinutes() - i * 5) // 每条日志间隔5分钟

          return {
            id: `log-${i}`,
            method,
            path,
            statusCode,
            responseTime,
            userAgent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            timestamp: date.toISOString(),
          }
        })

        // 模拟网络延迟
        setTimeout(() => {
          setLogs(mockLogs)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取请求日志失败:", error)
        setLoading(false)
      }
    }

    fetchRequestLogs()
  }, [])

  const getStatusColor = (statusCode: number) => {
    if (statusCode < 300) return "bg-green-100 text-green-800"
    if (statusCode < 400) return "bg-blue-100 text-blue-800"
    if (statusCode < 500) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800"
      case "POST":
        return "bg-green-100 text-green-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredLogs = logs.filter((log) => {
    // 文本过滤
    const textMatch = filter === "" || log.path.toLowerCase().includes(filter.toLowerCase()) || log.ip.includes(filter)

    // 状态码过滤
    let statusMatch = true
    if (statusFilter === "2xx") statusMatch = log.statusCode >= 200 && log.statusCode < 300
    else if (statusFilter === "3xx") statusMatch = log.statusCode >= 300 && log.statusCode < 400
    else if (statusFilter === "4xx") statusMatch = log.statusCode >= 400 && log.statusCode < 500
    else if (statusFilter === "5xx") statusMatch = log.statusCode >= 500

    // 请求方法过滤
    const methodMatch = methodFilter === "all" || log.method === methodFilter

    return textMatch && statusMatch && methodMatch
  })

  if (loading) {
    return (
      <div className="border rounded-lg p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="搜索路径或IP..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">所有状态码</option>
            <option value="2xx">2xx (成功)</option>
            <option value="3xx">3xx (重定向)</option>
            <option value="4xx">4xx (客户端错误)</option>
            <option value="5xx">5xx (服务器错误)</option>
          </select>
        </div>

        <div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">所有方法</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">时间</th>
              <th className="px-4 py-2 text-left">方法</th>
              <th className="px-4 py-2 text-left">路径</th>
              <th className="px-4 py-2 text-left">状态码</th>
              <th className="px-4 py-2 text-left">响应时间</th>
              <th className="px-4 py-2 text-left">IP地址</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(log.method)}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-mono text-sm">{log.path}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.statusCode)}`}>
                      {log.statusCode}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {log.responseTime < 100 ? (
                      <span className="text-green-600">{log.responseTime} ms</span>
                    ) : log.responseTime < 300 ? (
                      <span className="text-yellow-600">{log.responseTime} ms</span>
                    ) : (
                      <span className="text-red-600">{log.responseTime} ms</span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-mono text-sm">{log.ip}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  没有找到匹配的请求日志
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

