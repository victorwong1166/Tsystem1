import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// 配置 Neon 客戶端
neonConfig.fetchConnectionCache = true

// 創建 SQL 客戶端
const sql = neon(process.env.DATABASE_URL!)

// 創建 Drizzle ORM 實例
export const db = drizzle(sql)

// 測試數據庫連接
export async function testConnection() {
  try {
    const startTime = Date.now()
    const result = await sql`SELECT NOW() as now, current_database() as db_name, version() as version`
    const endTime = Date.now()

    return {
      success: true,
      timestamp: result[0].now,
      dbName: result[0].db_name,
      version: result[0].version,
      responseTime: `${endTime - startTime}ms`,
    }
  } catch (error) {
    console.error("Database connection error:", error)
    return { success: false, error: error.message }
  }
}

// 獲取數據庫統計信息
export async function getDatabaseStats() {
  try {
    // 獲取表格數量
    const tablesResult = await sql`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    // 獲取數據庫大小
    const sizeResult = await sql`
      SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
    `

    // 獲取表格列表及其列數
    const tablesInfoResult = await sql`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns 
         WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
      FROM 
        information_schema.tables t
      WHERE 
        table_schema = 'public'
      ORDER BY 
        table_name
    `

    // 獲取最近的查詢統計
    const recentQueriesResult = await sql`
      SELECT 
        substring(query, 1, 100) as query,
        calls,
        total_exec_time,
        rows,
        mean_exec_time
      FROM 
        pg_stat_statements
      ORDER BY 
        total_exec_time DESC
      LIMIT 5
    `.catch(() => []) // 如果 pg_stat_statements 擴展未啟用，返回空數組

    return {
      success: true,
      tableCount: tablesResult[0].table_count,
      dbSize: sizeResult[0].db_size,
      tables: tablesInfoResult,
      recentQueries: recentQueriesResult,
    }
  } catch (error) {
    console.error("Error getting database stats:", error)
    return { success: false, error: error.message }
  }
}

// 執行原始SQL查詢
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const startTime = Date.now()
    // 將參數轉換為 SQL 參數格式
    const sqlParams = params.map((param) => sql`${param}`)
    const result = await sql.query(query, sqlParams)
    const endTime = Date.now()

    return {
      success: true,
      data: result,
      rowCount: result.length,
      duration: `${endTime - startTime}ms`,
    }
  } catch (error) {
    console.error("Query execution error:", error)
    return { success: false, error: error.message }
  }
}

// 獲取表結構信息
export async function getTableSchema(tableName: string) {
  try {
    // 獲取列信息
    const columnsResult = await sql`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length,
        column_default,
        is_nullable
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public' AND
        table_name = ${tableName}
      ORDER BY 
        ordinal_position
    `

    // 獲取約束信息
    const constraintsResult = await sql`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM
        information_schema.table_constraints tc
      JOIN
        information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      LEFT JOIN
        information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
      WHERE
        tc.table_schema = 'public' AND
        tc.table_name = ${tableName}
    `

    return {
      success: true,
      columns: columnsResult,
      constraints: constraintsResult,
    }
  } catch (error) {
    console.error("Error getting table schema:", error)
    return { success: false, error: error.message }
  }
}

