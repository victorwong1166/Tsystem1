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
    },
  })

  return db
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

