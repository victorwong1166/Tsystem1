"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function PushNotificationSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

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
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error("Error checking subscription:", error)
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
      // 註冊 Service Worker（如果尚未註冊）
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      await navigator.serviceWorker.ready

      // 訂閱推送通知
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      })

      // 將訂閱信息發送到服務器
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })

      setIsSubscribed(true)
    } catch (error) {
      console.error("Failed to subscribe:", error)
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
        await subscription.unsubscribe()

        // 通知服務器取消訂閱
        // 實際應用中，您可能需要一個取消訂閱的 API 端點

        setIsSubscribed(false)
      }
    } catch (error) {
      console.error("Failed to unsubscribe:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return <p>您的瀏覽器不支持推送通知。</p>
  }

  return (
    <div>
      {isSubscribed ? (
        <Button onClick={unsubscribeFromNotifications} disabled={isLoading} variant="destructive">
          {isLoading ? "處理中..." : "取消訂閱通知"}
        </Button>
      ) : (
        <Button onClick={subscribeToNotifications} disabled={isLoading}>
          {isLoading ? "處理中..." : "訂閱通知"}
        </Button>
      )}
    </div>
  )
}

