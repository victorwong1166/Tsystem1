import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("获取订单失败:", error)
    return NextResponse.json({ success: false, error: "获取订单失败" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "未授权" }, { status: 401 })
    }

    const data = await request.json()

    // 基本验证
    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ success: false, error: "订单必须包含至少一个商品" }, { status: 400 })
    }

    // 计算总金额并验证商品
    let totalAmount = 0
    const orderItems = []

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json({ success: false, error: `商品 ${item.productId} 不存在` }, { status: 400 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ success: false, error: `商品 ${product.name} 库存不足` }, { status: 400 })
      }

      totalAmount += product.price * item.quantity

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })
    }

    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: "PENDING",
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // 更新商品库存
    for (const item of order.orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error("创建订单失败:", error)
    return NextResponse.json({ success: false, error: "创建订单失败" }, { status: 500 })
  }
}

