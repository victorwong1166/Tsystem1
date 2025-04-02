import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("获取用户失败:", error)
    return NextResponse.json({ success: false, error: "获取用户失败" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 基本验证
    if (!data.name || !data.email) {
      return NextResponse.json({ success: false, error: "名称和邮箱是必填项" }, { status: 400 })
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role || "USER",
        // 如果有密码，应该先进行哈希处理
      },
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error("创建用户失败:", error)
    return NextResponse.json({ success: false, error: "创建用户失败" }, { status: 500 })
  }
}

