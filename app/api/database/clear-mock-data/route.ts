import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
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

    return NextResponse.json({
      success: true,
      deletedMembers,
      deletedTransactions,
      message: `成功清除 ${deletedMembers} 個模擬會員和 ${deletedTransactions} 筆模擬交易`,
    })
  } catch (error) {
    console.error("清除模擬數據錯誤:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

