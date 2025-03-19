import { NextResponse } from "next/server"
import webpush from "web-push"

// 設置 VAPID 詳細信息
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:example@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
)

export async function POST(request: Request) {
  try {
    const { subscription } = await request.json()

    // 發送測試通知
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "測試通知",
        body: "您的推送通知設置成功！",
        icon: "/icon.png",
        data: {
          url: "/dashboard",
        },
      }),
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending test notification:", error)
    return NextResponse.json({ success: false, error: "Failed to send test notification" }, { status: 500 })
  }
}

