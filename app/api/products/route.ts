import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany()
    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error("获取产品失败:", error)
    return NextResponse.json({ success: false, error: "获取产品失败" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 基本验证
    if (!data.name || typeof data.price !== "number") {
      return NextResponse.json({ success: false, error: "名称和价格是必填项" }, { status: 400 })
    }

    // 创建产品
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || "",
        price: data.price,
        stock: data.stock || 0,
        imageUrl: data.imageUrl || "/placeholder.svg?height=200&width=200",
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error("创建产品失败:", error)
    return NextResponse.json({ success: false, error: "创建产品失败" }, { status: 500 })
  }
}

