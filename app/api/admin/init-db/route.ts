import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function POST(request: Request) {
  try {
    const { table } = await request.json()

    if (table === "members" || table === "all") {
      await sql`
        CREATE TABLE IF NOT EXISTS members (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    }

    if (table === "transactions" || table === "all") {
      await sql`
        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          member_id INTEGER REFERENCES members(id),
          amount DECIMAL(15, 2) NOT NULL,
          type VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    }

    if (table === "funds" || table === "all") {
      await sql`
        CREATE TABLE IF NOT EXISTS funds (
          id SERIAL PRIMARY KEY,
          member_id INTEGER REFERENCES members(id),
          balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
          available_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
          frozen_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
          currency VARCHAR(10) NOT NULL DEFAULT 'CNY',
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    }

    return NextResponse.json({
      success: true,
      message: table === "all" ? "所有數據表初始化成功" : `${table}數據表初始化成功`,
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      { success: false, error: "數據庫初始化失敗: " + (error as Error).message },
      { status: 500 },
    )
  }
}

