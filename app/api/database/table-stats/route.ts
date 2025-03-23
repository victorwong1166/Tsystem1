import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return mock data instead of actual database query
    return NextResponse.json({
      success: true,
      message: "Database connection not configured yet",
      data: {
        tables: [
          { name: "users", rows: 0 },
          { name: "posts", rows: 0 },
          { name: "comments", rows: 0 },
        ],
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}

