"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, Save, Database, Shield, Mail, Clock, Percent, MessageSquare } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminSystemSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 模擬API請求
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "設置已保存",
        description: "系統設置已成功更新",
      })
    } catch (error) {
      toast({
        title: "保存失敗",
        description: "保存設置時發生錯誤，請重試",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">一般設置</TabsTrigger>
          <TabsTrigger value="security">安全設置</TabsTrigger>
          <TabsTrigger value="database">數據庫設置</TabsTrigger>
          <TabsTrigger value="email">郵件設置</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="business">業務設置</TabsTrigger>
        </TabsList>

        {/* 一般設置 */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>一般設置</CardTitle>
              <CardDescription>配置系統的基本設置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">系統名稱</Label>
                  <Input id="system-name" defaultValue="交易系統" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">管理員郵箱</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-description">系統描述</Label>
                <Textarea id="system-description" defaultValue="交易管理系統，用於管理會員、交易和分紅" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">時區</Label>
                  <Select defaultValue="Asia/Hong_Kong">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Hong_Kong">香港 (GMT+8)</SelectItem>
                      <SelectItem value="Asia/Shanghai">上海 (GMT+8)</SelectItem>
                      <SelectItem value="Asia/Tokyo">東京 (GMT+9)</SelectItem>
                      <SelectItem value="America/New_York">紐約 (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">倫敦 (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">日期格式</Label>
                  <Select defaultValue="yyyy-MM-dd">
                    <SelectTrigger id="date-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy年MM月dd日">YYYY年MM月DD日</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance-mode" className="block">
                  維護模式
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch id="maintenance-mode" />
                  <Label htmlFor="maintenance-mode">啟用維護模式</Label>
                </div>
                <p className="text-sm text-gray-500">啟用後，除管理員外的所有用戶將無法訪問系統</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "保存中..." : "保存設置"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 安全設置 */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-500" />
                安全設置
              </CardTitle>
              <CardDescription>配置系統的安全選項</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password-policy">密碼策略</Label>
                <Select defaultValue="strong">
                  <SelectTrigger id="password-policy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">基本 (最少6個字符)</SelectItem>
                    <SelectItem value="medium">中等 (最少8個字符，包含數字)</SelectItem>
                    <SelectItem value="strong">強 (最少10個字符，包含大小寫和數字)</SelectItem>
                    <SelectItem value="very-strong">非常強 (最少12個字符，包含大小寫、數字和特殊字符)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">會話超時 (分鐘)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" min="5" max="120" />
                <p className="text-sm text-gray-500">用戶無操作後自動登出的時間</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-attempts">最大登入嘗試次數</Label>
                <Input id="login-attempts" type="number" defaultValue="5" min="3" max="10" />
                <p className="text-sm text-gray-500">超過此次數後帳戶將被暫時鎖定</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-lockout" className="block">
                  帳戶鎖定時間 (分鐘)
                </Label>
                <Input id="account-lockout" type="number" defaultValue="15" min="5" max="60" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="two-factor" className="block">
                  雙因素認證
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch id="two-factor" />
                  <Label htmlFor="two-factor">要求管理員使用雙因素認證</Label>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>安全提示</AlertTitle>
                <AlertDescription>建議啟用雙因素認證以提高系統安全性，並定期更改管理員密碼。</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "保存中..." : "保存設置"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 數據庫設置 */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-green-500" />
                數據庫設置
              </CardTitle>
              <CardDescription>配置數據庫連接和備份選項</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-host">數據庫主機</Label>
                  <Input id="db-host" defaultValue="localhost" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">端口</Label>
                  <Input id="db-port" type="number" defaultValue="3306" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-name">數據庫名稱</Label>
                  <Input id="db-name" defaultValue="trading_system" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-user">用戶名</Label>
                  <Input id="db-user" defaultValue="db_user" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="db-password">密碼</Label>
                <Input id="db-password" type="password" defaultValue="********" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-backup" className="block">
                  自動備份
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-backup" defaultChecked />
                  <Label htmlFor="auto-backup">啟用自動備份</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">備份頻率</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">每小時</SelectItem>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="weekly">每週</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-time">備份時間</Label>
                  <Input id="backup-time" type="time" defaultValue="03:00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-retention">保留備份數量</Label>
                <Input id="backup-retention" type="number" defaultValue="7" min="1" max="30" />
                <p className="text-sm text-gray-500">系統將保留最近的備份數量</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">立即備份</Button>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "保存中..." : "保存設置"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 郵件設置 */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-blue-500" />
                郵件設置
              </CardTitle>
              <CardDescription>配置系統郵件發送選項</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP 主機</Label>
                  <Input id="smtp-host" defaultValue="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP 端口</Label>
                  <Input id="smtp-port" type="number" defaultValue="587" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">SMTP 用戶名</Label>
                  <Input id="smtp-username" defaultValue="notifications@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP 密碼</Label>
                  <Input id="smtp-password" type="password" defaultValue="********" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-from">發件人地址</Label>
                <Input id="email-from" defaultValue="系統通知 <notifications@example.com>" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-encryption" className="block">
                  加密方式
                </Label>
                <Select defaultValue="tls">
                  <SelectTrigger id="email-encryption">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">無</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-notifications" className="block">
                  郵件通知
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch id="email-notifications" defaultChecked />
                  <Label htmlFor="email-notifications">啟用系統郵件通知</Label>
                </div>
                <p className="text-sm text-gray-500">啟用後，系統將發送重要事件的郵件通知</p>
              </div>

              <div className="space-y-2">
                <Label>通知事件</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-login" defaultChecked />
                    <Label htmlFor="notify-login">異常登入</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-backup" defaultChecked />
                    <Label htmlFor="notify-backup">備份完成</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-dividend" defaultChecked />
                    <Label htmlFor="notify-dividend">分紅操作</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-large-transaction" defaultChecked />
                    <Label htmlFor="notify-large-transaction">大額交易</Label>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline">發送測試郵件</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "保存中..." : "保存設置"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Telegram 設置 */}
        <TabsContent value="telegram">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                Telegram 設置
              </CardTitle>
              <CardDescription>配置 Telegram 機器人和通知設置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegram-bot-token">Bot Token</Label>
                <Input id="telegram-bot-token" defaultValue="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ" />
                <p className="text-sm text-gray-500">從 BotFather 獲取的 Telegram Bot Token</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram-bot-username">Bot 用戶名</Label>
                <Input id="telegram-bot-username" defaultValue="TradingSystemBot" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram-webhook-url">Webhook URL</Label>
                <Input id="telegram-webhook-url" defaultValue="https://yourdomain.com/api/telegram/webhook" />
                <p className="text-sm text-gray-500">接收 Telegram 更新的 Webhook URL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram-enabled" className="block">
                  啟用 Telegram
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch id="telegram-enabled" defaultChecked />
                  <Label htmlFor="telegram-enabled">啟用 Telegram 通知</Label>
                </div>
                <p className="text-sm text-gray-500">啟用後，系統將通過 Telegram 發送通知</p>
              </div>

              <div className="space-y-2">
                <Label>通知事件</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="telegram-notify-login" defaultChecked />
                    <Label htmlFor="telegram-notify-login">登入通知</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="telegram-notify-transaction" defaultChecked />
                    <Label htmlFor="telegram-notify-transaction">交易通知</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="telegram-notify-dividend" defaultChecked />
                    <Label htmlFor="telegram-notify-dividend">分紅通知</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="telegram-notify-system" defaultChecked />
                    <Label htmlFor="telegram-notify-system">系統通知</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram-admin-chat-id">管理員 Chat ID</Label>
                <Input id="telegram-admin-chat-id" defaultValue="123456789" />
                <p className="text-sm text-gray-500">接收管理員通知的 Telegram Chat ID</p>
              </div>

              <div className="mt-4">
                <Button variant="outline">測試 Telegram 連接</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "保存中..." : "保存設置"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 業務設置 */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5 text-purple-500" />
                業務設置
              </CardTitle>
              <CardDescription>配置系統業務相關選項</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dividend-cycle">分紅週期 (天)</Label>
                <Input id="dividend-cycle" type="number" defaultValue="3" min="1" max="30" />
                <p className="text-sm text-gray-500">系統自動結算分紅的天數</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dividend-calculation">分紅計算方式</Label>
                <Select defaultValue="equal">
                  <SelectTrigger id="dividend-calculation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">平均分配</SelectItem>
                    <SelectItem value="proportional">按股份比例</SelectItem>
                    <SelectItem value="custom">自定義公式</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-fee">交易手續費 (%)</Label>
                <Input id="transaction-fee" type="number" defaultValue="0.5" min="0" max="10" step="0.1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="large-transaction-threshold">大額交易閾值</Label>
                <Input id="large-transaction-threshold" type="number" defaultValue="50000" min="1000" />
                <p className="text-sm text-gray-500">超過此金額的交易將被標記為大額交易</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-settlement" className="block">
                  自動結算
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-settlement" defaultChecked />
                  <Label htmlFor="auto-settlement">啟用自動結算</Label>
                </div>
                <p className="text-sm text-gray-500">啟用後，系統將按照設定的分紅週期自動結算</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settlement-time">結算時間</Label>
                <Input id="settlement-time" type="time" defaultValue="23:59" />
                <p className="text-sm text-gray-500">系統執行自動結算的時間</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">貨幣單位</Label>
                <Select defaultValue="HKD">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HKD">港幣 (HKD)</SelectItem>
                    <SelectItem value="CNY">人民幣 (CNY)</SelectItem>
                    <SelectItem value="USD">美元 (USD)</SelectItem>
                    <SelectItem value="EUR">歐元 (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <Clock className="h-4 w-4" />
                <AlertTitle>業務提示</AlertTitle>
                <AlertDescription>修改業務設置可能會影響系統的財務計算，請謹慎操作。</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "保存中..." : "保存設置"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

