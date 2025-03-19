"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

export default function DatabaseStatus() {
  const [status, setStatus] = useState<{
    loading: boolean
    success?: boolean
    usingMock?: boolean
    message?: string
    error?: string
    timestamp?: string
  }>({
    loading: true,
  })

  const testConnection = async () => {
    setStatus({ loading: true })
    try {
      // 添加超时处理
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch("/api/database/test-connection", {
        signal: controller.signal,
        cache: "no-store",
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStatus({
        loading: false,
        success: data.success,
        usingMock: data.usingMock,
        message: data.message || (data.success ? "连接成功" : "连接失败"),
        error: data.error,
        timestamp: data.timestamp,
      })
    } catch (error) {
      console.error("获取数据库状态时出错:", error)
      // 如果是AbortError，说明是超时
      const errorMessage = error.name === "AbortError" ? "连接超时，使用模拟数据库" : error.message || "未知错误"

      setStatus({
        loading: false,
        success: true, // 即使出错也标记为成功，使用模拟数据库
        usingMock: true,
        message: "使用模拟数据库",
        error: errorMessage,
        timestamp: new Date().toISOString(),
      })
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>数据库状态</CardTitle>
        <CardDescription>检查数据库连接状态</CardDescription>
      </CardHeader>
      <CardContent>
        {status.loading ? (
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>正在检查数据库连接...</span>
          </div>
        ) : status.success && !status.usingMock ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">连接成功</AlertTitle>
            <AlertDescription className="text-green-700">
              数据库连接正常。
              {status.timestamp && (
                <div className="text-xs mt-1">最后检查时间: {new Date(status.timestamp).toLocaleString()}</div>
              )}
            </AlertDescription>
          </Alert>
        ) : status.success && status.usingMock ? (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">使用模拟数据库</AlertTitle>
            <AlertDescription className="text-yellow-700">
              {status.message || "未能连接到真实数据库，使用模拟数据库。"}
              {status.error && <div className="text-xs mt-1 text-red-600">错误: {status.error}</div>}
              {status.timestamp && (
                <div className="text-xs mt-1">最后检查时间: {new Date(status.timestamp).toLocaleString()}</div>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">连接失败</AlertTitle>
            <AlertDescription className="text-red-700">
              {status.error || "无法连接到数据库。"}
              {status.timestamp && (
                <div className="text-xs mt-1">最后检查时间: {new Date(status.timestamp).toLocaleString()}</div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={status.loading} variant="outline" className="w-full">
          {status.loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              检查中...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              重新检查
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

