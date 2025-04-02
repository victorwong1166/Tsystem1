import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      isActive: true,
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // 查询产品
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    // 获取总数
    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("获取产品列表失败:", error)
    return NextResponse.json(
      { error: "获取产品列表失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // 检查权限
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const data = await request.json()

    // 验证输入
    if (!data.name || !data.price) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 })
    }

    // 创建产品
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number.parseFloat(data.price),
        stock: Number.parseInt(data.stock || "0"),
        image: data.image,
        categoryId: data.categoryId,
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error("创建产品失败:", error)
    return NextResponse.json(
      { error: "创建产品失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

