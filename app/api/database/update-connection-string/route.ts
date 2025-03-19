import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const { connectionString } = await request.json()

    if (!connectionString) {
      return NextResponse.json({ success: false, error: "Connection string is required" }, { status: 400 })
    }

    // Validate the connection string format
    if (!connectionString.startsWith("postgresql://") || !connectionString.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid connection string format. Expected: postgresql://username:password@host:port/database",
        },
        { status: 400 },
      )
    }

    // In production, we can't write to .env.local, so we'll just return success
    // and instruct the user to set the environment variable in Vercel dashboard
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({
        success: true,
        message: "In production, please set the DATABASE_URL environment variable in your Vercel dashboard.",
      })
    }

    // In development, update the .env.local file
    const envPath = path.join(process.cwd(), ".env.local")
    let envContent = ""

    try {
      // Try to read existing .env.local file
      envContent = fs.readFileSync(envPath, "utf8")
    } catch (error) {
      // File doesn't exist, create it
      envContent = ""
    }

    // Check if DATABASE_URL already exists in the file
    const envLines = envContent.split("\n")
    let updated = false

    for (let i = 0; i < envLines.length; i++) {
      if (envLines[i].startsWith("DATABASE_URL=")) {
        envLines[i] = `DATABASE_URL="${connectionString}"`
        updated = true
        break
      }
    }

    // If DATABASE_URL doesn't exist, add it
    if (!updated) {
      envLines.push(`DATABASE_URL="${connectionString}"`)
    }

    // Write the updated content back to .env.local
    fs.writeFileSync(envPath, envLines.join("\n"))

    return NextResponse.json({
      success: true,
      message: "Connection string saved successfully. Please restart your development server.",
    })
  } catch (error: any) {
    console.error("Error updating connection string:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred while updating the connection string",
      },
      { status: 500 },
    )
  }
}

