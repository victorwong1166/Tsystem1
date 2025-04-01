import { NextResponse } from "next/server"
import { sendPushNotification } from "@/lib/web-push"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subscription, payload } = body

    if (!subscription || !payload) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const result = await sendPushNotification(subscription, payload)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "发送通知失败" }, { status: 500 })
    }

    return NextResponse.json({ message: "通知已发送" }, { status: 200 })
  } catch (error) {
    console.error("Error in push notification API:", error)
    return NextResponse.json({ error: "处理请求时发生错误" }, { status: 500 })
  }
}

