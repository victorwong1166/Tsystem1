import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 })
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "邮箱已被注册" }, { status: 409 })
    }

    // 密码加密
    const hashedPassword = await hash(password, 12)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    })

    // 创建用户资料
    await prisma.profile.create({
      data: {
        userId: user.id,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "注册成功",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("注册失败:", error)
    return NextResponse.json(
      { error: "注册失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

