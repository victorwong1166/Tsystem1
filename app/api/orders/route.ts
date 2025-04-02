import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/db"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    // 如果不是管理员，只能查看自己的订单
    if (session.user.role !== "ADMIN") {
      where.userId = session.user.id
    }

    // 查询订单
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
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
    const total = await prisma.order.count({ where })

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("获取订单列表失败:", error)
    return NextResponse.json(
      { error: "获取订单列表失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const data = await request.json()

    // 验证输入
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ error: "订单项不能为空" }, { status: 400 })
    }

    // 计算订单总金额并验证库存
    let total = 0
    const orderItems = []

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json({ error: `产品 ${item.productId} 不存在` }, { status: 400 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `产品 ${product.name} 库存不足` }, { status: 400 })
      }

      total += product.price * item.quantity
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })

      // 更新库存
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: product.stock - item.quantity },
      })
    }

    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error("创建订单失败:", error)
    return NextResponse.json(
      { error: "创建订单失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

