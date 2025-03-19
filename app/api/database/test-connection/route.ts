import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/lib/db-test"

export async function GET() {
  try {
    const result = await testDatabaseConnection()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Database connection test error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

