import { NextResponse } from "next/server"
import * as pointsService from "@/lib/points"

export async function GET() {
  try {
    const result = await pointsService.getAllRedemptionRules()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Redemption rules API error:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, pointsRequired, rewardType, rewardValue, startDate, endDate } = await request.json()

    if (!name || !pointsRequired || !rewardType || !rewardValue) {
      return NextResponse.json({ success: false, error: "名稱、所需積分、獎勵類型和獎勵值為必填項" }, { status: 400 })
    }

    const result = await pointsService.createRedemptionRule(
      name,
      description,
      pointsRequired,
      rewardType,
      rewardValue,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Create redemption rule API error:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

