"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

interface TelegramNotificationPreviewProps {
  type: "transaction" | "dividend" | "system" | "alert"
  data: any
}

export default function TelegramNotificationPreview({ type, data }: TelegramNotificationPreviewProps) {
  // 根據不同類型生成不同的預覽內容
  const renderPreviewContent = () => {
    switch (type) {
      case "transaction":
        return (
          <div className="font-mono text-sm">
            <p>🔔 交易通知</p>
            <p></p>
            <p>類型: {data.type}</p>
            <p>金額: ${data.amount.toLocaleString()}</p>
            {data.memberName && <p>會員: {data.memberName}</p>}
            <p></p>
            <p>時間: {new Date().toLocaleString()}</p>
          </div>
        )
      case "dividend":
        return (
          <div className="font-mono text-sm">
            <p>💰 分紅通知</p>
            <p></p>
            <p>總盈利: ${data.totalProfit.toLocaleString()}</p>
            <p>每股分紅: ${data.dividendPerShare.toLocaleString()}</p>
            <p></p>
            <p>時間: {new Date().toLocaleString()}</p>
          </div>
        )
      case "system":
        return (
          <div className="font-mono text-sm">
            <p>⚙️ {data.title}</p>
            <p></p>
            <p>{data.details}</p>
            <p></p>
            <p>時間: {new Date().toLocaleString()}</p>
          </div>
        )
      case "alert":
        return (
          <div className="font-mono text-sm">
            <p>⚠️ {data.alertType}</p>
            <p></p>
            <p>{data.details}</p>
            <p></p>
            <p>時間: {new Date().toLocaleString()}</p>
          </div>
        )
      default:
        return <div>無效的通知類型</div>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
          Telegram 通知預覽
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-[#f5f5f5] p-4 border border-gray-200">{renderPreviewContent()}</div>
      </CardContent>
    </Card>
  )
}

