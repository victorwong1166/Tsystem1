import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 获取所有分类
export async function GET(request: Request) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    // 构建查询条件
    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {}

    // 查询分类
    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("获取分类列表错误:", error)
    return NextResponse.json({ error: "获取分类列表失败" }, { status: 500 })
  }
}

// 创建分类
export async function POST(request: Request) {
  try {
    // 检查权限
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const body = await request.json()
    const { name } = body

    // 验证必填字段
    if (!name) {
      return NextResponse.json({ error: "名称是必填字段" }, { status: 400 })
    }

    // 检查分类是否已存在
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "该分类名称已存在" }, { status: 409 })
    }

    // 创建分类
    const newCategory = await prisma.category.create({
      data: { name },
    })

    return NextResponse.json({ message: "分类创建成功", category: newCategory }, { status: 201 })
  } catch (error) {
    console.error("创建分类错误:", error)
    return NextResponse.json({ error: "创建分类失败" }, { status: 500 })
  }
}

