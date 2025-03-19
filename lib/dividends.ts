import { pool } from "@/lib/db"

export async function createDividend({
  total_profit,
  total_shares,
  dividend_per_share,
  is_loss = false,
  date = new Date(),
}) {
  console.log("創建分紅，數據:", { total_profit, total_shares, dividend_per_share, is_loss, date })

  try {
    // 檢查必填字段
    if (total_profit === undefined || total_profit === null) {
      throw new Error("總利潤為必填項")
    }

    if (!total_shares) {
      throw new Error("總股數為必填項")
    }

    if (dividend_per_share === undefined || dividend_per_share === null) {
      throw new Error("每股分紅為必填項")
    }

    // 執行數據庫插入操作
    const result = await pool.sql`
      INSERT INTO dividends (
        total_profit, 
        total_shares, 
        dividend_per_share, 
        is_loss,
        date,
        created_at,
        updated_at
      )
      VALUES (
        ${total_profit}, 
        ${total_shares}, 
        ${dividend_per_share}, 
        ${is_loss},
        ${date},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    console.log("分紅創建成功:", result.rows[0])

    // 獲取所有股東
    const shareholders = await pool.sql`
      SELECT * FROM members
      WHERE category = 'shareholder'
    `

    // 為每個股東創建分紅記錄
    for (const shareholder of shareholders.rows) {
      // 假設每個股東的股份數存儲在 shares 字段中
      const shares = shareholder.shares || 0
      const amount = shares * dividend_per_share

      if (shares > 0) {
        await pool.sql`
          INSERT INTO dividend_distributions (
            dividend_id,
            member_id,
            shares,
            amount,
            created_at,
            updated_at
          )
          VALUES (
            ${result.rows[0].id},
            ${shareholder.id},
            ${shares},
            ${amount},
            NOW(),
            NOW()
          )
        `
      }
    }

    return result.rows[0]
  } catch (error) {
    console.error("創建分紅錯誤:", error)
    throw error
  }
}

export async function getAllDividends() {
  try {
    const result = await pool.sql`
      SELECT * FROM dividends
      ORDER BY date DESC
    `
    return result.rows
  } catch (error) {
    console.error("獲取所有分紅錯誤:", error)
    throw error
  }
}

export async function getDividendById(id) {
  try {
    const result = await pool.sql`
      SELECT * FROM dividends
      WHERE id = ${id}
    `

    if (result.rows.length === 0) {
      return null
    }

    // 獲取該分紅的分配記錄
    const distributions = await pool.sql`
      SELECT dd.*, m.name as member_name
      FROM dividend_distributions dd
      JOIN members m ON dd.member_id = m.id
      WHERE dd.dividend_id = ${id}
    `

    return {
      ...result.rows[0],
      distributions: distributions.rows,
    }
  } catch (error) {
    console.error("通過ID獲取分紅錯誤:", error)
    throw error
  }
}

export async function getDividendsByMemberId(memberId) {
  try {
    const result = await pool.sql`
      SELECT d.*, dd.shares, dd.amount
      FROM dividends d
      JOIN dividend_distributions dd ON d.id = dd.dividend_id
      WHERE dd.member_id = ${memberId}
      ORDER BY d.date DESC
    `
    return result.rows
  } catch (error) {
    console.error("通過會員ID獲取分紅錯誤:", error)
    throw error
  }
}

