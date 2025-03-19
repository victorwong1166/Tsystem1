import type React from "react"
// lib/notifications.ts
import { toast } from "@/hooks/use-toast"

// 通知類型
export type NotificationType = "success" | "error" | "warning" | "info"

// 通知選項
export interface NotificationOptions {
  title?: string
  description: string
  type?: NotificationType
  duration?: number
  action?: React.ReactNode
}

// 顯示通知
export function showNotification(options: NotificationOptions) {
  // 根據類型設置變體
  const variant = options.type === "success" ? "default" : options.type === "error" ? "destructive" : undefined

  // 顯示 toast 通知
  toast({
    title: options.title,
    description: options.description,
    variant,
    duration: options.duration || 5000,
    action: options.action,
  })

  // 如果瀏覽器支持通知且用戶已授權，也顯示瀏覽器通知
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(options.title || "交易系統通知", {
        body: options.description,
        icon: "/icons/icon-192x192.png",
      })
    } catch (error) {
      console.error("顯示瀏覽器通知時出錯:", error)
    }
  }
}

// 交易成功通知
export function showTransactionSuccess(amount: number, type: string, memberName?: string) {
  const typeText = getTransactionTypeText(type)
  const description = memberName ? `已成功為 ${memberName} ${typeText} $${amount}` : `已成功${typeText} $${amount}`

  showNotification({
    title: "交易成功",
    description,
    type: "success",
  })
}

// 會員創建成功通知
export function showMemberCreationSuccess(name: string) {
  showNotification({
    title: "會員創建成功",
    description: `會員 ${name} 已成功創建`,
    type: "success",
  })
}

// 錯誤通知
export function showErrorNotification(error: Error | string) {
  const errorMessage = typeof error === "string" ? error : error.message || "發生未知錯誤"

  showNotification({
    title: "錯誤",
    description: errorMessage,
    type: "error",
  })
}

// 獲取交易類型的中文描述
function getTransactionTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    buy: "買碼",
    redeem: "兌碼",
    sign: "簽碼",
    return: "還碼",
    deposit: "存款",
    withdrawal: "取款",
    labor: "人工",
    misc: "雜費",
  }

  return typeMap[type] || type
}

