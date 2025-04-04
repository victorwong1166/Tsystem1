import { NextResponse } from "next/server"
import webpush from "web-push"

// 在實際應用中，這些值應該從環境變量中獲取
const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTWJkgO0"
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@example.com"

// 設置 VAPID 詳細信息
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subscription, title, message, url } = body

    if (!subscription) {
      return NextResponse.json({ success: false, error: "No subscription provided" }, { status: 400 })
    }

    // 創建通知負載
    const payload = JSON.stringify({
      title: title || "交易系統通知",
      body: message || "您有一條新消息",
      url: url || "/",
    })

    // 發送推送通知
    await webpush.sendNotification(subscription, payload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending push notification:", error)
    return NextResponse.json({ success: false, error: "Failed to send push notification" }, { status: 500 })
  }
}

