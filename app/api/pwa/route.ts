import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    version: "1.0.0",
    features: ["離線支持", "主屏幕安裝", "推送通知"],
  })
}

