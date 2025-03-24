import { type NextRequest, NextResponse } from "next/server"
import { getMemberById, updateMember, deleteMember } from "@/lib/members-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "無效的會員ID",
        },
        { status: 400 },
      )
    }

    const member = await getMemberById(id)

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: "找不到該會員",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error) {
    console.error(`獲取會員失敗:`, error)
    return NextResponse.json(
      {
        success: false,
        error: "獲取會員失敗",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "無效的會員ID",
        },
        { status: 400 },
      )
    }

    const body = await request.json()

    // 基本驗證
    if (body.name === "") {
      return NextResponse.json(
        {
          success: false,
          error: "會員姓名不能為空",
        },
        { status: 400 },
      )
    }

    const updatedMember = await updateMember(id, body)

    if (!updatedMember) {
      return NextResponse.json(
        {
          success: false,
          error: "更新會員失敗",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedMember,
    })
  } catch (error) {
    console.error(`更新會員失敗:`, error)
    return NextResponse.json(
      {
        success: false,
        error: "更新會員失敗",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "無效的會員ID",
        },
        { status: 400 },
      )
    }

    const success = await deleteMember(id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "刪除會員失敗",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "會員已成功刪除",
    })
  } catch (error) {
    console.error(`刪除會員失敗:`, error)
    return NextResponse.json(
      {
        success: false,
        error: "刪除會員失敗",
      },
      { status: 500 },
    )
  }
}

