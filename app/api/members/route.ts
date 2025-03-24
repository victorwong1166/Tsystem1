import { type NextRequest, NextResponse } from "next/server"
import { getAllMembers, createMember, searchMembers } from "@/lib/members-db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    let members
    if (query) {
      members = await searchMembers(query)
    } else {
      members = await getAllMembers()
    }

    return NextResponse.json({
      success: true,
      data: members,
    })
  } catch (error) {
    console.error("獲取會員列表失敗:", error)
    return NextResponse.json(
      {
        success: false,
        error: "獲取會員列表失敗",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 基本驗證
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: "會員姓名為必填項",
        },
        { status: 400 },
      )
    }

    const newMember = await createMember(body)

    if (!newMember) {
      return NextResponse.json(
        {
          success: false,
          error: "創建會員失敗",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: newMember,
    })
  } catch (error) {
    console.error("創建會員失敗:", error)
    return NextResponse.json(
      {
        success: false,
        error: "創建會員失敗",
      },
      { status: 500 },
    )
  }
}

