import { NextResponse } from "next/server"
import * as pointsService from "@/lib/points"

export async function GET() {
  try {
    const result = await pointsService.getAllPointTypes()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Point types API error:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, exchangeRate } = await request.json()

    if (!name || !exchangeRate) {
      return NextResponse.json({ success: false, error: "名稱和兌換率為必填項" }, { status: 400 })
    }

    const result = await pointsService.createPointType(name, description, exchangeRate)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Create point type API error:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, description, exchangeRate, isActive } = await request.json()

    if (!id) {
      return NextResponse.json({ success: false, error: "ID為必填項" }, { status: 400 })
    }

    const result = await pointsService.updatePointType(id, { name, description, exchangeRate, isActive })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Update point type API error:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID為必填項" }, { status: 400 })
    }

    const result = await pointsService.deletePointType(Number.parseInt(id))
    return NextResponse.json(result)
  } catch (error) {
    console.error("Delete point type API error:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

