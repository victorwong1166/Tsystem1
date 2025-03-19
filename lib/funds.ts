import { pool } from "@/lib/db"

// 獲取會員資金信息
export async function getMemberFunds(memberId: number) {
  try {
    // 檢查會員是否存在
    const memberResult = await pool.sql`
      SELECT id FROM members WHERE id = ${memberId}
    `

    if (memberResult.rows.length === 0) {
      return { success: false, error: "會員不存在" }
    }

    // 獲取會員資金信息
    const fundsResult = await pool.sql`
      SELECT * FROM funds WHERE member_id = ${memberId}
    `

    // 如果會員沒有資金記錄，創建一個默認記錄
    if (fundsResult.rows.length === 0) {
      const newFundResult = await pool.sql`
        INSERT INTO funds (member_id, balance, available_balance, frozen_balance, currency)
        VALUES (${memberId}, 0, 0, 0, 'CNY')
        RETURNING *
      `
      return { success: true, data: newFundResult.rows[0] }
    }

    return { success: true, data: fundsResult.rows[0] }
  } catch (error) {
    console.error("獲取會員資金信息錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 更新會員資金
export async function updateMemberFunds(
  memberId: number,
  data: {
    balance?: number
    available_balance?: number
    frozen_balance?: number
    currency?: string
  },
) {
  try {
    // 檢查會員是否存在
    const memberResult = await pool.sql`
      SELECT id FROM members WHERE id = ${memberId}
    `

    if (memberResult.rows.length === 0) {
      return { success: false, error: "會員不存在" }
    }

    // 檢查會員是否有資金記錄
    const fundsResult = await pool.sql`
      SELECT * FROM funds WHERE member_id = ${memberId}
    `

    // 如果會員沒有資金記錄，創建一個新記錄
    if (fundsResult.rows.length === 0) {
      const balance = data.balance || 0
      const available_balance = data.available_balance || 0
      const frozen_balance = data.frozen_balance || 0
      const currency = data.currency || "CNY"

      const newFundResult = await pool.sql`
        INSERT INTO funds (member_id, balance, available_balance, frozen_balance, currency)
        VALUES (${memberId}, ${balance}, ${available_balance}, ${frozen_balance}, ${currency})
        RETURNING *
      `
      return { success: true, data: newFundResult.rows[0] }
    }

    // 更新現有資金記錄
    const currentFunds = fundsResult.rows[0]
    const balance = data.balance !== undefined ? data.balance : currentFunds.balance
    const available_balance =
      data.available_balance !== undefined ? data.available_balance : currentFunds.available_balance
    const frozen_balance = data.frozen_balance !== undefined ? data.frozen_balance : currentFunds.frozen_balance
    const currency = data.currency || currentFunds.currency

    const updateResult = await pool.sql`
      UPDATE funds
      SET 
        balance = ${balance},
        available_balance = ${available_balance},
        frozen_balance = ${frozen_balance},
        currency = ${currency},
        last_updated = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE member_id = ${memberId}
      RETURNING *
    `

    return { success: true, data: updateResult.rows[0] }
  } catch (error) {
    console.error("更新會員資金錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 獲取所有會員資金信息
export async function getAllMemberFunds() {
  try {
    const result = await pool.sql`
      SELECT f.*, m.name as member_name
      FROM funds f
      JOIN members m ON f.member_id = m.id
      ORDER BY f.balance DESC
    `
    return { success: true, data: result.rows }
  } catch (error) {
    console.error("獲取所有會員資金信息錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 增加會員資金
export async function addMemberFunds(memberId: number, amount: number) {
  try {
    // 獲取當前資金信息
    const { success, data, error } = await getMemberFunds(memberId)

    if (!success) {
      return { success: false, error }
    }

    // 計算新的餘額
    const newBalance = Number.parseFloat(data.balance) + amount
    const newAvailableBalance = Number.parseFloat(data.available_balance) + amount

    // 更新資金
    return await updateMemberFunds(memberId, {
      balance: newBalance,
      available_balance: newAvailableBalance,
    })
  } catch (error) {
    console.error("增加會員資金錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 凍結會員資金
export async function freezeMemberFunds(memberId: number, amount: number) {
  try {
    // 獲取當前資金信息
    const { success, data, error } = await getMemberFunds(memberId)

    if (!success) {
      return { success: false, error }
    }

    // 檢查可用餘額是否足夠
    if (Number.parseFloat(data.available_balance) < amount) {
      return { success: false, error: "可用餘額不足" }
    }

    // 計算新的餘額
    const newAvailableBalance = Number.parseFloat(data.available_balance) - amount
    const newFrozenBalance = Number.parseFloat(data.frozen_balance) + amount

    // 更新資金
    return await updateMemberFunds(memberId, {
      available_balance: newAvailableBalance,
      frozen_balance: newFrozenBalance,
    })
  } catch (error) {
    console.error("凍結會員資金錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 解凍會員資金
export async function unfreezeMemberFunds(memberId: number, amount: number) {
  try {
    // 獲取當前資金信息
    const { success, data, error } = await getMemberFunds(memberId)

    if (!success) {
      return { success: false, error }
    }

    // 檢查凍結餘額是否足夠
    if (Number.parseFloat(data.frozen_balance) < amount) {
      return { success: false, error: "凍結餘額不足" }
    }

    // 計算新的餘額
    const newAvailableBalance = Number.parseFloat(data.available_balance) + amount
    const newFrozenBalance = Number.parseFloat(data.frozen_balance) - amount

    // 更新資金
    return await updateMemberFunds(memberId, {
      available_balance: newAvailableBalance,
      frozen_balance: newFrozenBalance,
    })
  } catch (error) {
    console.error("解凍會員資金錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 扣除會員資金
export async function deductMemberFunds(memberId: number, amount: number) {
  try {
    // 獲取當前資金信息
    const { success, data, error } = await getMemberFunds(memberId)

    if (!success) {
      return { success: false, error }
    }

    // 檢查可用餘額是否足夠
    if (Number.parseFloat(data.available_balance) < amount) {
      return { success: false, error: "可用餘額不足" }
    }

    // 計算新的餘額
    const newBalance = Number.parseFloat(data.balance) - amount
    const newAvailableBalance = Number.parseFloat(data.available_balance) - amount

    // 更新資金
    return await updateMemberFunds(memberId, {
      balance: newBalance,
      available_balance: newAvailableBalance,
    })
  } catch (error) {
    console.error("扣除會員資金錯誤:", error)
    return { success: false, error: error.message }
  }
}

