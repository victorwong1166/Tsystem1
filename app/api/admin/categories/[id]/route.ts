import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 获取单个分类
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 获取分类详情
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            post: {
              select: {
                id: true,
                title: true,
                published: true,
                createdAt: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          take: 10,
          orderBy: { assignedAt: "desc" },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    // 格式化结果
    const formattedCategory = {
      ...category,
      posts: category.posts.map((p) => p.post),
    }

    return NextResponse.json({ category: formattedCategory })
  } catch (error) {
    console.error("获取分类详情错误:", error)
    return NextResponse.json({ error: "获取分类详情失败" }, { status: 500 })
  }
}

// 更新分类
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // 检查权限
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id
    const body = await request.json()
    const { name } = body

    // 验证必填字段
    if (!name) {
      return NextResponse.json({ error: "名称是必填字段" }, { status: 400 })
    }

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    // 检查新名称是否已被使用
    if (name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name },
      })

      if (nameExists) {
        return NextResponse.json({ error: "该分类名称已存在" }, { status: 409 })
      }
    }

    // 更新分类
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    })

    return NextResponse.json({
      message: "分类更新成功",
      category: updatedCategory,
    })
  } catch (error) {
    console.error("更新分类错误:", error)
    return NextResponse.json({ error: "更新分类失败" }, { status: 500 })
  }
}

// 删除分类
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // 检查权限
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    // 检查是否有关联的文章
    if (existingCategory._count.posts > 0) {
      return NextResponse.json({ error: "无法删除有关联文章的分类，请先移除关联" }, { status: 400 })
    }

    // 删除分类
    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "分类删除成功",
    })
  } catch (error) {
    console.error("删除分类错误:", error)
    return NextResponse.json({ error: "删除分类失败" }, { status: 500 })
  }
}

