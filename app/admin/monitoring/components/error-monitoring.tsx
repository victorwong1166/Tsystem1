"use client"

import { useState, useEffect } from "react"

interface ErrorLog {
  id: string
  message: string
  stack: string
  path: string
  type: string
  count: number
  firstSeen: string
  lastSeen: string
  resolved: boolean
}

export default function ErrorMonitoring() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  const [showResolved, setShowResolved] = useState(false)
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)

  useEffect(() => {
    // 模拟从API获取错误日志
    const fetchErrorLogs = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch('/api/admin/monitoring/error-logs')
        // const data = await response.json()

        // 生成模拟数据
        const errorTypes = ["TypeError", "ReferenceError", "SyntaxError", "RangeError", "URIError"]
        const errorMessages = [
          "Cannot read property of undefined",
          "is not a function",
          "Unexpected token",
          "Maximum call stack size exceeded",
          "Invalid URL",
          "Network request failed",
          "Failed to fetch",
        ]
        const paths = [
          "/api/users",
          "/api/posts",
          "/api/comments",
          "/api/auth/login",
          "/app/dashboard",
          "/app/settings",
        ]

        const mockErrors: ErrorLog[] = Array.from({ length: 8 }, (_, i) => {
          const type = errorTypes[Math.floor(Math.random() * errorTypes.length)]
          const message = `${type}: ${errorMessages[Math.floor(Math.random() * errorMessages.length)]}`
          const path = paths[Math.floor(Math.random() * paths.length)]
          const count = Math.floor(Math.random() * 20) + 1

          const lastSeen = new Date()
          lastSeen.setHours(lastSeen.getHours() - Math.floor(Math.random() * 24))

          const firstSeen = new Date(lastSeen)
          firstSeen.setDays(firstSeen.getDate() - Math.floor(Math.random() * 7))

          return {
            id: `error-${i}`,
            message,
            stack: `Error: ${message}\n    at processInput (/app/api/process.js:42:10)\n    at async processRequest (/app/api/handler.js:28:12)\n    at async apiHandler (/app/api/route.js:15:7)`,
            path,
            type,
            count,
            firstSeen: firstSeen.toISOString(),
            lastSeen: lastSeen.toISOString(),
            resolved: Math.random() > 0.7,
          }
        })

        // 模拟网络延迟
        setTimeout(() => {
          setErrors(mockErrors)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取错误日志失败:", error)
        setLoading(false)
      }
    }

    fetchErrorLogs()
  }, [])

  const filteredErrors = errors.filter((error) => {
    // 文本过滤
    const textMatch =
      filter === "" ||
      error.message.toLowerCase().includes(filter.toLowerCase()) ||
      error.path.toLowerCase().includes(filter.toLowerCase())

    // 解决状态过滤
    const resolvedMatch = showResolved || !error.resolved

    return textMatch && resolvedMatch
  })

  const handleResolveError = (errorId: string) => {
    setErrors(errors.map((error) => (error.id === errorId ? { ...error, resolved: true } : error)))

    if (selectedError?.id === errorId) {
      setSelectedError({ ...selectedError, resolved: true })
    }
  }

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
            placeholder="搜索错误消息或路径..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="mr-2"
            />
            显示已解决的错误
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 overflow-auto max-h-[600px]">
          {filteredErrors.length > 0 ? (
            <div className="space-y-2">
              {filteredErrors.map((error) => (
                <div
                  key={error.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedError?.id === error.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  } ${error.resolved ? "opacity-60" : ""}`}
                  onClick={() => setSelectedError(error)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium truncate">{error.type}</div>
                    <div
                      className={`px-2 py-1 text-xs rounded-full ${error.resolved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {error.resolved ? "已解决" : "未解决"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2 truncate">{error.message}</div>
                  <div className="text-xs text-gray-500 mb-1">路径: {error.path}</div>
                  <div className="text-xs text-gray-500 mb-1">出现次数: {error.count}</div>
                  <div className="text-xs text-gray-500">最后出现: {new Date(error.lastSeen).toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">没有找到匹配的错误日志</div>
          )}
        </div>

        <div className="lg:col-span-2 border rounded-lg p-4">
          {selectedError ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedError.type}</h3>
                {!selectedError.resolved && (
                  <button
                    onClick={() => handleResolveError(selectedError.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    标记为已解决
                  </button>
                )}
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">错误消息</div>
                <div className="p-3 bg-gray-100 rounded font-mono text-sm">{selectedError.message}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">堆栈跟踪</div>
                <pre className="p-3 bg-gray-100 rounded font-mono text-xs overflow-auto max-h-[200px]">
                  {selectedError.stack}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">路径</div>
                  <div className="p-2 bg-gray-100 rounded font-mono text-sm">{selectedError.path}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">出现次数</div>
                  <div className="p-2 bg-gray-100 rounded text-sm">{selectedError.count}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">首次出现</div>
                  <div className="p-2 bg-gray-100 rounded text-sm">
                    {new Date(selectedError.firstSeen).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">最后出现</div>
                  <div className="p-2 bg-gray-100 rounded text-sm">
                    {new Date(selectedError.lastSeen).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
              <svg
                className="w-16 h-16 mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p>选择一个错误查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

