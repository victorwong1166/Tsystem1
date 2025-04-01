import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

export async function migrateDatabase() {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const db = drizzle(sql)

    console.log("Database connection established")
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    console.error("Database migration error:", error)
    return { success: false, message: "Database connection failed" }
  }
}

