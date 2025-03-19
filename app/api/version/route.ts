import { NextResponse } from "next/server"

// 當前應用版本，每次部署時更新
const CURRENT_VERSION = "1.0.0"

export async function GET() {
  return NextResponse.json({ version: CURRENT_VERSION })
}

