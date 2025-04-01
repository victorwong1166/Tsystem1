import { sql } from "@vercel/postgres"

export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT NOW()`
    return { success: true, timestamp: result.rows[0].now }
  } catch (error) {
    console.error("Database test error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

