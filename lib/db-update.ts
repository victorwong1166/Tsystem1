import { neon } from "@neondatabase/serverless"
import { executeQuery } from "./db-migrate"

// 創建數據庫連接
const sql_client = neon(process.env.DATABASE_URL!)

// 更新數據庫結構
export async function updateDatabaseSchema() {
  try {
    // 檢查是否需要添加新列
    const checkColumn = await executeQuery(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'settlements' AND column_name = 'telegram_sent'
    `)

    // 如果列不存在，則添加
    if (checkColumn.success && checkColumn.data.length === 0) {
      await executeQuery(`
        ALTER TABLE settlements 
        ADD COLUMN telegram_sent BOOLEAN DEFAULT FALSE
      `)
    }

    // 檢查是否需要添加新表
    const checkTable = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'daily_funds'
    `)

    // 如果表不存在，則創建
    if (checkTable.success && checkTable.data.length === 0) {
      await executeQuery(`
        CREATE TABLE daily_funds (
          id SERIAL PRIMARY KEY,
          settlement_id INTEGER REFERENCES settlements(id) NOT NULL,
          sign_chips DECIMAL(10,2) DEFAULT 0,
          return_chips DECIMAL(10,2) DEFAULT 0,
          deposits DECIMAL(10,2) DEFAULT 0,
          withdrawals DECIMAL(10,2) DEFAULT 0,
          debts DECIMAL(10,2) DEFAULT 0,
          collections DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)
    }

    return { success: true, message: "數據庫結構更新成功" }
  } catch (error) {
    console.error("更新數據庫結構時出錯:", error)
    return { success: false, error: error.message }
  }
}

// 更新數據庫數據
export async function updateDatabaseData() {
  try {
    // 更新系統設置
    const settingsCheck = await executeQuery(`
      SELECT * FROM settings WHERE key = 'telegram_notification_enabled'
    `)

    if (settingsCheck.success && settingsCheck.data.length === 0) {
      await executeQuery(`
        INSERT INTO settings (key, value, description)
        VALUES ('telegram_notification_enabled', 'true', '是否啟用Telegram通知')
      `)
    }

    return { success: true, message: "數據庫數據更新成功" }
  } catch (error) {
    console.error("更新數據庫數據時出錯:", error)
    return { success: false, error: error.message }
  }
}

// 完整的數據庫更新
export async function updateDatabase() {
  const schemaResult = await updateDatabaseSchema()
  if (!schemaResult.success) {
    return schemaResult
  }

  const dataResult = await updateDatabaseData()
  return dataResult
}

