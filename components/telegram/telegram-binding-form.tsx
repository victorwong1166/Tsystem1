"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { MessageSquare, ExternalLink, Check, Copy } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { handleBindRequest } from "@/lib/telegram-service"

export default function TelegramBindingForm() {
  const [telegramUsername, setTelegramUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBound, setIsBound] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    transactions: true,
    dividends: true,
    systemAlerts: true,
    loginNotifications: false,
  })

  // 模擬的機器人用戶名
  const botUsername = "TradingSystemBot"

  // 模擬的綁定碼
  const bindingCode = "TS12345"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 調用綁定服務
      const success = await handleBindRequest("current-user-id", telegramUsername)

      if (success) {
        toast({
          title: "綁定成功",
          description: `已成功綁定到 Telegram 用戶 ${telegramUsername}`,
        })
        setIsBound(true)
      } else {
        toast({
          title: "綁定失敗",
          description: "無法綁定到指定的 Telegram 用戶，請確認用戶名並重試",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "綁定失敗",
        description: "處理綁定請求時發生錯誤，請重試",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyBindingCode = () => {
    navigator.clipboard.writeText(bindingCode)
    toast({
      title: "已複製",
      description: "綁定碼已複製到剪貼板",
    })
  }

  const handleNotificationChange = (setting) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
          Telegram 綁定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800">如何綁定 Telegram</AlertTitle>
          <AlertDescription className="text-blue-700">
            <ol className="list-decimal pl-4 space-y-2 mt-2">
              <li>
                在 Telegram 中搜索並添加機器人 <strong>@{botUsername}</strong>
              </li>
              <li>向機器人發送綁定碼</li>
              <li>綁定成功後，您將收到確認消息</li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col space-y-2">
          <Label>Telegram 機器人</Label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 rounded-md bg-gray-100 p-2 font-mono">@{botUsername}</div>
            <Button variant="outline" size="icon" onClick={() => window.open(`https://t.me/${botUsername}`, "_blank")}>
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">打開 Telegram</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label>綁定碼</Label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 rounded-md bg-gray-100 p-2 font-mono">{bindingCode}</div>
            <Button variant="outline" size="icon" onClick={handleCopyBindingCode}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">複製綁定碼</span>
            </Button>
          </div>
          <p className="text-xs text-gray-500">向機器人發送此綁定碼以完成綁定</p>
        </div>

        {isBound ? (
          <div className="rounded-md bg-green-50 p-4 flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="font-medium text-green-800">已成功綁定</p>
              <p className="text-sm text-green-700">您的帳號已綁定到 Telegram 用戶 {telegramUsername}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="telegram-username">您的 Telegram 用戶名</Label>
              <Input
                id="telegram-username"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="例如: username (不含 @)"
                required
              />
              <p className="text-xs text-gray-500">請輸入您的 Telegram 用戶名，不包含 @ 符號</p>
            </div>
          </form>
        )}

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">通知設置</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-transactions" className="cursor-pointer">
                交易通知
              </Label>
              <Switch
                id="notify-transactions"
                checked={notificationSettings.transactions}
                onCheckedChange={() => handleNotificationChange("transactions")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-dividends" className="cursor-pointer">
                分紅通知
              </Label>
              <Switch
                id="notify-dividends"
                checked={notificationSettings.dividends}
                onCheckedChange={() => handleNotificationChange("dividends")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-system-alerts" className="cursor-pointer">
                系統警報
              </Label>
              <Switch
                id="notify-system-alerts"
                checked={notificationSettings.systemAlerts}
                onCheckedChange={() => handleNotificationChange("systemAlerts")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-login" className="cursor-pointer">
                登入通知
              </Label>
              <Switch
                id="notify-login"
                checked={notificationSettings.loginNotifications}
                onCheckedChange={() => handleNotificationChange("loginNotifications")}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isBound ? (
          <Button variant="destructive" onClick={() => setIsBound(false)}>
            解除綁定
          </Button>
        ) : (
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || !telegramUsername}>
            {isSubmitting ? "處理中..." : "確認綁定"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

