"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Bell, RefreshCw, Wifi, WifiOff, Info, AlertCircle } from "lucide-react"
import { setupInstallListeners, promptInstall, isAppInstalled, getInstallInstructions } from "@/lib/pwa/install"
import {
  checkNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "@/lib/pwa/notification"
import { setupNetworkListeners, updateApp, checkForAppUpdate } from "@/lib/pwa/offline"

export function PWAManager() {
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationsSupported, setNotificationsSupported] = useState(false)
  const [online, setOnline] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [installInstructions, setInstallInstructions] = useState<{ title: string; steps: string[] }>({
    title: "",
    steps: [],
  })

  // 初始化
  useEffect(() => {
    // 檢查是否已安裝
    setIsInstalled(isAppInstalled())

    // 獲取安裝指南
    setInstallInstructions(getInstallInstructions())

    // 設置安裝監聽器
    const cleanupInstall = setupInstallListeners(
      () => setCanInstall(true),
      () => {
        setCanInstall(false)
        setIsInstalled(true)
      },
      () => {},
    )

    // 設置網絡監聽器
    const cleanupNetwork = setupNetworkListeners(
      () => setOnline(true),
      () => setOnline(false),
    )

    // 檢查通知權限
    const checkNotifications = async () => {
      setNotificationsSupported("Notification" in window)
      if ("Notification" in window) {
        const enabled = await checkNotificationPermission()
        setNotificationsEnabled(enabled)
      }
    }
    checkNotifications()

    // 檢查更新
    const checkUpdate = async () => {
      const hasUpdate = await checkForAppUpdate()
      setUpdateAvailable(hasUpdate)
    }
    checkUpdate()

    // 定期檢查更新
    const updateInterval = setInterval(checkUpdate, 60 * 60 * 1000) // 每小時檢查一次

    // 清理函數
    return () => {
      cleanupInstall()
      cleanupNetwork()
      clearInterval(updateInterval)
    }
  }, [])

  // 處理安裝
  const handleInstall = async () => {
    const success = await promptInstall()
    if (success) {
      setCanInstall(false)
      setIsInstalled(true)
    }
  }

  // 處理通知開關
  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const subscription = await subscribeToPushNotifications()
      setNotificationsEnabled(!!subscription)
    } else {
      const success = await unsubscribeFromPushNotifications()
      if (success) {
        setNotificationsEnabled(false)
      }
    }
  }

  // 處理應用更新
  const handleUpdate = async () => {
    const updated = await updateApp()
    if (updated) {
      setUpdateAvailable(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>應用設置</CardTitle>
        <CardDescription>管理應用安裝、通知和離線功能</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="installation">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="installation">安裝</TabsTrigger>
            <TabsTrigger value="notifications">通知</TabsTrigger>
            <TabsTrigger value="offline">離線功能</TabsTrigger>
          </TabsList>

          {/* 安裝選項卡 */}
          <TabsContent value="installation" className="space-y-4">
            {isInstalled ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>已安裝</AlertTitle>
                <AlertDescription>應用已成功安裝到您的設備上。</AlertDescription>
              </Alert>
            ) : canInstall ? (
              <div className="space-y-4">
                <Alert>
                  <Download className="h-4 w-4" />
                  <AlertTitle>可安裝</AlertTitle>
                  <AlertDescription>您可以將此應用安裝到您的設備上，以便離線使用和獲得更好的體驗。</AlertDescription>
                </Alert>
                <Button onClick={handleInstall} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  安裝應用
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>{installInstructions.title}</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {installInstructions.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {updateAvailable && (
              <div className="mt-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <RefreshCw className="h-4 w-4 text-blue-500" />
                  <AlertTitle>更新可用</AlertTitle>
                  <AlertDescription>有新版本的應用可用。更新以獲取最新功能和改進。</AlertDescription>
                </Alert>
                <Button onClick={handleUpdate} className="w-full mt-2 bg-blue-500 hover:bg-blue-600">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  更新應用
                </Button>
              </div>
            )}
          </TabsContent>

          {/* 通知選項卡 */}
          <TabsContent value="notifications" className="space-y-4">
            {notificationsSupported ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">啟用推送通知</Label>
                    <p className="text-sm text-muted-foreground">接收重要交易和系統通知</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationToggle}
                  />
                </div>

                {notificationsEnabled && (
                  <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertTitle>通知已啟用</AlertTitle>
                    <AlertDescription>您將收到關於交易、結算和系統更新的通知。</AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>不支持通知</AlertTitle>
                <AlertDescription>您的瀏覽器不支持推送通知功能。請考慮使用更現代的瀏覽器。</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* 離線功能選項卡 */}
          <TabsContent value="offline" className="space-y-4">
            <div className="flex items-center space-x-2">
              {online ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
              <div>
                <p className="font-medium">{online ? "已連接到網絡" : "離線模式"}</p>
                <p className="text-sm text-muted-foreground">
                  {online ? "所有功能都可用" : "部分功能可能受限，數據將在恢復連接後同步"}
                </p>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>離線功能</AlertTitle>
              <AlertDescription>
                <p className="mb-2">即使在沒有網絡連接的情況下，您仍然可以：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>查看已緩存的會員信息</li>
                  <li>記錄新的交易（將在恢復連接後同步）</li>
                  <li>查看最近的交易記錄</li>
                  <li>訪問儀表板和基本報表</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              刷新頁面
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">交易系統 v1.0.0</p>
        <p className="text-sm text-muted-foreground">{online ? "在線" : "離線"}</p>
      </CardFooter>
    </Card>
  )
}

