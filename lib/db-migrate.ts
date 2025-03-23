import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// 創建數據庫連接
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// 測試數據庫連接
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`
    return { success: true, timestamp: result[0].now }
  } catch (error) {
    console.error("Database connection error:", error)
    return { success: false, error: error.message }
  }
}

// 執行原始SQL查詢
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // 將參數轉換為 SQL 參數格式
    const sqlParams = params.map((param) => sql`${param}`)
    const result = await sql.query(query, sqlParams)
    return { success: true, data: result }
  } catch (error) {
    console.error("Query execution error:", error)
    return { success: false, error: error.message }
  }
}

// 創建所有表
export async function createTables() {
  try {
    // 創建枚舉類型
    await executeQuery(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('admin', 'user');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
          CREATE TYPE user_status AS ENUM ('active', 'inactive');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_type') THEN
          CREATE TYPE member_type AS ENUM ('shareholder', 'agent', 'regular');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
          CREATE TYPE transaction_type AS ENUM ('buy_chips', 'sell_chips', 'sign_table', 'dividend');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
          CREATE TYPE payment_method AS ENUM ('cash', 'bank', 'wechat', 'alipay');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'button_type') THEN
          CREATE TYPE button_type AS ENUM ('transaction', 'payment', 'other');
        END IF;
      END
      $$;
    `)

    // 創建用戶表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        role user_role NOT NULL DEFAULT 'user',
        status user_status NOT NULL DEFAULT 'active',
        last_login TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建會員表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        type member_type NOT NULL DEFAULT 'regular',
        agent_id INTEGER REFERENCES members(id),
        notes TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建交易表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        transaction_id VARCHAR(20) NOT NULL UNIQUE,
        member_id INTEGER NOT NULL REFERENCES members(id),
        type transaction_type NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method payment_method,
        notes TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建自定義按鈕表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS custom_buttons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        button_type button_type NOT NULL,
        value VARCHAR(50) NOT NULL,
        color VARCHAR(20) DEFAULT '#3b82f6',
        icon VARCHAR(50),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建簽單表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS sign_tables (
        id SERIAL PRIMARY KEY,
        table_id VARCHAR(20) NOT NULL,
        member_id INTEGER NOT NULL REFERENCES members(id),
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        settled_at TIMESTAMP,
        transaction_id INTEGER REFERENCES transactions(id),
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建分紅表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS dividends (
        id SERIAL PRIMARY KEY,
        dividend_id VARCHAR(20) NOT NULL UNIQUE,
        total_profit DECIMAL(10,2) NOT NULL,
        total_shares DECIMAL(5,2) NOT NULL,
        share_unit DECIMAL(3,2) NOT NULL,
        dividend_per_unit DECIMAL(10,2) NOT NULL,
        notes TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建分紅分配表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS dividend_allocations (
        id SERIAL PRIMARY KEY,
        dividend_id INTEGER NOT NULL REFERENCES dividends(id),
        member_id INTEGER NOT NULL REFERENCES members(id),
        shares DECIMAL(5,2) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建系統設置表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        description TEXT,
        updated_by INTEGER REFERENCES users(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建系統日誌表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(50) NOT NULL,
        details TEXT,
        ip_address VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建Telegram綁定表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS telegram_bindings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        chat_id VARCHAR(50) NOT NULL UNIQUE,
        bind_code VARCHAR(10),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建網站表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS websites (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        domain VARCHAR(100) NOT NULL UNIQUE,
        template VARCHAR(50) NOT NULL,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        settings TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建結算表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS settlements (
        id SERIAL PRIMARY KEY,
        settlement_id VARCHAR(20) NOT NULL UNIQUE,
        period_number INTEGER NOT NULL,
        date TIMESTAMP NOT NULL,
        total_revenue DECIMAL(10,2) NOT NULL,
        total_expenses DECIMAL(10,2) NOT NULL,
        net_profit DECIMAL(10,2) NOT NULL,
        notes TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // 創建結算詳情表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS settlement_details (
        id SERIAL PRIMARY KEY,
        settlement_id INTEGER NOT NULL REFERENCES settlements(id),
        category VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT
      );
    `)

    // 創建結算賬戶變動表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS settlement_accounts (
        id SERIAL PRIMARY KEY,
        settlement_id INTEGER NOT NULL REFERENCES settlements(id),
        account_type VARCHAR(50) NOT NULL,
        opening_balance DECIMAL(10,2) NOT NULL,
        closing_balance DECIMAL(10,2) NOT NULL
      );
    `)

    return { success: true, message: "所有表格創建成功" }
  } catch (error) {
    console.error("創建表格時出錯:", error)
    return { success: false, error: error.message }
  }
}

// 插入初始數據
export async function seedInitialData() {
  try {
    // 檢查是否已有管理員用戶
    const adminCheck = await executeQuery("SELECT * FROM users WHERE role = $1 LIMIT 1", ["admin"])

    if (adminCheck.success && adminCheck.data.length === 0) {
      // 插入默認管理員用戶 (密碼: admin123)
      await executeQuery(
        `
        INSERT INTO users (username, password, name, email, role)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          "admin",
          "$2b$10$X7VYHy.2nv8fS.wbBjUz9OBCj.3ITZZ/9KNJ/5.sGaXCIxcQfn1RW",
          "系統管理員",
          "admin@example.com",
          "admin",
        ],
      )

      // 插入默認前台用戶 (密碼: user123)
      await executeQuery(
        `
        INSERT INTO users (username, password, name, email, role)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          "user",
          "$2b$10$dVwBhD.1pZd4hNQQR.Ck/OAUOlxu7xw5PYQwHiT8T1qJQSdBSNgZe",
          "前台用戶",
          "user@example.com",
          "user",
        ],
      )
    }

    // 插入默認系統設置
    const settingsCheck = await executeQuery("SELECT * FROM settings LIMIT 1")

    if (settingsCheck.success && settingsCheck.data.length === 0) {
      const defaultSettings = [
        { key: "system_name", value: "交易系統", description: "系統名稱" },
        { key: "dividend_cycle", value: "3", description: "分紅週期(天)" },
        { key: "currency", value: "HKD", description: "貨幣單位" },
        { key: "transaction_fee", value: "0.5", description: "交易手續費(%)" },
        { key: "timezone", value: "Asia/Hong_Kong", description: "系統時區" },
      ]

      for (const setting of defaultSettings) {
        await executeQuery(
          `
          INSERT INTO settings (key, value, description)
          VALUES ($1, $2, $3)
        `,
          [setting.key, setting.value, setting.description],
        )
      }
    }

    return { success: true, message: "初始數據填充成功" }
  } catch (error) {
    console.error("填充初始數據時出錯:", error)
    return { success: false, error: error.message }
  }
}

// 完整的數據庫初始化
export async function initializeDatabase() {
  const tablesResult = await createTables()
  if (!tablesResult.success) {
    return tablesResult
  }

  const seedResult = await seedInitialData()
  return seedResult
}

