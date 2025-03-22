import { NextResponse } from "next/server"
import webpush from "web-push"

// 設置 VAPID 詳細信息
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:victorywong3379@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
)

// 獲取所有訂閱
async function getSubscriptions() {
  // 實際應用中，從數據庫獲取
  // 例如：return await db.subscriptions.findMany();
  return [] // 替換為實際的訂閱數據
}

// GET 方法 - 獲取交易數據
export async function GET() {
  try {
    // 返回交易数据
    return NextResponse.json({
      success: true,
      data: {
        transactions: [
          { id: 1, amount: 100, date: new Date().toISOString(), status: "completed" },
          { id: 2, amount: 50, date: new Date().toISOString(), status: "pending" }
        ]
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "發生錯誤" },
      { status: 500 }
    );
  }
}

// POST 方法 - 處理交易並發送通知
export async function POST(request: Request) {
  try {
    const transactionData = await request.json()
    
    // 處理交易邏輯
    // 這裡添加您的交易處理代碼
    console.log("處理交易:", transactionData)
    
    // 獲取所有訂閱並發送通知
    const subscriptions = await getSubscriptions()
    
    // 如果有訂閱，發送推送通知
    if (subscriptions.length > 0) {
      try {
        // 檢查是否設置了 VAPID 密鑰
        if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
          const notificationPayload = JSON.stringify({
            title: "新交易",
            body: `交易金額: ${transactionData.amount || 0}`,
            icon: "/icon.png",
            data: {
              url: "/transactions"
            }
          })
          
          // 向所有訂閱發送通知
          const notificationPromises = subscriptions.map(subscription => 
            webpush.sendNotification(subscription, notificationPayload)
          )
          
          await Promise.allSettled(notificationPromises)
        }
      } catch (notificationError) {
        console.error("發送通知時出錯:", notificationError)
        // 繼續執行，即使通知發送失敗
      }
    }
    
    // 返回成功響應
    return NextResponse.json({
      success: true,
      message: "交易已處理",
      data: { 
        transactionId: Math.floor(Math.random() * 1000),
        notificationSent: subscriptions.length > 0
      }
    });
  } catch (error) {
    console.error("交易處理錯誤:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "處理交易時發生錯誤" 
      },
      { status: 500 }
    );
  }
}
