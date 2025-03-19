import { createPool } from "@vercel/postgres"

// 創建一個使用 DATABASE_URL 的連接池
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
})

// 測試數據庫連接
export async function testDatabaseConnection() {
  try {
    const startTime = Date.now()

    // 使用 pool 而不是 sql
    const result =
      await pool.sql`SELECT current_database() as db_name, current_timestamp as timestamp, version() as version`

    const responseTime = `${Date.now() - startTime}ms`

    return {
      success: true,
      dbName: result.rows[0].db_name,
      timestamp: result.rows[0].timestamp,
      version: result.rows[0].version,
      responseTime,
    }
  } catch (error) {
    console.error("Database connection test error:", error)
    return { success: false, error: error.message }
  }
}

// 執行測試查詢
export async function executeTestQuery(query: string) {
  try {
    const startTime = Date.now()

    // 使用 pool 而不是 sql
    const result = await pool.query(query)

    const duration = `${Date.now() - startTime}ms`

    return {
      success: true,
      data: result.rows || [],
      rowCount: result.rowCount || 0,
      duration,
    }
  } catch (error) {
    console.error("Query execution error:", error)
    return { success: false, error: error.message }
  }
}

// 測試數據庫性能
export async function testDatabasePerformance() {
  try {
    const startTime = Date.now()
    const results = []

    // 測試1: 簡單查詢
    const test1Start = Date.now()
    await pool.sql`SELECT 1`
    const test1Duration = Date.now() - test1Start
    results.push({
      name: "簡單查詢",
      duration: `${test1Duration}ms`,
      status: test1Duration < 20 ? "success" : test1Duration < 50 ? "warning" : "error",
    })

    // 測試2: 表掃描
    const test2Start = Date.now()
    await pool.sql`SELECT COUNT(*) FROM information_schema.tables`
    const test2Duration = Date.now() - test2Start
    results.push({
      name: "表掃描",
      duration: `${test2Duration}ms`,
      status: test2Duration < 50 ? "success" : test2Duration < 100 ? "warning" : "error",
    })

    // 測試3: 連接查詢
    const test3Start = Date.now()
    await pool.sql`
      SELECT t.table_name, c.column_name 
      FROM information_schema.tables t
      JOIN information_schema.columns c ON t.table_name = c.table_name
      WHERE t.table_schema = 'public'
      LIMIT 10
    `
    const test3Duration = Date.now() - test3Start
    results.push({
      name: "連接查詢",
      duration: `${test3Duration}ms`,
      status: test3Duration < 100 ? "success" : test3Duration < 200 ? "warning" : "error",
    })

    // 測試4: 事務處理 - 使用 pool.transaction 而不是 sql.begin
    const test4Start = Date.now()
    await pool.transaction(async (client) => {
      await client.sql`SELECT 1`
      await client.sql`SELECT 2`
    })
    const test4Duration = Date.now() - test4Start
    results.push({
      name: "事務處理",
      duration: `${test4Duration}ms`,
      status: test4Duration < 50 ? "success" : test4Duration < 100 ? "warning" : "error",
    })

    // 測試5: 並發查詢
    const test5Start = Date.now()
    await Promise.all([pool.sql`SELECT 1`, pool.sql`SELECT 2`, pool.sql`SELECT 3`])
    const test5Duration = Date.now() - test5Start
    results.push({
      name: "並發查詢",
      duration: `${test5Duration}ms`,
      status: test5Duration < 50 ? "success" : test5Duration < 100 ? "warning" : "error",
    })

    const totalDuration = Date.now() - startTime
    const passedTests = results.filter((r) => r.status === "success").length
    const warningTests = results.filter((r) => r.status === "warning").length
    const failedTests = results.filter((r) => r.status === "error").length
    const avgDuration = results.reduce((acc, curr) => acc + Number.parseInt(curr.duration), 0) / results.length

    return {
      success: true,
      tests: results,
      summary: {
        totalTests: results.length,
        passedTests,
        warningTests,
        failedTests,
        averageDuration: `${avgDuration.toFixed(1)}ms`,
        totalDuration: `${totalDuration}ms`,
      },
    }
  } catch (error) {
    console.error("Database performance test error:", error)
    return { success: false, error: error.message }
  }
}

// 獲取表統計信息
export async function getTableStatistics(tableName: string) {
  try {
    // 檢查表是否存在
    const tableExists = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      )
    `

    if (!tableExists || !tableExists.rows.length || !tableExists.rows[0].exists) {
      return { success: false, error: `表 ${tableName} 不存在或無法檢查表存在性` }
    }

    // 獲取行數
    const rowCountQuery = await pool.sql`SELECT COUNT(*) as count FROM "${tableName}"`
    const rowCount = Number.parseInt(rowCountQuery.rows[0].count)

    // 獲取列信息
    const columnInfo = await pool.sql`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = ${tableName}
      ORDER BY ordinal_position
    `

    // 獲取表大小
    const tableSize = await pool.sql`
      SELECT pg_size_pretty(pg_total_relation_size(${tableName})) as size
    `

    // 獲取索引信息
    const indexInfo = await pool.sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = ${tableName}
    `

    // 獲取樣本數據
    const sampleData = await pool.sql`SELECT * FROM "${tableName}" LIMIT 5`

    // 確保所有數據都有有效值
    const size = tableSize && tableSize.rows.length > 0 ? tableSize.rows[0].size : "未知"

    return {
      success: true,
      tableName,
      rowCount: rowCount || 0,
      columnCount: columnInfo ? columnInfo.rows.length : 0,
      columns: columnInfo ? columnInfo.rows : [],
      sizeOnDisk: size,
      lastUpdated: new Date().toISOString(),
      indexCount: indexInfo ? indexInfo.rows.length : 0,
      indexes: indexInfo ? indexInfo.rows : [],
      hasNulls: true, // 這需要更複雜的查詢來確定
      sampleData: sampleData ? sampleData.rows : [],
    }
  } catch (error) {
    console.error("Error getting table statistics:", error)
    return { success: false, error: error.message }
  }
}

// 生成測試數據
export async function generateTestData(tableName: string, count: number) {
  try {
    // 檢查表是否存在
    const tableExists = await pool.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      )
    `

    if (!tableExists || !tableExists.rows.length || !tableExists.rows[0].exists) {
      return { success: false, error: `表 ${tableName} 不存在或無法檢查表存在性` }
    }

    // 獲取列信息
    const columnInfo = await pool.sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = ${tableName}
      AND column_name NOT IN ('id', 'created_at', 'updated_at')
      ORDER BY ordinal_position
    `

    if (columnInfo.rows.length === 0) {
      return { success: false, error: `表 ${tableName} 沒有可填充的列` }
    }

    // 根據表生成適當的測試數據
    let insertedCount = 0

    if (tableName === "members") {
      // 為會員表生成測試數據
      for (let i = 0; i < count; i++) {
        const memberID = `M${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, "0")}`
        const name = `測試會員${i + 1}`
        const phone = `09${String(Math.floor(10000000 + Math.random() * 90000000)).substring(0, 8)}`
        const type = ["regular", "agent", "shareholder"][Math.floor(Math.random() * 3)]

        await pool.sql`
          INSERT INTO members (member_id, name, phone, type, created_at, updated_at)
          VALUES (${memberID}, ${name}, ${phone}, ${type}, NOW(), NOW())
        `

        insertedCount++
      }
    } else if (tableName === "transactions") {
      // 為交易表生成測試數據
      // 首先獲取一些會員ID
      const members = await pool.sql`SELECT id FROM members LIMIT 10`
      if (!members || members.rows.length === 0) {
        return { success: false, error: `沒有會員數據，無法生成交易測試數據` }
      }

      for (let i = 0; i < count; i++) {
        try {
          const randomIndex = Math.floor(Math.random() * members.rows.length)
          if (members.rows[randomIndex] && members.rows[randomIndex].id) {
            const memberID = members.rows[randomIndex].id
            const amount = Math.floor(1000 + Math.random() * 9000)
            const type = ["buy", "sell", "transfer"][Math.floor(Math.random() * 3)]
            const status = ["completed", "pending", "cancelled"][Math.floor(Math.random() * 3)]

            await pool.sql`
              INSERT INTO transactions (member_id, amount, type, status, created_at, updated_at)
              VALUES (${memberID}, ${amount}, ${type}, ${status}, NOW(), NOW())
            `

            insertedCount++
          }
        } catch (error) {
          console.error(`Error generating test transaction ${i}:`, error)
          // 繼續嘗試生成其他記錄
        }
      }
    } else {
      // 為其他表生成通用測試數據
      for (let i = 0; i < count; i++) {
        try {
          await pool.sql`
            INSERT INTO "${tableName}" (name, created_at, updated_at)
            VALUES (${"測試數據" + (i + 1)}, NOW(), NOW())
          `
          insertedCount++
        } catch (error) {
          console.error(`Error inserting test data row ${i}:`, error)
          // 繼續嘗試插入其他行
        }
      }
    }

    return {
      success: true,
      message: `成功為 ${tableName} 表生成了 ${insertedCount} 條測試數據`,
      insertedCount,
    }
  } catch (error) {
    console.error("Error generating test data:", error)
    return { success: false, error: error.message }
  }
}

// 創建一個測試表（如果不存在）並寫入測試數據
export async function testDatabaseWrite(testData: string) {
  try {
    // 1. 創建測試表（如果不存在）
    await pool.sql`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        test_data TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // 2. 寫入測試數據
    const result = await pool.sql`
      INSERT INTO test_table (test_data)
      VALUES (${testData})
      RETURNING *
    `

    // 3. 讀取最近的測試數據
    const recentData = await pool.sql`
      SELECT * FROM test_table
      ORDER BY created_at DESC
      LIMIT 5
    `

    return {
      success: true,
      message: "測試數據寫入成功",
      insertedRow: result.rows[0],
      recentData: recentData.rows,
    }
  } catch (error: any) {
    console.error("數據庫寫入測試錯誤:", error)
    return {
      success: false,
      message: "測試數據寫入失敗",
      error: error.message,
      stack: error.stack,
    }
  }
}

