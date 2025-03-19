import { NextResponse } from "next/server"
import webpush from "web-push"

// 設置 VAPID 詳細信息 - 這裡使用 NEXT_PUBLIC_VAPID_PUBLIC_KEY 替代 VAPID_PUBLIC_KEY
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:example@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "", // 使用 NEXT_PUBLIC_ 前綴的變量
  process.env.VAPID_PRIVATE_KEY || "",
)

// 這裡您可以使用數據庫來存儲訂閱信息
// 這個例子使用內存存儲，實際應用中應該使用數據庫
const subscriptions: PushSubscription[] = []

export async function POST(request: Request) {
  try {
    const subscription = await request.json()

    // 存儲訂閱信息
    // 在實際應用中，您應該將其保存到數據庫中
    // 例如：await db.subscriptions.create({ data: subscription });
    subscriptions.push(subscription)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving subscription:", error)
    return NextResponse.json({ success: false, error: "Failed to save subscription" }, { status: 500 })
  }
}

