import { NextResponse } from "next/server"
import * as pointsService from "@/lib/points"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get("memberId")

    if (!memberId) {
      return NextResponse.json({ success: false, error: "會員ID為必填項" }, { status: 400 })
    }

    const result = await pointsService.getMemberPointTransactions(Number.parseInt(memberId))
    return NextResponse.json(result)
  } catch (error) {
    console.error("Point transactions API error:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

