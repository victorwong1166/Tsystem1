import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 获取单个用户
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // 检查管理员权限
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id

    // 获取用户详情
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            post: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            type: true,
            status: true,
            createdAt: true,
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            posts: true,
            comments: true,
            transactions: true,
            notifications: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("获取用户详情错误:", error)
    return NextResponse.json({ error: "获取用户详情失败" }, { status: 500 })
  }
}

// 更新用户
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // 检查管理员权限
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id
    const body = await request.json()
    const { name, email, role, bio, avatar } = body

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    // 如果更改邮箱，检查新邮箱是否已被使用
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json({ error: "该邮箱已被其他用户使用" }, { status: 409 })
      }
    }

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatar: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: "用户更新成功",
      user: updatedUser,
    })
  } catch (error) {
    console.error("更新用户错误:", error)
    return NextResponse.json({ error: "更新用户失败" }, { status: 500 })
  }
}

// 删除用户
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // 检查管理员权限
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    // 防止删除自己
    if (session.user.id === id) {
      return NextResponse.json({ error: "不能删除当前登录的用户" }, { status: 400 })
    }

    // 删除用户
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "用户删除成功",
    })
  } catch (error) {
    console.error("删除用户错误:", error)
    return NextResponse.json({ error: "删除用户失败" }, { status: 500 })
  }
}

