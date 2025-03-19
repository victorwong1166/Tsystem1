"use client"

import { useState, useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 版本號，每次部署時更新
const APP_VERSION = "1.0.0"

export function UpdateNotification() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // 檢查更新
  const checkForUpdates = async () => {
    try {
      setIsChecking(true)

      // 從服務器獲取最新版本號
      // 實際應用中，這應該是一個真實的 API 端點
      const response = await fetch("/api/version?t=" + new Date().getTime())

      if (response.ok) {
        const data = await response.json()

        // 比較當前版本和最新版本
        if (data.version && data.version !== APP_VERSION) {
          setNewVersionAvailable(true)
        } else {
          setNewVersionAvailable(false)
        }
      }
    } catch (error) {
      console.error("檢查更新失敗:", error)
    } finally {
      setIsChecking(false)
    }
  }

  // 頁面加載時檢查更新
  useEffect(() => {
    // 存儲當前版本到 localStorage
    const storedVersion = localStorage.getItem("app_version")

    if (!storedVersion) {
      localStorage.setItem("app_version", APP_VERSION)
    } else if (storedVersion !== APP_VERSION) {
      localStorage.setItem("app_version", APP_VERSION)
    }

    // 每 30 分鐘檢查一次更新
    checkForUpdates()
    const interval = setInterval(checkForUpdates, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // 刷新頁面
  const handleRefresh = () => {
    window.location.reload()
  }

  if (!newVersionAvailable) {
    return null
  }

  return (
    <Alert variant="default" className="fixed bottom-4 right-4 w-auto max-w-md z-50 bg-white shadow-lg">
      <AlertCircle className="h-4 w-4" />
      <div className="flex-1">
        <AlertTitle>有新版本可用</AlertTitle>
        <AlertDescription>系統已更新，請刷新頁面以獲取最新功能和修復。</AlertDescription>
      </div>
      <Button size="sm" onClick={handleRefresh} disabled={isChecking} className="ml-2 flex items-center gap-1">
        <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? "animate-spin" : ""}`} />
        刷新
      </Button>
    </Alert>
  )
}

