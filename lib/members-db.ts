import { pool } from "./db"

export interface Member {
  id: number
  name: string
  phone?: string
  email?: string
  address?: string
  category?: string
  agent_id?: number
  notes?: string
  created_at?: string
  updated_at?: string
}

export async function getAllMembers(): Promise<Member[]> {
  try {
    const result = await pool.sql`
      SELECT * FROM members 
      ORDER BY name ASC
    `
    return result.rows
  } catch (error) {
    console.error("獲取會員列表失敗:", error)
    // 如果數據庫操作失敗，返回空數組
    return []
  }
}

export async function getMemberById(id: number): Promise<Member | null> {
  try {
    const result = await pool.sql`
      SELECT * FROM members 
      WHERE id = ${id}
    `

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error(`獲取會員 ID ${id} 失敗:`, error)
    return null
  }
}

export async function createMember(member: Omit<Member, "id" | "created_at" | "updated_at">): Promise<Member | null> {
  try {
    const { name, phone, email, address, category, agent_id, notes } = member

    const result = await pool.sql`
      INSERT INTO members (name, phone, email, address, category, agent_id, notes)
      VALUES (${name}, ${phone || null}, ${email || null}, ${address || null}, 
              ${category || "regular"}, ${agent_id || null}, ${notes || null})
      RETURNING *
    `

    return result.rows[0]
  } catch (error) {
    console.error("創建會員失敗:", error)
    return null
  }
}

export async function updateMember(id: number, member: Partial<Member>): Promise<Member | null> {
  try {
    // 構建動態更新查詢
    const updates = []
    const values = []
    let paramIndex = 1

    if (member.name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(member.name)
    }

    if (member.phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`)
      values.push(member.phone)
    }

    if (member.email !== undefined) {
      updates.push(`email = $${paramIndex++}`)
      values.push(member.email)
    }

    if (member.address !== undefined) {
      updates.push(`address = $${paramIndex++}`)
      values.push(member.address)
    }

    if (member.category !== undefined) {
      updates.push(`category = $${paramIndex++}`)
      values.push(member.category)
    }

    if (member.agent_id !== undefined) {
      updates.push(`agent_id = $${paramIndex++}`)
      values.push(member.agent_id)
    }

    if (member.notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`)
      values.push(member.notes)
    }

    // 添加更新時間
    updates.push(`updated_at = NOW()`)

    if (updates.length === 0) {
      return await getMemberById(id)
    }

    const updateQuery = `
      UPDATE members 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    values.push(id)

    const result = await pool.query(updateQuery, values)

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error(`更新會員 ID ${id} 失敗:`, error)
    return null
  }
}

export async function deleteMember(id: number): Promise<boolean> {
  try {
    const result = await pool.sql`
      DELETE FROM members 
      WHERE id = ${id}
      RETURNING id
    `

    return result.rows.length > 0
  } catch (error) {
    console.error(`刪除會員 ID ${id} 失敗:`, error)
    return false
  }
}

export async function searchMembers(query: string): Promise<Member[]> {
  try {
    const searchQuery = `%${query}%`

    const result = await pool.sql`
      SELECT * FROM members 
      WHERE 
        name ILIKE ${searchQuery} OR
        phone ILIKE ${searchQuery} OR
        email ILIKE ${searchQuery} OR
        address ILIKE ${searchQuery} OR
        notes ILIKE ${searchQuery}
      ORDER BY name ASC
    `

    return result.rows
  } catch (error) {
    console.error("搜索會員失敗:", error)
    return []
  }
}

