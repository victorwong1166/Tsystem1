// 在交易 API 中添加發送通知的功能
import { NextResponse } from "next/server"
import webpush from "web-push"

// 設置 VAPID 詳細信息
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:victorywong3379@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
)

// 添加您的API路由处理程序
export async function GET() {
  // 您的代码...
}

export async function POST(request) {
  // 您的代码...
}

// 獲取所有訂閱
async function getSubscriptions() {
  // 實際應用中，從數據庫獲取
  // 例如：return await db.subscriptions.findMany();
  return [] // 替換為實際的訂閱數據
}

export async function POST(request: Request) {
  try {
    const transactionData = await request.json()

    // 處理交易數據...

    // 發送推送通知
    const subscriptions = await getSubscriptions()

    // 準備通知內容
    const notificationPayload = JSON.stringify({
      title: "新交易記錄",
      body: `交易金額: $${transactionData.amount}`,
      icon: "/icon.png",
      data: {
        url: "/transactions",
      },
    })

    // 向所有訂閱者發送通知
    const notificationPromises = subscriptions.map((subscription) =>
      webpush
        .sendNotification(subscription, notificationPayload)
        .catch((error) => console.error("Error sending notification to subscription:", error)),
    )

    // 不等待通知發送完成，立即返回響應
    Promise.all(notificationPromises)
      .then(() => console.log("All notifications sent"))
      .catch((error) => console.error("Error sending notifications:", error))

    return NextResponse.json({ success: true, transaction: transactionData })
  } catch (error) {
    console.error("Error processing transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to process transaction" }, { status: 500 })
  }
}

