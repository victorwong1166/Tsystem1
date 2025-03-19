"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { showNotification } from "@/lib/notifications"

export default function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default")

  useEffect(() => {
    // 檢查瀏覽器是否支持通知
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission)
    } else {
      setPermission("unsupported")
    }
  }, [])

  const requestPermission = async () => {
    if (permission === "unsupported") return

    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === "granted") {
        showNotification({
          title: "通知已啟用",
          description: "您將收到交易和會員創建的通知",
          type: "success",
        })

        // 顯示一個測試通知
        new Notification("通知測試", {
          body: "通知功能已成功啟用！",
          icon: "/icons/icon-192x192.png",
        })
      }
    } catch (error) {
      console.error("請求通知權限時出錯:", error)
    }
  }

  if (permission === "unsupported") {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <BellOff size={16} />
        <span>您的瀏覽器不支持通知</span>
      </div>
    )
  }

  if (permission === "granted") {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Bell size={16} />
        <span>通知已啟用</span>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={requestPermission}>
      <Bell size={16} />
      <span>啟用通知</span>
    </Button>
  )
}

