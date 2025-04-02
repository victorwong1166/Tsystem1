import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    // 移除敏感信息
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("获取用户资料失败:", error)
    return NextResponse.json(
      { error: "获取用户资料失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const data = await request.json()

    // 更新用户基本信息
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
      },
    })

    // 更新或创建用户资料
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        bio: data.bio,
      },
      create: {
        userId: session.user.id,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        bio: data.bio,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        password: undefined,
        profile,
      },
    })
  } catch (error) {
    console.error("更新用户资料失败:", error)
    return NextResponse.json(
      { error: "更新用户资料失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

