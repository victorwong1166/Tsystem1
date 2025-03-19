import { NextResponse } from "next/server"

// 在實際應用中，您應該從數據庫中刪除訂閱
// 這個例子使用內存存儲，實際應用中應該使用數據庫
let subscriptions: PushSubscription[] = []

export async function POST(request: Request) {
  try {
    const { endpoint } = await request.json()

    // 在實���應用中，從數據庫中刪除訂閱
    // 例如：await db.subscriptions.delete({ where: { endpoint } });

    // 這裡使用內存模擬
    subscriptions = subscriptions.filter((sub) => sub.endpoint !== endpoint)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unsubscribing:", error)
    return NextResponse.json({ success: false, error: "Failed to unsubscribe" }, { status: 500 })
  }
}

