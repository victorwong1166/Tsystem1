"use server"

import { createMember, updateMember } from "@/lib/members"
import { createTransaction } from "@/lib/transactions"
import { createDividend } from "@/lib/dividends"

// 添加會員 Server Action
export async function addMember(formData) {
  const name = formData.get("name")
  const phone = formData.get("phone") || ""
  const email = formData.get("email") || ""
  const address = formData.get("address") || ""
  const category = formData.get("category") || "regular"
  const agent_id = formData.get("agent_id") || null
  const notes = formData.get("notes") || ""

  console.log("Server Action: 添加會員", {
    name,
    phone,
    email,
    address,
    category,
    agent_id,
    notes,
  })

  try {
    const result = await createMember({
      name,
      phone,
      email,
      address,
      category,
      agent_id,
      notes,
    })

    console.log("添加會員成功:", result[0])
    return { success: true, member: result[0] }
  } catch (error) {
    console.error("添加會員錯誤:", error)
    return {
      success: false,
      error: error.message,
      details: error.stack,
    }
  }
}

// 更新會員 Server Action
export async function updateMemberAction(id, formData) {
  const name = formData.get("name")
  const phone = formData.get("phone") || ""
  const email = formData.get("email") || ""
  const address = formData.get("address") || ""
  const category = formData.get("category") || "regular"
  const agent_id = formData.get("agent_id") || null
  const notes = formData.get("notes") || ""

  console.log("Server Action: 更新會員", {
    id,
    name,
    phone,
    email,
    address,
    category,
    agent_id,
    notes,
  })

  try {
    const result = await updateMember(id, {
      name,
      phone,
      email,
      address,
      category,
      agent_id,
      notes,
    })

    console.log("更新會員成功:", result[0])
    return { success: true, member: result[0] }
  } catch (error) {
    console.error("更新會員錯誤:", error)
    return {
      success: false,
      error: error.message,
      details: error.stack,
    }
  }
}

// 記錄交易 Server Action
export async function recordTransaction(formData) {
  const member_id = formData.get("member_id") || null
  const amount = Number.parseFloat(formData.get("amount"))
  const type = formData.get("type")
  const description = formData.get("description") || ""

  console.log("Server Action: 記錄交易", {
    member_id,
    amount,
    type,
    description,
  })

  try {
    const result = await createTransaction({
      member_id,
      amount,
      type,
      description,
    })

    console.log("記錄交易成功:", result[0])
    return { success: true, transaction: result[0] }
  } catch (error) {
    console.error("記錄交易錯誤:", error)
    return {
      success: false,
      error: error.message,
      details: error.stack,
    }
  }
}

// 分紅 Server Action
export async function createDividendAction(formData) {
  const total_profit = Number.parseFloat(formData.get("total_profit"))
  const total_shares = Number.parseInt(formData.get("total_shares"))
  const dividend_per_share = Number.parseFloat(formData.get("dividend_per_share"))
  const is_loss = total_profit < 0
  const date = new Date(formData.get("date"))

  console.log("Server Action: 創建分紅", {
    total_profit,
    total_shares,
    dividend_per_share,
    is_loss,
    date,
  })

  try {
    const result = await createDividend({
      total_profit,
      total_shares,
      dividend_per_share,
      is_loss,
      date,
    })

    console.log("創建分紅成功:", result)
    return { success: true, dividend: result }
  } catch (error) {
    console.error("創建分紅錯誤:", error)
    return {
      success: false,
      error: error.message,
      details: error.stack,
    }
  }
}

