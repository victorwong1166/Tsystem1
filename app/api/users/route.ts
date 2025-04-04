import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET 请求处理程序 - 获取所有用户
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "获取用户时发生错误" }, { status: 500 })
  }
}

// POST 请求处理程序 - 创建新用户
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // 基本验证
    if (!name || !email || !password) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 })
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 })
    }

    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // 注意：实际应用中应该对密码进行哈希处理
      },
    })

    // 不返回密码
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "创建用户时发生错误" }, { status: 500 })
  }
}

