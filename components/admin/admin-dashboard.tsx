"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, AlertTriangle, TrendingUp, Activity, Server } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// 添加對新組件的引用
import TransactionButtonsManager from "@/components/admin/transaction-buttons-manager"

export default function AdminDashboard() {
  const [dataLoaded, setDataLoaded] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    systemProfit: 0,
    abnormalTransactions: 0,
    systemLoad: 45, // 模擬系統負載百分比
    dbStatus: "正常",
    apiStatus: "正常",
    paymentStatus: "正常",
    backupStatus: "正常",
    lastBackup: "2025-03-18 08:30",
    version: "1.2.3",
  })

  // 添加一個 useEffect 來初始化儀表板
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 實際應用中應該從 API 獲取數據
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats({
            ...stats,
            totalUsers: data.totalUsers || 0,
            totalTransactions: data.totalTransactions || 0,
            systemProfit: data.systemProfit || 0,
            abnormalTransactions: data.abnormalTransactions || 0,
          })
        }
      } catch (error) {
        console.error("獲取統計數據失敗:", error)
      } finally {
        setDataLoaded(true)
      }
    }

    fetchStats()

    // 模擬系統負載變化
    const loadInterval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        systemLoad: Math.floor(Math.random() * 60) + 20, // 20-80% 之間的隨機值
      }))
    }, 5000)

    return () => clearInterval(loadInterval)
  }, [])

  const getStatusColor = (status) => {
    return status === "正常" ? "bg-green-500" : "bg-red-500"
  }

  const getLoadColor = (load) => {
    if (load < 50) return "bg-green-500"
    if (load < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">管理員儀表板</h2>
          <p className="text-muted-foreground">系統概覽和關鍵指標</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/database/test">數據庫測試</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/database/connection">數據庫連接</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/database">數據庫管理</Link>
          </Button>
          <Button asChild variant="default" className="bg-green-600 hover:bg-green-700">
            <Link href="/admin/database/initialize">初始化數據庫</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">系統概覽</TabsTrigger>
          <TabsTrigger value="users">用戶管理</TabsTrigger>
          <TabsTrigger value="transactions">交易記錄</TabsTrigger>
          <TabsTrigger value="funds">資金管理</TabsTrigger>
          <TabsTrigger value="points">積分管理</TabsTrigger>
          <TabsTrigger value="database">數據庫</TabsTrigger>
          <TabsTrigger value="buttons">交易按鈕</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardTitle className="text-sm font-medium">總用戶數</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{dataLoaded ? stats.totalUsers : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {dataLoaded ? "活躍用戶: " + Math.floor(stats.totalUsers * 0.7) : "加載中..."}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <CardTitle className="text-sm font-medium">交易總額</CardTitle>
                <CreditCard className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{dataLoaded ? stats.totalTransactions : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {dataLoaded ? "今日交易: " + Math.floor(stats.totalTransactions * 0.1) : "加載中..."}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <CardTitle className="text-sm font-medium">系統盈利</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{dataLoaded ? stats.systemProfit : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">{dataLoaded ? "本月增長: +5%" : "加載中..."}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
                <CardTitle className="text-sm font-medium">異常交易</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{dataLoaded ? stats.abnormalTransactions : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {dataLoaded ? "需要審核: " + Math.floor(stats.abnormalTransactions * 0.3) : "加載中..."}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gray-500" />
                  系統活動
                </CardTitle>
                <CardDescription>最近系統活動記錄</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataLoaded ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                          <p>用戶登入</p>
                        </div>
                        <p className="text-gray-500">5分鐘前</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                          <p>新增交易</p>
                        </div>
                        <p className="text-gray-500">15分鐘前</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full bg-purple-500"></div>
                          <p>數據庫備份</p>
                        </div>
                        <p className="text-gray-500">1小時前</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full bg-amber-500"></div>
                          <p>系統更新</p>
                        </div>
                        <p className="text-gray-500">3小時前</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-sm text-gray-500">加載中...</p>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  查看所有活動
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-gray-500" />
                  系統狀態
                </CardTitle>
                <CardDescription>當前系統運行狀態</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(stats.dbStatus)}`}></div>
                      <p className="text-sm font-medium">數據庫連接</p>
                    </div>
                    <p className="text-sm text-gray-500">{stats.dbStatus}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(stats.apiStatus)}`}></div>
                      <p className="text-sm font-medium">API 服務</p>
                    </div>
                    <p className="text-sm text-gray-500">{stats.apiStatus}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(stats.paymentStatus)}`}></div>
                      <p className="text-sm font-medium">支付系統</p>
                    </div>
                    <p className="text-sm text-gray-500">{stats.paymentStatus}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(stats.backupStatus)}`}></div>
                      <p className="text-sm font-medium">備份系統</p>
                    </div>
                    <p className="text-sm text-gray-500">上次備份: {stats.lastBackup}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">系統負載</p>
                      <p className="text-sm text-gray-500">{stats.systemLoad}%</p>
                    </div>
                    <Progress value={stats.systemLoad} className={getLoadColor(stats.systemLoad)} />
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-medium">系統版本</h4>
                  <div className="rounded-md bg-gray-100 p-2">
                    <p className="text-xs font-mono">交易系統 v{stats.version}</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    系統診斷
                  </Button>
                  <Button className="flex-1">更新系統</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>用戶管理</CardTitle>
              <CardDescription>管理系統用戶和權限</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>添加新用戶</Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted text-left text-xs font-medium">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">用戶名</th>
                      <th className="px-4 py-3">角色</th>
                      <th className="px-4 py-3">狀態</th>
                      <th className="px-4 py-3">上次登入</th>
                      <th className="px-4 py-3">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">1</td>
                      <td className="px-4 py-3 text-sm">admin</td>
                      <td className="px-4 py-3 text-sm">管理員</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">活躍</span>
                      </td>
                      <td className="px-4 py-3 text-sm">2025-03-18 10:30</td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm">
                          編輯
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">2</td>
                      <td className="px-4 py-3 text-sm">operator</td>
                      <td className="px-4 py-3 text-sm">操作員</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">活躍</span>
                      </td>
                      <td className="px-4 py-3 text-sm">2025-03-17 15:45</td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm">
                          編輯
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>交易記錄</CardTitle>
              <CardDescription>查看和管理系統交易</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex gap-2">
                  <Button variant="outline">今日</Button>
                  <Button variant="outline">本週</Button>
                  <Button variant="outline">本月</Button>
                </div>
                <Button>導出報表</Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted text-left text-xs font-medium">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">用戶</th>
                      <th className="px-4 py-3">類型</th>
                      <th className="px-4 py-3">金額</th>
                      <th className="px-4 py-3">日期</th>
                      <th className="px-4 py-3">狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">T001</td>
                      <td className="px-4 py-3 text-sm">張三</td>
                      <td className="px-4 py-3 text-sm">買碼</td>
                      <td className="px-4 py-3 text-sm">$5,000</td>
                      <td className="px-4 py-3 text-sm">2025-03-18 09:15</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">完成</span>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">T002</td>
                      <td className="px-4 py-3 text-sm">李四</td>
                      <td className="px-4 py-3 text-sm">兌碼</td>
                      <td className="px-4 py-3 text-sm">$3,200</td>
                      <td className="px-4 py-3 text-sm">2025-03-18 08:30</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">完成</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="funds">
          <Card>
            <CardHeader>
              <CardTitle>資金管理</CardTitle>
              <CardDescription>管理系統資金和自定義資金類別</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">資金類別管理</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">添加新類別</h4>
                      <div className="flex gap-2">
                        <Input placeholder="類別名稱" className="flex-1" />
                        <Button>添加</Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">現有類別</h4>
                      <div className="space-y-2">
                        {dataLoaded ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span>營運資金</span>
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm">
                                  編輯
                                </Button>
                                <Button variant="destructive" size="sm">
                                  刪除
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>投資資金</span>
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm">
                                  編輯
                                </Button>
                                <Button variant="destructive" size="sm">
                                  刪除
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>儲備資金</span>
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm">
                                  編輯
                                </Button>
                                <Button variant="destructive" size="sm">
                                  刪除
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-2 text-gray-500">加載中...</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">資金概覽</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted text-left text-xs font-medium">
                          <th className="px-4 py-3">會員</th>
                          <th className="px-4 py-3">總餘額</th>
                          <th className="px-4 py-3">可用餘額</th>
                          <th className="px-4 py-3">凍結餘額</th>
                          <th className="px-4 py-3">類別</th>
                          <th className="px-4 py-3">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataLoaded ? (
                          <>
                            <tr className="border-t">
                              <td className="px-4 py-3 text-sm">張三</td>
                              <td className="px-4 py-3 text-sm">¥10,000</td>
                              <td className="px-4 py-3 text-sm">¥8,500</td>
                              <td className="px-4 py-3 text-sm">¥1,500</td>
                              <td className="px-4 py-3 text-sm">營運資金</td>
                              <td className="px-4 py-3 text-sm">
                                <Button variant="ghost" size="sm">
                                  管理
                                </Button>
                              </td>
                            </tr>
                            <tr className="border-t">
                              <td className="px-4 py-3 text-sm">李四</td>
                              <td className="px-4 py-3 text-sm">¥25,000</td>
                              <td className="px-4 py-3 text-sm">¥25,000</td>
                              <td className="px-4 py-3 text-sm">¥0</td>
                              <td className="px-4 py-3 text-sm">投資資金</td>
                              <td className="px-4 py-3 text-sm">
                                <Button variant="ghost" size="sm">
                                  管理
                                </Button>
                              </td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-3 text-center text-sm text-gray-500">
                              加載中...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>查看所有資金</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">資金操作</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">增加資金</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="add-member">選擇會員</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="選擇會員" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">張三</SelectItem>
                                <SelectItem value="2">李四</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="add-amount">金額</Label>
                            <Input id="add-amount" type="number" placeholder="0.00" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="add-category">資金類別</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="選擇類別" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="operating">營運資金</SelectItem>
                                <SelectItem value="investment">投資資金</SelectItem>
                                <SelectItem value="reserve">儲備資金</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full mt-2">增加資金</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">扣除資金</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="deduct-member">選擇會員</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="選擇會員" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">張三</SelectItem>
                                <SelectItem value="2">李四</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="deduct-amount">金額</Label>
                            <Input id="deduct-amount" type="number" placeholder="0.00" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="deduct-category">資金類別</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="選擇類別" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="operating">營運資金</SelectItem>
                                <SelectItem value="investment">投資資金</SelectItem>
                                <SelectItem value="reserve">儲備資金</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full mt-2">扣除資金</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">凍結/解凍資金</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="freeze-member">選擇會員</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="選擇會員" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">張三</SelectItem>
                                <SelectItem value="2">李四</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="freeze-amount">金額</Label>
                            <Input id="freeze-amount" type="number" placeholder="0.00" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="freeze-action">操作</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="選擇操作" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="freeze">凍結資金</SelectItem>
                                <SelectItem value="unfreeze">解凍資金</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full mt-2">執行操作</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>積分類型管理</CardTitle>
              <CardDescription>管理系統中的積分類型</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pointTypeName">積分類型名稱</Label>
                      <Input id="pointTypeName" placeholder="例如: 消費積分" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pointTypeDescription">描述</Label>
                      <Input id="pointTypeDescription" placeholder="積分類型描述" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pointTypeRate">兌換率</Label>
                      <Input id="pointTypeRate" type="number" placeholder="1.0" />
                    </div>
                    <div className="flex items-end">
                      <Button>添加積分類型</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>名稱</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>兌換率</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>消費積分</TableCell>
                        <TableCell>購物時獲得的積分</TableCell>
                        <TableCell>1.0</TableCell>
                        <TableCell>啟用</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              編輯
                            </Button>
                            <Button variant="destructive" size="sm">
                              停用
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>活動積分</TableCell>
                        <TableCell>參與活動獲得的積分</TableCell>
                        <TableCell>1.2</TableCell>
                        <TableCell>啟用</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              編輯
                            </Button>
                            <Button variant="destructive" size="sm">
                              停用
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>積分兌換規則</CardTitle>
              <CardDescription>設置積分兌換獎勵的規則</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="redemptionName">規則名稱</Label>
                      <Input id="redemptionName" placeholder="例如: 折扣券兌換" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pointsRequired">所需積分</Label>
                      <Input id="pointsRequired" type="number" placeholder="100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rewardType">獎勵類型</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇獎勵類型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discount">折扣券</SelectItem>
                          <SelectItem value="gift">禮品</SelectItem>
                          <SelectItem value="cash">現金回饋</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rewardValue">獎勵值</Label>
                      <Input id="rewardValue" placeholder="獎勵值" />
                    </div>
                    <div className="flex items-end">
                      <Button>添加兌換規則</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>規則名稱</TableHead>
                        <TableHead>所需積分</TableHead>
                        <TableHead>獎勵類型</TableHead>
                        <TableHead>獎勵值</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>折扣券兌換</TableCell>
                        <TableCell>100</TableCell>
                        <TableCell>折扣券</TableCell>
                        <TableCell>10% 折扣</TableCell>
                        <TableCell>啟用</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              編輯
                            </Button>
                            <Button variant="destructive" size="sm">
                              停用
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>現金回饋</TableCell>
                        <TableCell>500</TableCell>
                        <TableCell>現金回饋</TableCell>
                        <TableCell>$50</TableCell>
                        <TableCell>啟用</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              編輯
                            </Button>
                            <Button variant="destructive" size="sm">
                              停用
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>會員積分查詢</CardTitle>
              <CardDescription>查詢會員積分餘額和交易記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input placeholder="輸入會員ID或名稱進行搜索" />
                  </div>
                  <Button>搜索</Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>會員ID</TableHead>
                        <TableHead>會員名稱</TableHead>
                        <TableHead>消費積分</TableHead>
                        <TableHead>活動積分</TableHead>
                        <TableHead>總積分</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1001</TableCell>
                        <TableCell>張三</TableCell>
                        <TableCell>250</TableCell>
                        <TableCell>120</TableCell>
                        <TableCell>370</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              查看詳情
                            </Button>
                            <Button variant="outline" size="sm">
                              調整積分
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>1002</TableCell>
                        <TableCell>李四</TableCell>
                        <TableCell>180</TableCell>
                        <TableCell>90</TableCell>
                        <TableCell>270</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              查看詳情
                            </Button>
                            <Button variant="outline" size="sm">
                              調整積分
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>數據庫管理</CardTitle>
              <CardDescription>管理系統數據庫</CardDescription>
            </CardHeader>
            <CardContent>
              <p>數據庫管理內容</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="buttons">
          <TransactionButtonsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

