import { NextResponse } from "next/server"
import { getAllMembers } from "@/lib/members"

export async function GET() {
  try {
    // 获取所有会员
    const members = await getAllMembers()
    return NextResponse.json(members)
  } catch (error) {
    console.error("获取会员列表失败:", error)

    // 返回友好的错误信息
    return NextResponse.json(
      {
        error: "获取会员列表失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // 验证必填字段
    if (!data.name) {
      return NextResponse.json({ error: "会员姓名为必填项" }, { status: 400 })
    }

    // 导入创建会员函数
    const { createMember } = await import("@/lib/members")

    // 创建新会员
    const newMember = await createMember(data)

    return NextResponse.json(newMember)
  } catch (error) {
    console.error("创建会员失败:", error)

    // 检查特定错误类型并返回友好的错误信息
    if (error.message && error.message.includes('relation "members" does not exist')) {
      return NextResponse.json({ error: "members 表不存在，请确保已正确设置数据库结构" }, { status: 500 })
    }

    return NextResponse.json(
      {
        error: "创建会员失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

