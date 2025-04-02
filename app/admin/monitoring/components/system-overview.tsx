"use client"

import { useState, useEffect } from "react"

interface SystemStatus {
  cpu: number
  memory: number
  disk: number
  uptime: string
  nodeVersion: string
  environment: string
  lastDeployment: string
  status: "healthy" | "warning" | "critical"
}

export default function SystemOverview() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从API获取系统状态
    const fetchSystemStatus = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch('/api/admin/monitoring/system-status')
        // const data = await response.json()

        // 模拟数据
        const mockData: SystemStatus = {
          cpu: 35,
          memory: 42,
          disk: 68,
          uptime: "5天 7小时 23分钟",
          nodeVersion: "v18.17.0",
          environment: "production",
          lastDeployment: "2023-04-02 15:30:45",
          status: "healthy",
        }

        // 模拟网络延迟
        setTimeout(() => {
          setStatus(mockData)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取系统状态失败:", error)
        setLoading(false)
      }
    }

    fetchSystemStatus()

    // 设置定时刷新
    const intervalId = setInterval(fetchSystemStatus, 60000) // 每分钟刷新一次

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <div className="border rounded-lg p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="border rounded-lg p-6 bg-red-50">
        <p className="text-red-600">无法获取系统状态信息</p>
      </div>
    )
  }

  const getStatusColor = (value: number) => {
    if (value < 50) return "bg-green-500"
    if (value < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBg(status.status)}`}>
            {status.status === "healthy" ? "系统正常" : status.status === "warning" ? "系统警告" : "系统异常"}
          </span>
        </div>
        <div className="text-sm text-gray-500">最后更新: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">CPU 使用率</h3>
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-2">{status.cpu}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getStatusColor(status.cpu)}`}
                style={{ width: `${status.cpu}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">内存使用率</h3>
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-2">{status.memory}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getStatusColor(status.memory)}`}
                style={{ width: `${status.memory}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">磁盘使用率</h3>
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-2">{status.disk}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getStatusColor(status.disk)}`}
                style={{ width: `${status.disk}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">系统运行时间</h3>
          <div className="text-2xl font-bold">{status.uptime}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Node.js 版本</h3>
          <div className="text-lg font-medium">{status.nodeVersion}</div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">运行环境</h3>
          <div className="text-lg font-medium">{status.environment}</div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">最后部署时间</h3>
          <div className="text-lg font-medium">{status.lastDeployment}</div>
        </div>
      </div>
    </div>
  )
}

