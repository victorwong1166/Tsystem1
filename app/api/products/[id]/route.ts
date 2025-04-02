import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "产品不存在" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("获取产品详情失败:", error)
    return NextResponse.json(
      { error: "获取产品详情失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // 检查权限
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id
    const data = await request.json()

    // 更新产品
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: Number.parseFloat(data.price),
        stock: Number.parseInt(data.stock || "0"),
        image: data.image,
        categoryId: data.categoryId,
        isActive: data.isActive,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("更新产品失败:", error)
    return NextResponse.json(
      { error: "更新产品失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // 检查权限
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id

    // 删除产品
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "产品已删除" })
  } catch (error) {
    console.error("删除产品失败:", error)
    return NextResponse.json(
      { error: "删除产品失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

