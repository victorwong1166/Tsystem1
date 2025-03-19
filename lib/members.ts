import { pool } from "@/lib/db"

export async function createMember({
  name,
  phone = "",
  email = "",
  address = "",
  category = "regular",
  agent_id = null,
  notes = "",
}) {
  console.log("創建會員，數據:", { name, phone, email, address, category, agent_id, notes })

  try {
    // 檢查必填字段
    if (!name) {
      throw new Error("會員姓名為必填項")
    }

    // 執行數據庫插入操作
    const result = await pool.sql`
      INSERT INTO members (
        name, 
        phone, 
        email, 
        address, 
        category, 
        agent_id, 
        notes,
        created_at,
        updated_at
      )
      VALUES (
        ${name}, 
        ${phone}, 
        ${email}, 
        ${address}, 
        ${category}, 
        ${agent_id === "" ? null : agent_id}, 
        ${notes},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    console.log("會員創建成功:", result.rows[0])
    return result.rows
  } catch (error) {
    console.error("創建會員錯誤:", error)

    // 檢查是否是數據庫連接錯誤
    if (error.message && error.message.includes("connect")) {
      throw new Error("無法連接到數據庫，請檢查數據庫連接設置")
    }

    // 檢查是否是表不存在錯誤
    if (error.message && error.message.includes('relation "members" does not exist')) {
      throw new Error("members 表不存在，請確保已正確設置數據庫結構")
    }

    // 其他錯誤
    throw error
  }
}

export async function updateMember(
  id,
  { name, phone = "", email = "", address = "", category = "regular", agent_id = null, notes = "" },
) {
  console.log("更新會員，ID:", id, "數據:", { name, phone, email, address, category, agent_id, notes })

  try {
    // 檢查必填字段
    if (!id) {
      throw new Error("會員ID為必填項")
    }

    if (!name) {
      throw new Error("會員姓名為必填項")
    }

    // 執行數據庫更新操作
    const result = await pool.sql`
      UPDATE members
      SET 
        name = ${name},
        phone = ${phone},
        email = ${email},
        address = ${address},
        category = ${category},
        agent_id = ${agent_id === "" ? null : agent_id},
        notes = ${notes},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    console.log("會員更新成功:", result.rows[0])
    return result.rows
  } catch (error) {
    console.error("更新會員錯誤:", error)
    throw error
  }
}

export async function getAllMembers() {
  try {
    const result = await pool.sql`
      SELECT * FROM members
      ORDER BY created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error("獲取所有會員錯誤:", error)
    throw error
  }
}

export async function getMemberById(id) {
  try {
    const result = await pool.sql`
      SELECT * FROM members
      WHERE id = ${id}
    `
    return result.rows[0]
  } catch (error) {
    console.error("通過ID獲取會員錯誤:", error)
    throw error
  }
}

export async function getMembersByCategory(category) {
  try {
    const result = await pool.sql`
      SELECT * FROM members
      WHERE category = ${category}
      ORDER BY created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error("通過類別獲取會員錯誤:", error)
    throw error
  }
}

export async function searchMembers(searchTerm) {
  try {
    const result = await pool.sql`
      SELECT * FROM members
      WHERE 
        name ILIKE ${`%${searchTerm}%`} OR
        phone ILIKE ${`%${searchTerm}%`} OR
        email ILIKE ${`%${searchTerm}%`} OR
        address ILIKE ${`%${searchTerm}%`} OR
        notes ILIKE ${`%${searchTerm}%`}
      ORDER BY created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error("搜索會員錯誤:", error)
    throw error
  }
}

