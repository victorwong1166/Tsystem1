"use client"

import { useState, useEffect } from "react"

interface PerformanceData {
  responseTime: number[]
  requestsPerMinute: number[]
  errorRate: number[]
  cpuUsage: number[]
  memoryUsage: number[]
  timestamps: string[]
}

export default function PerformanceMetrics() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("24h")
  const [selectedMetric, setSelectedMetric] = useState("responseTime")

  useEffect(() => {
    // 模拟从API获取性能指标数据
    const fetchPerformanceData = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch(`/api/admin/monitoring/performance?timeRange=${timeRange}`)
        // const data = await response.json()

        // 生成模拟数据
        const timestamps = Array.from({ length: 24 }, (_, i) => {
          const date = new Date()
          date.setHours(date.getHours() - 23 + i)
          return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        })

        const generateRandomData = () => {
          return Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
        }

        // 模拟数据
        const mockData: PerformanceData = {
          responseTime: generateRandomData().map((v) => v / 2), // 0-50ms
          requestsPerMinute: generateRandomData().map((v) => v * 2), // 0-200
          errorRate: generateRandomData().map((v) => v / 20), // 0-5%
          cpuUsage: generateRandomData(), // 0-100%
          memoryUsage: generateRandomData(), // 0-100%
          timestamps,
        }

        // 模拟网络延迟
        setTimeout(() => {
          setData(mockData)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取性能指标失败:", error)
        setLoading(false)
      }
    }

    fetchPerformanceData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="border rounded-lg p-6">
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="border rounded-lg p-6 bg-red-50">
        <p className="text-red-600">无法获取性能指标数据</p>
      </div>
    )
  }

  const getMetricData = () => {
    switch (selectedMetric) {
      case "responseTime":
        return { values: data.responseTime, label: "响应时间 (ms)", color: "rgba(59, 130, 246, 0.5)" }
      case "requestsPerMinute":
        return { values: data.requestsPerMinute, label: "每分钟请求数", color: "rgba(16, 185, 129, 0.5)" }
      case "errorRate":
        return { values: data.errorRate, label: "错误率 (%)", color: "rgba(239, 68, 68, 0.5)" }
      case "cpuUsage":
        return { values: data.cpuUsage, label: "CPU 使用率 (%)", color: "rgba(245, 158, 11, 0.5)" }
      case "memoryUsage":
        return { values: data.memoryUsage, label: "内存使用率 (%)", color: "rgba(139, 92, 246, 0.5)" }
      default:
        return { values: [], label: "", color: "" }
    }
  }

  const metricData = getMetricData()
  const maxValue = Math.max(...metricData.values) * 1.1 // 增加10%的空间

  return (
    <div className="border rounded-lg p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="responseTime">响应时间</option>
            <option value="requestsPerMinute">请求数</option>
            <option value="errorRate">错误率</option>
            <option value="cpuUsage">CPU 使用率</option>
            <option value="memoryUsage">内存使用率</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("1h")}
            className={`px-3 py-1 text-sm rounded ${timeRange === "1h" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            1小时
          </button>
          <button
            onClick={() => setTimeRange("24h")}
            className={`px-3 py-1 text-sm rounded ${timeRange === "24h" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            24小时
          </button>
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1 text-sm rounded ${timeRange === "7d" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            7天
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 text-sm rounded ${timeRange === "30d" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            30天
          </button>
        </div>
      </div>

      <div className="h-80 relative">
        {/* Y轴标签 */}
        <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
          <div>{maxValue.toFixed(1)}</div>
          <div>{(maxValue * 0.75).toFixed(1)}</div>
          <div>{(maxValue * 0.5).toFixed(1)}</div>
          <div>{(maxValue * 0.25).toFixed(1)}</div>
          <div>0</div>
        </div>

        {/* 图表区域 */}
        <div className="ml-10 h-full flex items-end">
          <div className="w-full h-full flex items-end relative">
            {/* 水平网格线 */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-gray-200 h-0"></div>
              <div className="border-t border-gray-200 h-0"></div>
              <div className="border-t border-gray-200 h-0"></div>
              <div className="border-t border-gray-200 h-0"></div>
              <div className="border-t border-gray-200 h-0"></div>
            </div>

            {/* 柱状图 */}
            <div className="w-full h-full flex items-end">
              {metricData.values.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col justify-end items-center group">
                  <div
                    className="w-4/5 rounded-t"
                    style={{
                      height: `${(value / maxValue) * 100}%`,
                      backgroundColor: metricData.color,
                    }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-1 hidden md:block">{data.timestamps[index]}</div>

                  {/* 悬停提示 */}
                  <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {metricData.label}: {value.toFixed(2)}
                    <br />
                    时间: {data.timestamps[index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        {metricData.label} -{" "}
        {timeRange === "1h"
          ? "最近1小时"
          : timeRange === "24h"
            ? "最近24小时"
            : timeRange === "7d"
              ? "最近7天"
              : "最近30天"}
      </div>
    </div>
  )
}

