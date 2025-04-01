import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET 请求处理程序 - 获取单个用户
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "获取用户时发生错误" }, { status: 500 })
  }
}

// PATCH 请求处理程序 - 更新用户
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { name, email } = body

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "更新用户时发生错误" }, { status: 500 })
  }
}

// DELETE 请求处理程序 - 删除用户
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    // 删除用户
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: "用户已成功删除" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "删除用户时发生错误" }, { status: 500 })
  }
}

