import { pool } from "./db"
import { nanoid } from "nanoid"

// 獲取最新期數
export async function getLatestPeriodNumber() {
  try {
    // 使用原始SQL查詢獲取最新期數
    // 注意：這裡假設數據庫中有一個名為settlements的表，且有periodNumber字段
    const result = await pool.query(`SELECT MAX(period_number) as max_period FROM settlements`, [])

    // 檢查結果
    if (result && result.rows.length > 0 && result.rows[0].max_period) {
      return Number.parseInt(result.rows[0].max_period) + 1
    }

    // 如果沒有記錄或查詢失敗，返回1作為第一期
    return 1
  } catch (error) {
    console.error("獲取最新期數失敗:", error)
    // 出錯時默認返回1
    return 1
  }
}

// 創建新結算 - 簡化版本，僅記錄基本信息
export async function createSettlement(data) {
  try {
    // 獲取最新期數
    const periodNumber = await getLatestPeriodNumber()

    // 生成唯一結算ID
    const settlementId = `S${Date.now().toString().slice(-8)}${nanoid(4).toUpperCase()}`

    // 使用原始SQL插入結算記錄
    await pool.query(
      `INSERT INTO settlements (
        settlement_id, 
        period_number, 
        date, 
        total_revenue, 
        total_expenses, 
        net_profit, 
        notes, 
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )`,
      [
        settlementId,
        periodNumber,
        new Date(data.date),
        data.totalRevenue,
        data.totalExpenses,
        data.netProfit,
        data.notes || "",
        data.createdBy || 1,
      ],
    )

    return {
      success: true,
      settlement: {
        settlementId,
        periodNumber,
        date: new Date(data.date),
        totalRevenue: data.totalRevenue,
        totalExpenses: data.totalExpenses,
        netProfit: data.netProfit,
      },
    }
  } catch (error) {
    console.error("創建結算失敗:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// 獲取結算歷史 - 簡化版本
export async function getSettlementHistory(limit = 10, offset = 0) {
  try {
    const result = await pool.query(`SELECT * FROM settlements ORDER BY date DESC LIMIT $1 OFFSET $2`, [limit, offset])

    return {
      success: true,
      settlements: result.rows || [],
    }
  } catch (error) {
    console.error("獲取結算歷史失敗:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// 獲取結算詳情 - 簡化版本
export async function getSettlementById(id) {
  try {
    const result = await pool.query(`SELECT * FROM settlements WHERE id = $1 OR settlement_id = $2 LIMIT 1`, [id, id])

    if (!result || result.rows.length === 0) {
      return {
        success: false,
        error: "結算記錄不存在",
      }
    }

    return {
      success: true,
      settlement: result.rows[0],
    }
  } catch (error) {
    console.error("獲取結算詳情失敗:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

