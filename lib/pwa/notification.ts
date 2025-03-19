// 檢查通知權限
export async function checkNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

// 訂閱推送通知
export async function subscribeToPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push notifications not supported")
    return null
  }

  try {
    const hasPermission = await checkNotificationPermission()
    if (!hasPermission) {
      console.log("Notification permission denied")
      return null
    }

    const registration = await navigator.serviceWorker.ready

    // 獲取現有訂閱
    let subscription = await registration.pushManager.getSubscription()

    // 如果沒有訂閱，創建新訂閱
    if (!subscription) {
      // 從服務器獲取公鑰
      const response = await fetch("/api/pwa/vapid-public-key")
      const vapidPublicKey = await response.text()

      // 轉換公鑰為 Uint8Array
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

      // 創建訂閱
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      })

      // 將訂閱信息發送到服務器
      await fetch("/api/pwa/register-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId: await getUserId(),
        }),
      })
    }

    return subscription
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    return null
  }
}

// 取消訂閱推送通知
export async function unsubscribeFromPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      return true
    }

    // 取消訂閱
    const success = await subscription.unsubscribe()

    if (success) {
      // 通知服務器取消訂閱
      await fetch("/api/pwa/unregister-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId: await getUserId(),
        }),
      })
    }

    return success
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error)
    return false
  }
}

// 發送本地通知
export async function sendLocalNotification(title: string, options: NotificationOptions = {}) {
  const hasPermission = await checkNotificationPermission()
  if (!hasPermission) return false

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        ...options,
      })
    } else {
      new Notification(title, options)
    }
    return true
  } catch (error) {
    console.error("Error sending notification:", error)
    return false
  }
}

// 輔助函數：將 base64 字符串轉換為 Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// 獲取用戶 ID
async function getUserId(): Promise<string> {
  // 從本地存儲獲取用戶 ID
  let userId = localStorage.getItem("userId")

  // 如果沒有，生成一個新的
  if (!userId) {
    userId = generateUUID()
    localStorage.setItem("userId", userId)
  }

  return userId
}

// 生成 UUID
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

