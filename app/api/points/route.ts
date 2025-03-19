import { NextResponse } from "next/server"
import * as pointsService from "@/lib/points"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get("memberId")

    if (memberId) {
      const result = await pointsService.getMemberPoints(Number.parseInt(memberId))
      return NextResponse.json(result)
    } else {
      const result = await pointsService.getAllPointTypes()
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error("Points API error:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, memberId, pointTypeId, amount, description, referenceId, expiresAt } = body

    let result

    if (action === "add") {
      result = await pointsService.addPoints(
        memberId,
        pointTypeId,
        amount,
        description,
        referenceId,
        expiresAt ? new Date(expiresAt) : undefined,
      )
    } else if (action === "use") {
      result = await pointsService.usePoints(memberId, pointTypeId, amount, description, referenceId)
    } else if (action === "redeem") {
      const { ruleId } = body
      result = await pointsService.redeemPoints(memberId, ruleId, description)
    } else {
      return NextResponse.json({ success: false, error: "無效的操作" }, { status: 400 })
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error("Points API error:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

