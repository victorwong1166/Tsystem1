import { openDB, type DBSchema, type IDBPDatabase } from "idb"

// 定義數據庫結構
interface TradingSystemDB extends DBSchema {
  transactions: {
    key: string
    value: {
      id: string
      type: string
      amount: number
      memberId?: string
      memberName?: string
      description?: string
      project?: string
      timestamp: number
      synced: boolean
    }
    indexes: { "by-timestamp": number; "by-synced": boolean }
  }
  members: {
    key: string
    value: {
      id: string
      name: string
      balance: number
      lastUpdated: number
    }
    indexes: { "by-name": string }
  }
  settings: {
    key: string
    value: any
  }
}

// 數據庫版本
const DB_VERSION = 1

// 數據庫名稱
const DB_NAME = "trading-system-db"

// 初始化數據庫
export async function initDB(): Promise<IDBPDatabase<TradingSystemDB>> {
  return openDB<TradingSystemDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 交易存儲
      if (!db.objectStoreNames.contains("transactions")) {
        const transactionStore = db.createObjectStore("transactions", { keyPath: "id" })
        transactionStore.createIndex("by-timestamp", "timestamp")
        transactionStore.createIndex("by-synced", "synced")
      }

      // 會員存儲
      if (!db.objectStoreNames.contains("members")) {
        const memberStore = db.createObjectStore("members", { keyPath: "id" })
        memberStore.createIndex("by-name", "name")
      }

      // 設置存儲
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" })
      }
    },
  })
}

// 獲取數據庫實例
let dbPromise: Promise<IDBPDatabase<TradingSystemDB>> | null = null

export function getDB(): Promise<IDBPDatabase<TradingSystemDB>> {
  if (!dbPromise) {
    dbPromise = initDB()
  }
  return dbPromise
}

// 交易相關操作
export async function saveTransaction(transaction: any) {
  const db = await getDB()
  transaction.synced = navigator.onLine
  transaction.timestamp = Date.now()
  await db.put("transactions", transaction)

  // 如果在線，嘗試同步
  if (navigator.onLine) {
    syncTransactions()
  } else {
    // 如果離線，註冊後台同步
    registerBackgroundSync()
  }

  return transaction
}

export async function getTransactions() {
  const db = await getDB()
  return db.getAllFromIndex("transactions", "by-timestamp")
}

export async function getUnsyncedTransactions() {
  const db = await getDB()
  return db.getAllFromIndex("transactions", "by-synced", false)
}

export async function markTransactionSynced(id: string) {
  const db = await getDB()
  const tx = await db.get("transactions", id)
  if (tx) {
    tx.synced = true
    await db.put("transactions", tx)
  }
}

// 會員相關操作
export async function saveMember(member: any) {
  const db = await getDB()
  member.lastUpdated = Date.now()
  await db.put("members", member)
  return member
}

export async function getMembers() {
  const db = await getDB()
  return db.getAll("members")
}

export async function getMemberById(id: string) {
  const db = await getDB()
  return db.get("members", id)
}

export async function searchMembersByName(name: string) {
  const db = await getDB()
  const members = await db.getAll("members")
  return members.filter((member) => member.name.toLowerCase().includes(name.toLowerCase()))
}

// 設置相關操作
export async function saveSetting(key: string, value: any) {
  const db = await getDB()
  await db.put("settings", { key, value })
}

export async function getSetting(key: string) {
  const db = await getDB()
  const setting = await db.get("settings", key)
  return setting ? setting.value : null
}

// 後台同步
export async function registerBackgroundSync() {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register("sync-transactions")
    } catch (err) {
      console.error("Background sync registration failed:", err)
    }
  }
}

// 同步交易到服務器
export async function syncTransactions() {
  if (!navigator.onLine) return

  const unsyncedTransactions = await getUnsyncedTransactions()
  if (unsyncedTransactions.length === 0) return

  try {
    for (const tx of unsyncedTransactions) {
      // 發送到服務器
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tx),
      })

      if (response.ok) {
        await markTransactionSynced(tx.id)
      }
    }
  } catch (error) {
    console.error("Error syncing transactions:", error)
  }
}

// 清除過期數據
export async function cleanupOldData() {
  const db = await getDB()
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

  // 獲取所有交易
  const transactions = await db.getAllFromIndex("transactions", "by-timestamp")

  // 刪除30天前的已同步交易
  for (const tx of transactions) {
    if (tx.synced && tx.timestamp < thirtyDaysAgo) {
      await db.delete("transactions", tx.id)
    }
  }
}

