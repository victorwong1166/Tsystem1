import { sql } from "./db"

// 清除所有模擬數據
export async function clearAllMockData() {
  try {
    let deletedMembers = 0
    let deletedTransactions = 0

    // 1. 刪除模擬交易數據
    // 刪除描述中包含"測試"或名稱以"測試"開頭的交易
    const transactionsResult = await sql`
      DELETE FROM transactions
      WHERE description LIKE ${"%測試%"} 
      OR description LIKE ${"%test%"}
      OR member_id IN (
        SELECT id FROM members 
        WHERE name LIKE ${"測試%"} 
        OR name LIKE ${"test%"} 
        OR notes LIKE ${"%測試數據%"}
        OR notes LIKE ${"%test data%"}
      )
      RETURNING id
    `
    deletedTransactions = transactionsResult.length || 0

    // 2. 刪除模擬會員數據
    // 刪除名稱以"測試"開頭或備註中包含"測試數據"的會員
    const membersResult = await sql`
      DELETE FROM members
      WHERE name LIKE ${"測試%"} 
      OR name LIKE ${"test%"} 
      OR notes LIKE ${"%測試數據%"}
      OR notes LIKE ${"%test data%"}
      RETURNING id
    `
    deletedMembers = membersResult.length || 0

    return {
      success: true,
      deletedMembers,
      deletedTransactions,
      message: `成功清除 ${deletedMembers} 個模擬會員和 ${deletedTransactions} 筆模擬交易`,
    }
  } catch (error) {
    console.error("清除模擬數據錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 清除特定表的所有數據
export async function clearTableData(tableName: string) {
  try {
    // 檢查表是否存在
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      )
    `

    if (!tableExists[0]?.exists) {
      return { success: false, error: `表 ${tableName} 不存在` }
    }

    // 清空表數據
    await sql`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`

    return {
      success: true,
      message: `成功清空 ${tableName} 表的所有數據`,
    }
  } catch (error) {
    console.error(`清空表 ${tableName} 數據錯誤:`, error)
    return { success: false, error: error.message }
  }
}

