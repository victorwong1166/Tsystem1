import { NextResponse } from "next/server"

// 在實際應用中，這裡應該將訂閱信息保存到數據庫
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subscription, userId } = body

    // 這裡應該將訂閱信息保存到數據庫
    console.log("Received push subscription:", subscription)
    console.log("User ID:", userId)

    // 模擬保存到數據庫
    // await db.pushSubscriptions.insert({ subscription, userId });

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error registering push subscription:", error)
    return NextResponse.json({ success: false, error: "Failed to register push subscription" }, { status: 500 })
  }
}

