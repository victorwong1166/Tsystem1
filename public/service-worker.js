// 服務工作線程版本
const CACHE_NAME = "trading-system-v1"
const DATA_CACHE_NAME = "trading-system-data-v1"

// 需要緩存的資源
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/members",
  "/transactions",
  "/settlements",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon.ico",
]

// 安裝服務工作線程
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// 激活服務工作線程
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// 攔截網絡請求
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // 處理 API 請求
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(event.request))
    return
  }

  // 處理頁面導航請求
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/offline.html")
      }),
    )
    return
  }

  // 處理靜態資源
  event.respondWith(cacheFirstStrategy(event.request))
})

// 緩存優先策略 (適用於靜態資源)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    // 只緩存成功的響應
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // 如果是圖片請求，返回默認圖片
    if (request.destination === "image") {
      return caches.match("/icons/icon-192x192.png")
    }

    throw error
  }
}

// 網絡優先策略 (適用於 API 請求)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)

    // 緩存 GET 請求的響應
    if (request.method === "GET" && networkResponse.ok) {
      const cache = await caches.open(DATA_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    throw error
  }
}

// 後台同步
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-transactions") {
    event.waitUntil(syncTransactions())
  }
})

// 處理推送事件
self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      const data = event.data.json()

      event.waitUntil(
        self.registration.showNotification(data.title || "新通知", {
          body: data.body || "",
          icon: data.icon || "/icon.png",
          badge: data.badge || "/badge.png",
          data: data.data || {},
        }),
      )
    } catch (error) {
      console.error("Error showing notification:", error)
    }
  }
})

// 處理通知點擊事件
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  } else {
    event.waitUntil(clients.openWindow("/"))
  }
})

// 消息處理
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

// 同步交易
async function syncTransactions() {
  try {
    const db = await openDatabase()
    const unsyncedTransactions = await getUnsyncedTransactions(db)

    if (unsyncedTransactions.length === 0) return

    for (const tx of unsyncedTransactions) {
      try {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tx),
        })

        if (response.ok) {
          await markTransactionSynced(db, tx.id)
        }
      } catch (error) {
        console.error("Error syncing transaction:", error)
      }
    }
  } catch (error) {
    console.error("Error in syncTransactions:", error)
  }
}

// 打開 IndexedDB 數據庫
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("trading-system-db", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = request.result

      if (!db.objectStoreNames.contains("transactions")) {
        const store = db.createObjectStore("transactions", { keyPath: "id" })
        store.createIndex("by-synced", "synced")
      }
    }
  })
}

// 獲取未同步的交易
async function getUnsyncedTransactions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("transactions", "readonly")
    const store = transaction.objectStore("transactions")
    const index = store.index("by-synced")
    const request = index.getAll(false)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

// 標記交易為已同步
async function markTransactionSynced(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("transactions", "readwrite")
    const store = transaction.objectStore("transactions")
    const request = store.get(id)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const data = request.result
      if (data) {
        data.synced = true
        const updateRequest = store.put(data)
        updateRequest.onerror = () => reject(updateRequest.error)
        updateRequest.onsuccess = () => resolve()
      } else {
        resolve()
      }
    }
  })
}

