import webpush from "web-push"

// VAPID 密钥应该从环境变量中获取
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || ""

// 设置 VAPID 详情
webpush.setVapidDetails(
  "mailto:example@example.com", // 应该是您的联系邮箱
  vapidPublicKey,
  vapidPrivateKey,
)

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export async function sendPushNotification(subscription: PushSubscription, payload: string | object) {
  try {
    const stringPayload = typeof payload === "string" ? payload : JSON.stringify(payload)

    await webpush.sendNotification(subscription as any, stringPayload)

    return { success: true }
  } catch (error) {
    console.error("Error sending push notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export { webpush }

