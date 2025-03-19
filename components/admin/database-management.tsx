"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  Database,
  Server,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react"
import { testConnection, initializeDatabase } from "@/lib/db-migrate"

export default function DatabaseManagement() {
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking")
  const [connectionDetails, setConnectionDetails] = useState<any>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [sqlQuery, setSqlQuery] = useState("")
  const [queryResult, setQueryResult] = useState<any>(null)
  const [isExecutingQuery, setIsExecutingQuery] = useState(false)

  // 檢查數據庫連接
  useEffect(() => {
    async function checkConnection() {
      try {
        const result = await testConnection()
        if (result.success) {
          setConnectionStatus("connected")
          setConnectionDetails(result)
        } else {
          setConnectionStatus("error")
          setConnectionDetails({ error: result.error })
        }
      } catch (error) {
        setConnectionStatus("error")
        setConnectionDetails({ error: error.message })
      }
    }

    checkConnection()
  }, [])

  // 初始化數據庫
  const handleInitializeDatabase = async () => {
    setIsInitializing(true)

    try {
      const result = await initializeDatabase()

      if (result.success) {
        toast({
          title: "數據庫初始化成功",
          description: result.message,
        })
      } else {
        toast({
          title: "數據庫初始化失敗",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "數據庫初始化失敗",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  // 模擬備份數據庫
  const handleBackupDatabase = () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          toast({
            title: "數據庫備份完成",
            description: "備份文件已生成: backup_20230516_120000.sql",
          })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // 執行SQL查詢
  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: "查詢為空",
        description: "請輸入SQL查詢語句",
        variant: "destructive",
      })
      return
    }

    setIsExecutingQuery(true)

    try {
      // 模擬查詢執行
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模擬查詢結果
      if (sqlQuery.toLowerCase().includes("select")) {
        setQueryResult({
          success: true,
          rows: [
            { id: 1, username: "admin", name: "系統管理員", role: "admin" },
            { id: 2, username: "user", name: "前台用戶", role: "user" },
          ],
          rowCount: 2,
          duration: "15ms",
        })
      } else {
        setQueryResult({
          success: true,
          message: "查詢執行成功",
          affectedRows: 1,
          duration: "12ms",
        })
      }

      toast({
        title: "查詢執行成功",
        description: "查詢已成功執行",
      })
    } catch (error) {
      setQueryResult({
        success: false,
        error: error.message,
      })

      toast({
        title: "查詢執行失敗",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsExecutingQuery(false)
    }
  }

  return (
    <Tabs defaultValue="status">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="status">數據庫狀態</TabsTrigger>
        <TabsTrigger value="backup">備份與恢復</TabsTrigger>
        <TabsTrigger value="query">SQL查詢</TabsTrigger>
        <TabsTrigger value="tables">表結構</TabsTrigger>
      </TabsList>

      {/* 數據庫狀態 */}
      <TabsContent value="status">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5 text-blue-500" />
              數據庫狀態
            </CardTitle>
            <CardDescription>查看數據庫連接狀態和系統信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium">連接狀態:</div>
              {connectionStatus === "checking" && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  檢查中...
                </Badge>
              )}
              {connectionStatus === "connected" && (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  已連接
                </Badge>
              )}
              {connectionStatus === "error" && (
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  <XCircle className="mr-1 h-3 w-3" />
                  連接錯誤
                </Badge>
              )}
            </div>

            {connectionStatus === "connected" && connectionDetails && (
              <div className="rounded-md bg-slate-50 p-4">
                <div className="text-sm">
                  <div className="font-medium">數據庫時間:</div>
                  <div>{new Date(connectionDetails.timestamp).toLocaleString()}</div>
                </div>
                <div className="mt-2 text-sm">
                  <div className="font-medium">數據庫類型:</div>
                  <div>PostgreSQL (Neon)</div>
                </div>
              </div>
            )}

            {connectionStatus === "error" && connectionDetails && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>連接錯誤</AlertTitle>
                <AlertDescription>{connectionDetails.error}</AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border p-4">
              <h4 className="mb-2 font-medium">數據庫初始化</h4>
              <p className="text-sm text-gray-500 mb-4">
                初始化數據庫將創建所有必要的表格並填充初始數據。如果表格已存在，此操作將不會影響現有數據。
              </p>
              <Button onClick={handleInitializeDatabase} disabled={isInitializing || connectionStatus !== "connected"}>
                <Database className="mr-2 h-4 w-4" />
                {isInitializing ? "初始化中..." : "初始化數據庫"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 備份與恢復 */}
      <TabsContent value="backup">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2 h-5 w-5 text-green-500" />
              備份與恢復
            </CardTitle>
            <CardDescription>管理數據庫備份和恢復操作</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-md border p-4">
              <h4 className="mb-2 font-medium">創建備份</h4>
              <p className="text-sm text-gray-500 mb-4">創建數據庫的完整備份，包括所有表格和數據。</p>

              {isBackingUp && (
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">備份進度</span>
                    <span className="text-sm">{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} className="h-2" />
                </div>
              )}

              <Button onClick={handleBackupDatabase} disabled={isBackingUp || connectionStatus !== "connected"}>
                <Download className="mr-2 h-4 w-4" />
                {isBackingUp ? "備份中..." : "創建備份"}
              </Button>
            </div>

            <div className="rounded-md border p-4">
              <h4 className="mb-2 font-medium">恢復備份</h4>
              <p className="text-sm text-gray-500 mb-4">從備份文件恢復數據庫。此操作將覆蓋現有數據。</p>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  選擇備份文件
                </Button>
                <Button disabled={connectionStatus !== "connected"}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  恢復數據
                </Button>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h4 className="mb-2 font-medium">自動備份設置</h4>
              <p className="text-sm text-gray-500 mb-4">配置系統自動備份設置。</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-sm mb-1">備份頻率</div>
                  <div className="text-sm">每日</div>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">備份時間</div>
                  <div className="text-sm">03:00 AM</div>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">保留備份數</div>
                  <div className="text-sm">7</div>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">備份位置</div>
                  <div className="text-sm">服務器本地</div>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h4 className="mb-2 font-medium">最近備份</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-500 mr-2" />
                    <span>backup_20230516_030000.sql</span>
                  </div>
                  <div className="text-sm text-gray-500">2023-05-16 03:00</div>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-500 mr-2" />
                    <span>backup_20230515_030000.sql</span>
                  </div>
                  <div className="text-sm text-gray-500">2023-05-15 03:00</div>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-500 mr-2" />
                    <span>backup_20230514_030000.sql</span>
                  </div>
                  <div className="text-sm text-gray-500">2023-05-14 03:00</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SQL查詢 */}
      <TabsContent value="query">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-purple-500" />
              SQL查詢
            </CardTitle>
            <CardDescription>執行自定義SQL查詢</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>注意</AlertTitle>
              <AlertDescription>
                請謹慎執行SQL查詢，特別是修改或刪除數據的操作。建議在執行前備份數據庫。
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Textarea
                placeholder="輸入SQL查詢..."
                className="font-mono text-sm h-40"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
              />
              <Button
                onClick={handleExecuteQuery}
                disabled={isExecutingQuery || !sqlQuery.trim() || connectionStatus !== "connected"}
              >
                {isExecutingQuery ? "執行中..." : "執行查詢"}
              </Button>
            </div>

            {queryResult && (
              <div className="rounded-md border p-4 mt-4">
                <h4 className="mb-2 font-medium">查詢結果</h4>
                {queryResult.success ? (
                  <div>
                    {queryResult.rows ? (
                      <div>
                        <div className="text-sm text-gray-500 mb-2">
                          返回 {queryResult.rowCount} 行 (耗時: {queryResult.duration})
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {Object.keys(queryResult.rows[0]).map((key) => (
                                  <th
                                    key={key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {queryResult.rows.map((row, i) => (
                                <tr key={i}>
                                  {Object.values(row).map((value, j) => (
                                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {value}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <div className="text-green-600 font-medium">{queryResult.message}</div>
                        <div className="text-gray-500">
                          影響行數: {queryResult.affectedRows} (耗時: {queryResult.duration})
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-500 text-sm">錯誤: {queryResult.error}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* 表結構 */}
      <TabsContent value="tables">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-blue-500" />
              數據庫表結構
            </CardTitle>
            <CardDescription>查看系統數據庫表結構</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-md border">
                <div className="bg-slate-50 px-4 py-2 font-medium border-b">users - 用戶表</div>
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">欄位</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">類型</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">說明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-2 text-sm">id</td>
                        <td className="px-4 py-2 text-sm">SERIAL</td>
                        <td className="px-4 py-2 text-sm">主鍵</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">username</td>
                        <td className="px-4 py-2 text-sm">VARCHAR(50)</td>
                        <td className="px-4 py-2 text-sm">用戶名，唯一</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">password</td>
                        <td className="px-4 py-2 text-sm">TEXT</td>
                        <td className="px-4 py-2 text-sm">密碼（加密）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">name</td>
                        <td className="px-4 py-2 text-sm">VARCHAR(100)</td>
                        <td className="px-4 py-2 text-sm">姓名</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">email</td>
                        <td className="px-4 py-2 text-sm">VARCHAR(100)</td>
                        <td className="px-4 py-2 text-sm">電子郵件</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">role</td>
                        <td className="px-4 py-2 text-sm">ENUM</td>
                        <td className="px-4 py-2 text-sm">角色（admin, user）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">status</td>
                        <td className="px-4 py-2 text-sm">ENUM</td>
                        <td className="px-4 py-2 text-sm">狀態（active, inactive）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">last_login</td>
                        <td className="px-4 py-2 text-sm">TIMESTAMP</td>
                        <td className="px-4 py-2 text-sm">最後登入時間</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">created_at</td>
                        <td className="px-4 py-2 text-sm">TIMESTAMP</td>
                        <td className="px-4 py-2 text-sm">創建時間</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">updated_at</td>
                        <td className="px-4 py-2 text-sm">TIMESTAMP</td>
                        <td className="px-4 py-2 text-sm">更新時間</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="bg-slate-50 px-4 py-2 font-medium border-b">members - 會員表</div>
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">欄位</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">類型</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">說明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-2 text-sm">id</td>
                        <td className="px-4 py-2 text-sm">SERIAL</td>
                        <td className="px-4 py-2 text-sm">主鍵</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">member_id</td>
                        <td className="px-4 py-2 text-sm">VARCHAR(20)</td>
                        <td className="px-4 py-2 text-sm">會員ID，唯一</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">name</td>
                        <td className="px-4 py-2 text-sm">VARCHAR(100)</td>
                        <td className="px-4 py-2 text-sm">姓名</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">phone</td>
                        <td className="px-4 py-2 text-sm">VARCHAR(20)</td>
                        <td className="px-4 py-2 text-sm">電話</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">email</td>
                        <td className="px-4 py-2 text-sm">VARCHAR(100)</td>
                        <td className="px-4 py-2 text-sm">電子郵件</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">address</td>
                        <td className="px-4 py-2 text-sm">TEXT</td>
                        <td className="px-4 py-2 text-sm">地址</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">type</td>
                        <td className="px-4 py-2 text-sm">ENUM</td>
                        <td className="px-4 py-2 text-sm">類型（shareholder, agent, regular）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">agent_id</td>
                        <td className="px-4 py-2 text-sm">INTEGER</td>
                        <td className="px-4 py-2 text-sm">代理ID（外鍵）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">notes</td>
                        <td className="px-4 py-2 text-sm">TEXT</td>
                        <td className="px-4 py-2 text-sm">備註</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">created_by</td>
                        <td className="px-4 py-2 text-sm">INTEGER</td>
                        <td className="px-4 py-2 text-sm">創建者（外鍵）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">created_at</td>
                        <td className="px-4 py-2 text-sm">TIMESTAMP</td>
                        <td className="px-4 py-2 text-sm">創建時間</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">updated_at</td>
                        <td className="px-4 py-2 text-sm">TIMESTAMP</td>
                        <td className="px-4 py-2 text-sm">更新時間</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                查看更多表結構
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

