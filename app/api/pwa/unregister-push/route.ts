import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subscription, userId } = body

    // 這裡應該從數據庫中刪除訂閱信息
    console.log("Unregistering push subscription for user:", userId)

    // 模擬從數據庫刪除
    // await db.pushSubscriptions.delete({ userId });

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unregistering push subscription:", error)
    return NextResponse.json({ success: false, error: "Failed to unregister push subscription" }, { status: 500 })
  }
}

