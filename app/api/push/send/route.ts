import { NextResponse } from "next/server"
import webpush from "web-push"

// 設置 VAPID 詳細信息
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:example@example.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
)

// 在實際應用中，您應該從數據庫中獲取訂閱信息
// 這個例子假設您有一個獲取訂閱的函數
async function getSubscriptions() {
  // 實際應用中，從數據庫獲取
  // 例如：return await db.subscriptions.findMany();
  return [] // 替換為實際的訂閱數據
}

export async function POST(request: Request) {
  try {
    const { title, body, data } = await request.json()

    // 獲取所有訂閱
    const subscriptions = await getSubscriptions()

    // 發送通知到所有訂閱
    const notifications = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title,
            body,
            data,
          }),
        )
        return { success: true, subscription }
      } catch (error) {
        console.error("Error sending notification:", error)
        // 如果發送失敗，可能是訂閱已過期
        // 在實際應用中，您可能想要從數據庫中刪除此訂閱
        return { success: false, subscription, error }
      }
    })

    const results = await Promise.all(notifications)

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error sending notifications:", error)
    return NextResponse.json({ success: false, error: "Failed to send notifications" }, { status: 500 })
  }
}

