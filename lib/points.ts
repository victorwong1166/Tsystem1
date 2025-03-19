import { pool } from "@/lib/db"

// 獲取所有積分類型
export async function getAllPointTypes() {
  try {
    const result = await pool.sql`
      SELECT * FROM point_types
      ORDER BY name
    `
    return { success: true, data: result.rows }
  } catch (error) {
    console.error("獲取積分類型失敗:", error)
    return { success: false, error: error.message }
  }
}

// 創建新的積分類型
export async function createPointType(name: string, description: string, exchangeRate: number) {
  try {
    const result = await pool.sql`
      INSERT INTO point_types (name, description, exchange_rate)
      VALUES (${name}, ${description}, ${exchangeRate})
      RETURNING *
    `
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("創建積分類型失敗:", error)
    return { success: false, error: error.message }
  }
}

// 更新積分類型
export async function updatePointType(
  id: number,
  data: { name?: string; description?: string; exchangeRate?: number; isActive?: boolean },
) {
  try {
    const { name, description, exchangeRate, isActive } = data
    const result = await pool.sql`
      UPDATE point_types
      SET 
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        exchange_rate = COALESCE(${exchangeRate}, exchange_rate),
        is_active = COALESCE(${isActive}, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return { success: false, error: "積分類型不存在" }
    }

    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("更新積分類型失敗:", error)
    return { success: false, error: error.message }
  }
}

// 刪除積分類型
export async function deletePointType(id: number) {
  try {
    // 檢查是否有會員積分使用此類型
    const checkResult = await pool.sql`
      SELECT COUNT(*) FROM member_points WHERE point_type_id = ${id}
    `

    if (Number.parseInt(checkResult.rows[0].count) > 0) {
      return { success: false, error: "此積分類型已被使用，無法刪除" }
    }

    const result = await pool.sql`
      DELETE FROM point_types WHERE id = ${id} RETURNING *
    `

    if (result.rows.length === 0) {
      return { success: false, error: "積分類型不存在" }
    }

    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("刪除積分類型失敗:", error)
    return { success: false, error: error.message }
  }
}

// 獲取會員積分餘額
export async function getMemberPoints(memberId: number) {
  try {
    const result = await pool.sql`
      SELECT mp.*, pt.name as point_type_name, pt.description as point_type_description, pt.exchange_rate
      FROM member_points mp
      JOIN point_types pt ON mp.point_type_id = pt.id
      WHERE mp.member_id = ${memberId}
    `
    return { success: true, data: result.rows }
  } catch (error) {
    console.error("獲取會員積分失敗:", error)
    return { success: false, error: error.message }
  }
}

// 獲取會員積分交易記錄
export async function getMemberPointTransactions(memberId: number) {
  try {
    const result = await pool.sql`
      SELECT pt.*, ptype.name as point_type_name
      FROM point_transactions pt
      JOIN point_types ptype ON pt.point_type_id = ptype.id
      WHERE pt.member_id = ${memberId}
      ORDER BY pt.created_at DESC
    `
    return { success: true, data: result.rows }
  } catch (error) {
    console.error("獲取會員積分交易記錄失敗:", error)
    return { success: false, error: error.message }
  }
}

// 添加積分
export async function addPoints(
  memberId: number,
  pointTypeId: number,
  amount: number,
  description: string,
  referenceId?: string,
  expiresAt?: Date,
) {
  try {
    // 開始事務
    await pool.sql`BEGIN`

    try {
      // 檢查會員是否存在
      const memberCheck = await pool.sql`SELECT id FROM members WHERE id = ${memberId}`
      if (memberCheck.rows.length === 0) {
        throw new Error("會員不存在")
      }

      // 檢查積分類型是否存在
      const typeCheck = await pool.sql`SELECT id FROM point_types WHERE id = ${pointTypeId} AND is_active = TRUE`
      if (typeCheck.rows.length === 0) {
        throw new Error("積分類型不存在或已停用")
      }

      // 添加積分交易記錄
      await pool.sql`
        INSERT INTO point_transactions (
          member_id, point_type_id, amount, transaction_type, 
          description, reference_id, expires_at
        )
        VALUES (
          ${memberId}, ${pointTypeId}, ${amount}, 'add', 
          ${description}, ${referenceId || null}, ${expiresAt || null}
        )
      `

      // 更新會員積分餘額
      const existingPoints = await pool.sql`
        SELECT id, balance FROM member_points 
        WHERE member_id = ${memberId} AND point_type_id = ${pointTypeId}
      `

      if (existingPoints.rows.length > 0) {
        // 更新現有積分
        await pool.sql`
          UPDATE member_points 
          SET 
            balance = balance + ${amount},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${existingPoints.rows[0].id}
        `
      } else {
        // 創建新的積分記錄
        await pool.sql`
          INSERT INTO member_points (member_id, point_type_id, balance)
          VALUES (${memberId}, ${pointTypeId}, ${amount})
        `
      }

      // 提交事務
      await pool.sql`COMMIT`

      return { success: true, message: "積分添加成功" }
    } catch (error) {
      // 回滾事務
      await pool.sql`ROLLBACK`
      throw error
    }
  } catch (error) {
    console.error("添加積分失敗:", error)
    return { success: false, error: error.message }
  }
}

// 使用積分
export async function usePoints(
  memberId: number,
  pointTypeId: number,
  amount: number,
  description: string,
  referenceId?: string,
) {
  try {
    // 開始事務
    await pool.sql`BEGIN`

    try {
      // 檢查會員是否存在
      const memberCheck = await pool.sql`SELECT id FROM members WHERE id = ${memberId}`
      if (memberCheck.rows.length === 0) {
        throw new Error("會員不存在")
      }

      // 檢查積分類型是否存在
      const typeCheck = await pool.sql`SELECT id FROM point_types WHERE id = ${pointTypeId} AND is_active = TRUE`
      if (typeCheck.rows.length === 0) {
        throw new Error("積分類型不存在或已停用")
      }

      // 檢查會員是否有足夠的積分
      const pointsCheck = await pool.sql`
        SELECT balance FROM member_points 
        WHERE member_id = ${memberId} AND point_type_id = ${pointTypeId}
      `

      if (pointsCheck.rows.length === 0 || pointsCheck.rows[0].balance < amount) {
        throw new Error("積分不足")
      }

      // 添加積分交易記錄
      await pool.sql`
        INSERT INTO point_transactions (
          member_id, point_type_id, amount, transaction_type, 
          description, reference_id
        )
        VALUES (
          ${memberId}, ${pointTypeId}, ${-amount}, 'use', 
          ${description}, ${referenceId || null}
        )
      `

      // 更新會員積分餘額
      await pool.sql`
        UPDATE member_points 
        SET 
          balance = balance - ${amount},
          updated_at = CURRENT_TIMESTAMP
        WHERE member_id = ${memberId} AND point_type_id = ${pointTypeId}
      `

      // 提交事務
      await pool.sql`COMMIT`

      return { success: true, message: "積分使用成功" }
    } catch (error) {
      // 回滾事務
      await pool.sql`ROLLBACK`
      throw error
    }
  } catch (error) {
    console.error("使用積分失敗:", error)
    return { success: false, error: error.message }
  }
}

// 創建積分兌換規則
export async function createRedemptionRule(
  name: string,
  description: string,
  pointsRequired: number,
  rewardType: string,
  rewardValue: string,
  startDate?: Date,
  endDate?: Date,
) {
  try {
    const result = await pool.sql`
      INSERT INTO point_redemption_rules (
        name, description, points_required, reward_type, 
        reward_value, start_date, end_date
      )
      VALUES (
        ${name}, ${description}, ${pointsRequired}, ${rewardType}, 
        ${rewardValue}, ${startDate || null}, ${endDate || null}
      )
      RETURNING *
    `
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("創建積分兌換規則失敗:", error)
    return { success: false, error: error.message }
  }
}

// 獲取所有積分兌換規則
export async function getAllRedemptionRules() {
  try {
    const result = await pool.sql`
      SELECT * FROM point_redemption_rules
      ORDER BY points_required
    `
    return { success: true, data: result.rows }
  } catch (error) {
    console.error("獲取積分兌換規則失敗:", error)
    return { success: false, error: error.message }
  }
}

// 兌換積分
export async function redeemPoints(memberId: number, ruleId: number, description: string) {
  try {
    // 開始事務
    await pool.sql`BEGIN`

    try {
      // 獲取兌換規則詳情
      const ruleResult = await pool.sql`
        SELECT * FROM point_redemption_rules 
        WHERE id = ${ruleId} AND is_active = TRUE
        AND (start_date IS NULL OR start_date <= CURRENT_TIMESTAMP)
        AND (end_date IS NULL OR end_date >= CURRENT_TIMESTAMP)
      `

      if (ruleResult.rows.length === 0) {
        throw new Error("兌換規則不存在或已過期")
      }

      const rule = ruleResult.rows[0]

      // 檢查會員是否有足夠的積分
      const pointsResult = await pool.sql`
        SELECT SUM(balance) as total_points FROM member_points 
        WHERE member_id = ${memberId}
      `

      const totalPoints = Number.parseInt(pointsResult.rows[0].total_points) || 0

      if (totalPoints < rule.points_required) {
        throw new Error("積分不足")
      }

      // 從各種積分類型中扣除積分，優先使用即將過期的積分
      let remainingPoints = rule.points_required

      const memberPoints = await pool.sql`
        SELECT * FROM member_points 
        WHERE member_id = ${memberId} AND balance > 0
        ORDER BY updated_at ASC
      `

      for (const pointRecord of memberPoints.rows) {
        if (remainingPoints <= 0) break

        const pointsToDeduct = Math.min(remainingPoints, pointRecord.balance)

        // 更新會員積分餘額
        await pool.sql`
          UPDATE member_points 
          SET 
            balance = balance - ${pointsToDeduct},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${pointRecord.id}
        `

        // 添加積分交易記錄
        await pool.sql`
          INSERT INTO point_transactions (
            member_id, point_type_id, amount, transaction_type, 
            description, reference_id
          )
          VALUES (
            ${memberId}, ${pointRecord.point_type_id}, ${-pointsToDeduct}, 'redeem', 
            ${description}, ${ruleId.toString()}
          )
        `

        remainingPoints -= pointsToDeduct
      }

      // 提交事務
      await pool.sql`COMMIT`

      return {
        success: true,
        message: "積分兌換成功",
        reward: {
          type: rule.reward_type,
          value: rule.reward_value,
        },
      }
    } catch (error) {
      // 回滾事務
      await pool.sql`ROLLBACK`
      throw error
    }
  } catch (error) {
    console.error("兌換積分失敗:", error)
    return { success: false, error: error.message }
  }
}

