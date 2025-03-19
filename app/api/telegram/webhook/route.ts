import { NextResponse } from "next/server"
import { validateTelegramCallback } from "@/lib/telegram-service"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 驗證回調
    if (!validateTelegramCallback(data)) {
      return NextResponse.json({ success: false, message: "Invalid callback" }, { status: 403 })
    }

    // 處理不同類型的 Telegram 更新
    if (data.message) {
      // 處理消息
      await handleTelegramMessage(data.message)
    } else if (data.callback_query) {
      // 處理回調查詢
      await handleTelegramCallbackQuery(data.callback_query)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("處理 Telegram webhook 時出錯:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// 處理 Telegram 消息
async function handleTelegramMessage(message: any) {
  const chatId = message.chat.id
  const text = message.text

  // 處理綁定碼
  if (text && text.match(/^TS\d{5}$/)) {
    // 這裡處理綁定邏輯
    console.log(`處理綁定碼: ${text}, 來自 Chat ID: ${chatId}`)

    // 實際應用中，這裡會將綁定碼與用戶關聯
    // 並發送確認消息
  } else {
    // 處理其他命令或消息
    console.log(`收到消息: ${text}, 來自 Chat ID: ${chatId}`)
  }
}

// 處理 Telegram 回調查詢
async function handleTelegramCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id
  const data = callbackQuery.data

  console.log(`處理回調查詢: ${data}, 來自 Chat ID: ${chatId}`)

  // 實際應用中，這裡會根據回調數據執行相應操作
}

