import { pool } from "@/lib/db"

export async function initializeDatabase() {
  console.log("開始初始化數據庫...")

  try {
    // 首先测试连接
    console.log("测试数据库连接...")
    if (!pool || !pool.sql) {
      throw new Error("数据库连接池未正确初始化，请检查环境变量 DATABASE_URL 是否正确设置")
    }

    // 测试连接
    await pool.sql`SELECT 1`
    console.log("数据库连接成功")

    // 創建 members 表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        address TEXT,
        category VARCHAR(50) DEFAULT 'regular',
        agent_id INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("members 表創建成功")

    // 創建 transactions 表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES members(id),
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT,
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("transactions 表創建成功")

    // 創建 dividends 表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS dividends (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES members(id),
        amount DECIMAL(15, 2) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("dividends 表創建成功")

    // 創建 agents 表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        commission_rate DECIMAL(5, 2) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("agents 表創建成功")

    // 創建 funds 表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS funds (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES members(id),
        balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
        available_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
        frozen_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
        currency VARCHAR(10) NOT NULL DEFAULT 'CNY',
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("funds 表創建成功")

    // 创建资金类别表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS fund_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("fund_categories 表創建成功")

    // 修改资金表，添加类别关联
    await pool.sql`
      ALTER TABLE funds 
      ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES fund_categories(id)
    `

    // 添加默认资金类别
    const categories = [
      { name: "營運資金", description: "日常營運所需的資金" },
      { name: "投資資金", description: "用於投資項目的資金" },
      { name: "儲備資金", description: "應急儲備資金" },
    ]

    for (const category of categories) {
      try {
        await pool.sql`
          INSERT INTO fund_categories (name, description)
          VALUES (${category.name}, ${category.description})
          ON CONFLICT (name) DO NOTHING
        `
      } catch (error) {
        console.error(`添加默认资金类别 ${category.name} 失败:`, error)
      }
    }

    // 創建積分類型表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS point_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        exchange_rate DECIMAL(10, 2) DEFAULT 1.00,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("point_types 表創建成功")

    // 添加默認積分類型
    const pointTypes = [
      { name: "消費積分", description: "通過消費獲得的積分", exchange_rate: 1.0 },
      { name: "活動積分", description: "通過參與活動獲得的積分", exchange_rate: 0.8 },
      { name: "推薦積分", description: "通過推薦新會員獲得的積分", exchange_rate: 1.2 },
    ]

    for (const type of pointTypes) {
      try {
        await pool.sql`
          INSERT INTO point_types (name, description, exchange_rate)
          VALUES (${type.name}, ${type.description}, ${type.exchange_rate})
          ON CONFLICT (name) DO NOTHING
        `
      } catch (error) {
        console.error(`添加默認積分類型 ${type.name} 失敗:`, error)
      }
    }

    // 創建會員積分表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS member_points (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES members(id) NOT NULL,
        point_type_id INTEGER REFERENCES point_types(id) NOT NULL,
        balance INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("member_points 表創建成功")

    // 創建積分交易記錄表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS point_transactions (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES members(id) NOT NULL,
        point_type_id INTEGER REFERENCES point_types(id) NOT NULL,
        amount INTEGER NOT NULL,
        transaction_type VARCHAR(20) NOT NULL,
        description TEXT,
        reference_id VARCHAR(100),
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("point_transactions 表創建成功")

    // 創建積分兌換規則表
    await pool.sql`
      CREATE TABLE IF NOT EXISTS point_redemption_rules (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        points_required INTEGER NOT NULL,
        reward_type VARCHAR(50) NOT NULL,
        reward_value VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("point_redemption_rules 表創建成功")

    return { success: true, message: "數據庫初始化成功" }
  } catch (error) {
    console.error("數據庫初始化錯誤:", error)
    return {
      success: false,
      message: `數據庫初始化錯誤: ${error.message}`,
      details: error.stack,
    }
  }
}

export async function checkTablesExist() {
  try {
    // 首先测试连接
    if (!pool || !pool.sql) {
      throw new Error("数据库连接池未正确初始化，请检查环境变量 DATABASE_URL 是否正确设置")
    }

    // 测试连接
    await pool.sql`SELECT 1`

    // 檢查 members 表是否存在
    const membersResult = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'members'
      )
    `
    const membersExists = membersResult.rows[0].exists

    // 檢查 transactions 表是否存在
    const transactionsResult = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'transactions'
      )
    `
    const transactionsExists = transactionsResult.rows[0].exists

    // 檢查 dividends 表是否存在
    const dividendsResult = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'dividends'
      )
    `
    const dividendsExists = dividendsResult.rows[0].exists

    // 檢查 agents 表是否存在
    const agentsResult = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'agents'
      )
    `
    const agentsExists = agentsResult.rows[0].exists

    // 檢查 funds 表是否存在
    const fundsResult = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'funds'
      )
    `
    const fundsExists = fundsResult.rows[0].exists

    // 檢查 point_types 表是否存在
    const pointTypesResult = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'point_types'
      )
    `
    const pointTypesExists = pointTypesResult.rows[0].exists

    // 檢查 member_points 表是否存在
    const memberPointsResult = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'member_points'
      )
    `
    const memberPointsExists = memberPointsResult.rows[0].exists

    // 檢查 point_transactions 表是否存在
    const pointTransactionsResult = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'point_transactions'
      )
    `
    const pointTransactionsExists = pointTransactionsResult.rows[0].exists

    return {
      members: membersExists,
      transactions: transactionsExists,
      dividends: dividendsExists,
      agents: agentsExists,
      funds: fundsExists,
      pointTypes: pointTypesExists,
      memberPoints: memberPointsExists,
      pointTransactions: pointTransactionsExists,
      allExist:
        membersExists &&
        transactionsExists &&
        dividendsExists &&
        agentsExists &&
        fundsExists &&
        pointTypesExists &&
        memberPointsExists &&
        pointTransactionsExists,
    }
  } catch (error) {
    console.error("檢查表是否存在錯誤:", error)
    return {
      members: false,
      transactions: false,
      dividends: false,
      agents: false,
      funds: false,
      pointTypes: false,
      memberPoints: false,
      pointTransactions: false,
      allExist: false,
      error: error.message,
      details: error.stack,
    }
  }
}

