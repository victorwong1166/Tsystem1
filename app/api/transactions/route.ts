import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendPushNotification } from "@/lib/web-push"

// 获取所有交易
export async function GET() {
  try {
    // 这里应该使用您的实际数据模型
    // 这只是一个示例
    const transactions = await prisma.user.findMany()

    return NextResponse.json({ transactions }, { status: 200 })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "获取交易时发生错误" }, { status: 500 })
  }
}

// 创建新交易
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, amount, description, notifyUser } = body

    // 基本验证
    if (!userId || !amount) {
      return NextResponse.json({ error: "用户ID和金额是必填的" }, { status: 400 })
    }

    // 创建交易
    // 这里应该使用您的实际数据模型
    // 这只是一个示例
    const transaction = await prisma.user.update({
      where: { id: userId },
      data: { name: description || "Transaction" },
    })

    // 如果需要发送通知
    if (notifyUser && body.subscription) {
      await sendPushNotification(body.subscription, {
        title: "新交易",
        message: `交易金额: ${amount}`,
        timestamp: new Date().getTime(),
      })
    }

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "创建交易时发生错误" }, { status: 500 })
  }
}

