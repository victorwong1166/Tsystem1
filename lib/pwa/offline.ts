import { getDB, syncTransactions, cleanupOldData } from "./db"

// 檢查網絡狀態
export function isOnline(): boolean {
  return navigator.onLine
}

// 監聽網絡狀態變化
export function setupNetworkListeners(onlineCallback: () => void, offlineCallback: () => void): () => void {
  const handleOnline = () => {
    console.log("App is online")
    onlineCallback()
    // 嘗試同步數據
    syncTransactions()
  }

  const handleOffline = () => {
    console.log("App is offline")
    offlineCallback()
  }

  window.addEventListener("online", handleOnline)
  window.addEventListener("offline", handleOffline)

  // 返回清理函數
  return () => {
    window.removeEventListener("online", handleOnline)
    window.removeEventListener("offline", handleOffline)
  }
}

// 初始化離線功能
export async function initOfflineSupport() {
  // 註冊服務工作線程
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      console.log("Service Worker registered with scope:", registration.scope)

      // 設置更新檢查
      setInterval(
        () => {
          registration.update()
        },
        60 * 60 * 1000,
      ) // 每小時檢查一次更新
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  }

  // 設置網絡監聽器
  setupNetworkListeners(
    () => {
      // 在線時的操作
      document.body.classList.remove("offline-mode")
    },
    () => {
      // 離線時的操作
      document.body.classList.add("offline-mode")
    },
  )

  // 初始化數據庫
  await getDB()

  // 清理過期數據
  await cleanupOldData()

  // 如果在線，嘗試同步數據
  if (isOnline()) {
    syncTransactions()
  }
}

// 預緩存重要頁面
export async function precacheImportantPages() {
  if ("serviceWorker" in navigator) {
    try {
      const cache = await caches.open("pages-cache")
      const pagesToCache = ["/", "/dashboard", "/members", "/transactions", "/settings", "/offline.html"]

      await cache.addAll(pagesToCache)
      console.log("Important pages pre-cached successfully")
    } catch (error) {
      console.error("Failed to pre-cache pages:", error)
    }
  }
}

// 檢查應用更新
export async function checkForAppUpdate(): Promise<boolean> {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.update()

      return new Promise((resolve) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                resolve(true) // 有更新
              }
            })
          }
        })

        // 如果沒有立即找到更新，返回 false
        setTimeout(() => resolve(false), 3000)
      })
    } catch (error) {
      console.error("Error checking for updates:", error)
      return false
    }
  }
  return false
}

// 應用更新
export async function updateApp() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" })

      // 監聽控制權變化，然後重新加載頁面
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload()
      })

      return true
    }
  }
  return false
}

