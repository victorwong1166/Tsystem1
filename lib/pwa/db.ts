import { openDB } from "idb"

const DB_NAME = "tsystem1-pwa"
const DB_VERSION = 1

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 创建存储对象
      if (!db.objectStoreNames.contains("offlineData")) {
        db.createObjectStore("offlineData", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("transactions")) {
        const transactionsStore = db.createObjectStore("transactions", { keyPath: "id" })
        transactionsStore.createIndex("timestamp", "timestamp")
        transactionsStore.createIndex("synced", "synced")
      }
    },
  })

  return db
}

export async function getDB() {
  return await initDB()
}

export async function saveOfflineData(data: any) {
  const db = await initDB()
  const tx = db.transaction("offlineData", "readwrite")
  await tx.store.put(data)
  return await tx.done
}

export async function getOfflineData(id: string) {
  const db = await initDB()
  return await db.get("offlineData", id)
}

export async function getAllOfflineData() {
  const db = await initDB()
  return await db.getAll("offlineData")
}

export async function saveTransaction(transaction: any) {
  const db = await initDB()
  const tx = db.transaction("transactions", "readwrite")

  // 确保交易有一个 ID 和时间戳
  const transactionToSave = {
    ...transaction,
    id: transaction.id || crypto.randomUUID(),
    timestamp: transaction.timestamp || new Date().getTime(),
    synced: false,
  }

  await tx.store.put(transactionToSave)
  return await tx.done
}

export async function getUnsynedTransactions() {
  const db = await initDB()
  const tx = db.transaction("transactions", "readonly")
  const index = tx.store.index("synced")
  return await index.getAll(false)
}

export async function markTransactionSynced(id: string) {
  const db = await initDB()
  const tx = db.transaction("transactions", "readwrite")
  const transaction = await tx.store.get(id)

  if (transaction) {
    transaction.synced = true
    await tx.store.put(transaction)
  }

  return await tx.done
}

export async function syncTransactions() {
  const unsynced = await getUnsynedTransactions()

  if (unsynced.length === 0) {
    return { success: true, message: "没有需要同步的交易" }
  }

  try {
    // 这里应该是实际的同步逻辑，例如发送到服务器
    // 这只是一个示例
    for (const transaction of unsynced) {
      // 模拟发送到服务器
      console.log("同步交易:", transaction)

      // 标记为已同步
      await markTransactionSynced(transaction.id)
    }

    return {
      success: true,
      message: `成功同步 ${unsynced.length} 个交易`,
    }
  } catch (error) {
    console.error("同步交易失败:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function cleanupOldData(daysToKeep = 30) {
  const db = await initDB()
  const tx = db.transaction("transactions", "readwrite")
  const index = tx.store.index("timestamp")

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
  const cutoffTimestamp = cutoffDate.getTime()

  // 获取所有旧交易
  const range = IDBKeyRange.upperBound(cutoffTimestamp)
  const oldTransactions = await index.getAll(range)

  // 删除旧交易
  for (const transaction of oldTransactions) {
    if (transaction.synced) {
      // 只删除已同步的交易
      await tx.store.delete(transaction.id)
    }
  }

  await tx.done

  return {
    success: true,
    message: `清理了 ${oldTransactions.length} 个旧交易`,
  }
}

