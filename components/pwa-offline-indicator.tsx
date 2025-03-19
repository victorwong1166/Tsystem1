"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function PWAOfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // 初始化離線狀態
    setIsOffline(!navigator.onLine)

    // 監聽網絡狀態變化
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-500 text-white py-2 px-4 text-center z-50 flex items-center justify-center">
      <WifiOff className="h-4 w-4 mr-2" />
      <span>您目前處於離線模式，部分功能可能受限</span>
    </div>
  )
}

