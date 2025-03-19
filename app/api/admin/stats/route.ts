import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    // 獲取會員總數
    const membersResult = await pool.sql`SELECT COUNT(*) as count FROM members`
    const totalMembers = Number.parseInt(membersResult.rows[0]?.count || "0")

    // 獲取交易總數
    const transactionsResult = await pool.sql`SELECT COUNT(*) as count FROM transactions`
    const totalTransactions = Number.parseInt(transactionsResult.rows[0]?.count || "0")

    // 獲取分紅總數
    const dividendsResult = await pool.sql`SELECT COUNT(*) as count FROM dividends`
    const totalDividends = Number.parseInt(dividendsResult.rows[0]?.count || "0")

    // 獲取代理總數
    const agentsResult = await pool.sql`SELECT COUNT(*) as count FROM agents`
    const totalAgents = Number.parseInt(agentsResult.rows[0]?.count || "0")

    return NextResponse.json({
      totalMembers,
      totalTransactions,
      totalDividends,
      totalAgents,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)

    // 如果表不存在，返回所有計數為0
    if (error instanceof Error && error.message.includes("does not exist")) {
      return NextResponse.json({
        totalMembers: 0,
        totalTransactions: 0,
        totalDividends: 0,
        totalAgents: 0,
      })
    }

    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}

