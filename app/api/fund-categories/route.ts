import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

// 获取所有资金类别
export async function GET() {
  try {
    const result = await pool.sql`
      SELECT * FROM fund_categories ORDER BY name
    `

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("获取资金类别错误:", error)

    // 如果表不存在，返回空数组
    if (error instanceof Error && error.message.includes("does not exist")) {
      return NextResponse.json({ success: true, data: [] })
    }

    return NextResponse.json(
      { success: false, error: "获取资金类别错误: " + (error as Error).message },
      { status: 500 },
    )
  }
}

// 添加或更新资金类别
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, name, description } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "类别名称不能为空" }, { status: 400 })
    }

    let result

    // 如果提供了ID，则更新现有类别
    if (id) {
      result = await pool.sql`
        UPDATE fund_categories 
        SET name = ${name}, description = ${description || null}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
    } else {
      // 否则创建新类别
      result = await pool.sql`
        INSERT INTO fund_categories (name, description)
        VALUES (${name}, ${description || null})
        RETURNING *
      `
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error("添加/更新资金类别错误:", error)
    return NextResponse.json(
      { success: false, error: "添加/更新资金类别错误: " + (error as Error).message },
      { status: 500 },
    )
  }
}

// 删除资金类别
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "缺少类别ID" }, { status: 400 })
    }

    // 检查该类别是否被使用
    const usageCheck = await pool.sql`
      SELECT COUNT(*) as count FROM funds WHERE category_id = ${id}
    `

    if (Number.parseInt(usageCheck.rows[0].count) > 0) {
      return NextResponse.json({ success: false, error: "该类别正在被使用，无法删除" }, { status: 400 })
    }

    // 删除类别
    await pool.sql`DELETE FROM fund_categories WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除资金类别错误:", error)
    return NextResponse.json(
      { success: false, error: "删除资金类别错误: " + (error as Error).message },
      { status: 500 },
    )
  }
}

