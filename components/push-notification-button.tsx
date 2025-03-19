"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // 檢查瀏覽器是否支持推送通知
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setIsSupported(false)
      return
    }

    // 檢查用戶是否已經訂閱
    checkSubscription()
  }, [])

  async function checkSubscription() {
    try {
      if (!navigator.serviceWorker.controller) {
        await registerServiceWorker()
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error("檢查訂閱狀態時出錯:", error)
    }
  }

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      return registration
    } catch (error) {
      console.error("註冊 Service Worker 時出錯:", error)
      throw error
    }
  }

  // 將 URL 安全的 base64 字符串轉換為 Uint8Array
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }

  async function subscribeToNotifications() {
    setIsLoading(true)
    try {
      // 確保 Service Worker 已註冊
      let registration
      try {
        registration = await navigator.serviceWorker.ready
      } catch (error) {
        registration = await registerServiceWorker()
        await navigator.serviceWorker.ready
      }

      // 獲取公鑰 - 這裡使用了 NEXT_PUBLIC_VAPID_PUBLIC_KEY
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        throw new Error("VAPID 公鑰未設置")
      }

      // 訂閱推送通知
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      // 將訂閱信息發送到服務器
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })

      if (!response.ok) {
        throw new Error("訂閱請求失敗")
      }

      setIsSubscribed(true)
      toast({
        title: "訂閱成功",
        description: "您將收到重要交易和結算的通知",
      })
    } catch (error) {
      console.error("訂閱通知時出錯:", error)
      toast({
        title: "訂閱失敗",
        description: "無法訂閱推送通知，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function unsubscribeFromNotifications() {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // 取消訂閱
        const unsubscribed = await subscription.unsubscribe()

        if (unsubscribed) {
          // 通知服務器取消訂閱
          await fetch("/api/push/unsubscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          })

          setIsSubscribed(false)
          toast({
            title: "已取消訂閱",
            description: "您將不再收到推送通知",
          })
        }
      }
    } catch (error) {
      console.error("取消訂閱時出錯:", error)
      toast({
        title: "取消訂閱失敗",
        description: "無法取消訂閱，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return null // 如果不支持，不顯示按鈕
  }

  return (
    <Button
      onClick={isSubscribed ? unsubscribeFromNotifications : subscribeToNotifications}
      disabled={isLoading}
      variant="ghost"
      size="icon"
      title={isSubscribed ? "取消訂閱通知" : "訂閱通知"}
    >
      {isLoading ? (
        <span className="animate-spin">⏳</span>
      ) : isSubscribed ? (
        <Bell className="h-5 w-5" />
      ) : (
        <BellOff className="h-5 w-5" />
      )}
    </Button>
  )
}

