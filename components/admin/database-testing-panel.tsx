"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {
  Server,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Table,
  FileText,
  Clock,
  Play,
  Download,
  Upload,
  Trash2,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DatabaseTestingPanel() {
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking")
  const [connectionDetails, setConnectionDetails] = useState<any>(null)
  const [testQuery, setTestQuery] = useState("SELECT NOW() as current_time;")
  const [queryResult, setQueryResult] = useState<any>(null)
  const [isExecutingQuery, setIsExecutingQuery] = useState(false)
  const [testType, setTestType] = useState<"connection" | "query" | "table" | "performance">("connection")
  const [performanceResults, setPerformanceResults] = useState<any>(null)
  const [isRunningPerformanceTest, setIsRunningPerformanceTest] = useState(false)
  const [tableToTest, setTableToTest] = useState("members")
  const [recordCount, setRecordCount] = useState(100)
  const [tableStats, setTableStats] = useState<any>(null)
  const [isLoadingTableStats, setIsLoadingTableStats] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 檢查是否有自定義數據庫連接字符串
  useEffect(() => {
    const customDatabaseUrl = localStorage.getItem("customDatabaseUrl")
    if (customDatabaseUrl) {
      // 如果存在自定義連接字符串，則使用它
      console.log("使用自定義數據庫連接字符串")
      // 這裡可以添加使用自定義連接字符串的邏輯
    }
  }, [])

  // 清除模擬數據
  const clearMockData = async () => {
    if (!confirm("確定要清除所有模擬交易和會員數據嗎？此操作不可撤銷。")) {
      return
    }

    try {
      const response = await fetch("/api/database/clear-mock-data", {
        method: "POST",
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: "清除成功",
          description: `已清除 ${result.deletedMembers} 個模擬會員和 ${result.deletedTransactions} 筆模擬交易`,
        })
      } else {
        toast({
          title: "清除失敗",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "清除失敗",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // 檢查數據庫連接
  const fetchConnectionInfo = async () => {
    setIsLoading(true)
    setError(null)
    setConnectionStatus("checking")
    setConnectionDetails(null)

    try {
      // 檢查是否有自定義連接字符串
      const customDatabaseUrl = localStorage.getItem("customDatabaseUrl")
      let url = "/api/database/connection-info"

      // 如果有自定義連接字符串，則將其添加到請求中
      if (customDatabaseUrl) {
        url += `?connectionString=${encodeURIComponent(customDatabaseUrl)}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.connected) {
        setConnectionStatus("connected")
        setConnectionDetails(data.connectionInfo)
        toast({
          title: "連接成功",
          description: `成功連接到數據庫 ${data.connectionInfo.database || data.connectionInfo.databaseName}`,
        })
      } else {
        setConnectionStatus("error")
        setConnectionDetails({ error: data.error })
        setError(data.error || "未知錯誤")
        toast({
          title: "連接失敗",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Error checking connection:", err)
      setConnectionStatus("error")
      setError(err.message || "發生錯誤")
      toast({
        title: "連接失敗",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 執行測試查詢
  const executeTestQuery = async () => {
    if (!testQuery.trim()) {
      toast({
        title: "查詢為空",
        description: "請輸入SQL查詢語句",
        variant: "destructive",
      })
      return
    }

    setIsExecutingQuery(true)
    setQueryResult(null)

    try {
      // 準備請求頭，如果有自定義連接字符串，則添加到請求頭中
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      const customDatabaseUrl = localStorage.getItem("customDatabaseUrl")
      if (customDatabaseUrl) {
        headers["X-Custom-Database-Url"] = customDatabaseUrl
      }

      const response = await fetch("/api/database/execute-query", {
        method: "POST",
        headers,
        body: JSON.stringify({ query: testQuery }),
      })

      const result = await response.json()

      if (result.success) {
        setQueryResult(result)
        toast({
          title: "查詢執行成功",
          description: `查詢已成功執行，耗時 ${result.duration}`,
        })
      } else {
        setQueryResult({ success: false, error: result.error })
        toast({
          title: "查詢執行失敗",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      setQueryResult({ success: false, error: error.message })
      toast({
        title: "查詢執行失敗",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsExecutingQuery(false)
    }
  }

  // 執行性能測試
  const runPerformanceTest = async () => {
    setIsRunningPerformanceTest(true)
    setPerformanceResults(null)

    try {
      const response = await fetch("/api/database/test-performance")
      const result = await response.json()

      if (result.success) {
        setPerformanceResults(result)
        toast({
          title: "性能測試完成",
          description: "數據庫性能測試已完成",
        })
      } else {
        setPerformanceResults({ success: false, error: result.error })
        toast({
          title: "性能測試失敗",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      setPerformanceResults({ success: false, error: error.message })
      toast({
        title: "性能測試失敗",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsRunningPerformanceTest(false)
    }
  }

  // 獲取表統計信息
  const getTableStats = async () => {
    if (!tableToTest) {
      toast({
        title: "請選擇表",
        description: "請選擇要測試的表",
        variant: "destructive",
      })
      return
    }

    setIsLoadingTableStats(true)
    setTableStats(null)

    try {
      const response = await fetch(`/api/database/table-stats?table=${tableToTest}`)
      const result = await response.json()

      if (result.success) {
        setTableStats(result)
        toast({
          title: "獲取表統計信息成功",
          description: `已獲取 ${tableToTest} 表的統計信息`,
        })
      } else {
        setTableStats({ success: false, error: result.error })
        toast({
          title: "獲取表統計信息失敗",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      setTableStats({ success: false, error: error.message })
      toast({
        title: "獲取表統計信息失敗",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoadingTableStats(false)
    }
  }

  // 生成測試數據
  const generateTestData = async () => {
    if (!tableToTest) {
      toast({
        title: "請選擇表",
        description: "請選擇要生成測試數據的表",
        variant: "destructive",
      })
      return
    }

    if (recordCount <= 0 || recordCount > 1000) {
      toast({
        title: "記錄數無效",
        description: "請輸入1到1000之間的記錄數",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/database/generate-test-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ table: tableToTest, count: recordCount }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "測試數據生成成功",
          description: result.message,
        })

        // 刷新表統計信息
        getTableStats()
      } else {
        toast({
          title: "測試數據生成失敗",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "測試數據生成失敗",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // 初始檢查連接
  useEffect(() => {
    fetchConnectionInfo()
  }, [])

  return (
    <Tabs defaultValue="connection" onValueChange={(value) => setTestType(value as any)}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="connection">連接測試</TabsTrigger>
        <TabsTrigger value="query">查詢測試</TabsTrigger>
        <TabsTrigger value="table">表測試</TabsTrigger>
        <TabsTrigger value="performance">性能測試</TabsTrigger>
      </TabsList>

      {/* 連接測試 */}
      <TabsContent value="connection">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5 text-blue-500" />
              數據庫連接測試
            </CardTitle>
            <CardDescription>測試與數據庫的連接並查看連接詳細信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium">連接狀態:</div>
                {connectionStatus === "checking" && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
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
              <Button onClick={fetchConnectionInfo} size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                重新檢查
              </Button>
            </div>

            {connectionStatus === "checking" && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}

            {connectionStatus === "connected" && connectionDetails && (
              <div className="rounded-md bg-slate-50 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">數據庫名稱</div>
                    <div className="text-sm">{connectionDetails.database || connectionDetails.databaseName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">數據庫時間</div>
                    <div className="text-sm">{new Date(connectionDetails.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">數據庫版本</div>
                  <div className="text-sm">{connectionDetails.version}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">響應時間</div>
                  <div className="text-sm">{connectionDetails.responseTime}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">連接字符串</div>
                  <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {process.env.DATABASE_URL
                      ? `${process.env.DATABASE_URL.split("@")[0].split(":")[0]}:****@${process.env.DATABASE_URL.split("@")[1]}`
                      : "環境變量中未設置 DATABASE_URL"}
                  </div>
                </div>
              </div>
            )}

            {/* 自行連接數據庫 */}
            <div className="mt-4 rounded-md bg-white border border-gray-200 p-4 space-y-3">
              <h3 className="text-md font-medium text-gray-700">自行連接數據庫</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="custom-host" className="block text-sm font-medium text-gray-500">
                    主機
                  </label>
                  <input
                    type="text"
                    id="custom-host"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="例如: localhost 或 db.example.com"
                  />
                </div>
                <div>
                  <label htmlFor="custom-port" className="block text-sm font-medium text-gray-500">
                    端口
                  </label>
                  <input
                    type="text"
                    id="custom-port"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="例如: 5432"
                    defaultValue="5432"
                  />
                </div>
                <div>
                  <label htmlFor="custom-database" className="block text-sm font-medium text-gray-500">
                    數據庫名稱
                  </label>
                  <input
                    type="text"
                    id="custom-database"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="例如: postgres"
                  />
                </div>
                <div>
                  <label htmlFor="custom-user" className="block text-sm font-medium text-gray-500">
                    用戶名
                  </label>
                  <input
                    type="text"
                    id="custom-user"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="例如: postgres"
                  />
                </div>
                <div>
                  <label htmlFor="custom-password" className="block text-sm font-medium text-gray-500">
                    密碼
                  </label>
                  <input
                    type="password"
                    id="custom-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="custom-ssl" className="block text-sm font-medium text-gray-500">
                    SSL 模式
                  </label>
                  <select
                    id="custom-ssl"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="require">require</option>
                    <option value="prefer">prefer</option>
                    <option value="disable">disable</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    const host = (document.getElementById("custom-host") as HTMLInputElement).value
                    const port = (document.getElementById("custom-port") as HTMLInputElement).value
                    const database = (document.getElementById("custom-database") as HTMLInputElement).value
                    const user = (document.getElementById("custom-user") as HTMLInputElement).value
                    const password = (document.getElementById("custom-password") as HTMLInputElement).value
                    const ssl = (document.getElementById("custom-ssl") as HTMLSelectElement).value

                    const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}?sslmode=${ssl}`

                    // 將連接字符串存儲到 localStorage 中，以便在頁面刷新後仍然可用
                    localStorage.setItem("customDatabaseUrl", connectionString)

                    // 重新加載頁面以使用新的連接字符串
                    window.location.reload()
                  }}
                >
                  連接數據庫
                </button>
              </div>
            </div>

            {connectionStatus === "error" && connectionDetails && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>連接錯誤</AlertTitle>
                <AlertDescription>{connectionDetails.error}</AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border p-4">
              <h4 className="text-sm font-medium mb-2">連接測試選項</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeout" className="text-sm">
                      連接超時（秒）
                    </Label>
                    <Input id="timeout" type="number" defaultValue={10} min={1} max={60} />
                  </div>
                  <div>
                    <Label htmlFor="retries" className="text-sm">
                      重試次數
                    </Label>
                    <Input id="retries" type="number" defaultValue={3} min={0} max={10} />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    導出連接報告
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    測試連接池
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-gray-500">數據庫連接使用 Neon PostgreSQL 和 Drizzle ORM</div>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* 查詢測試 */}
      <TabsContent value="query">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-500" />
              SQL查詢測試
            </CardTitle>
            <CardDescription>測試SQL查詢並查看結果</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>注意</AlertTitle>
              <AlertDescription>這是測試環境，請謹慎執行修改數據的操作。建議使用SELECT查詢進行測試。</AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Textarea
                placeholder="輸入SQL查詢..."
                className="font-mono text-sm h-40"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
              />
              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button onClick={() => setTestQuery("SELECT NOW() as current_time;")} variant="outline" size="sm">
                    時間查詢
                  </Button>
                  <Button onClick={() => setTestQuery("SELECT * FROM members LIMIT 5;")} variant="outline" size="sm">
                    會員查詢
                  </Button>
                  <Button
                    onClick={() => setTestQuery("SELECT * FROM transactions LIMIT 5;")}
                    variant="outline"
                    size="sm"
                  >
                    交易查詢
                  </Button>
                </div>
                <Button
                  onClick={executeTestQuery}
                  disabled={isExecutingQuery || !testQuery.trim() || connectionStatus !== "connected"}
                >
                  {isExecutingQuery ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      執行中...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      執行查詢
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isExecutingQuery && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}

            {queryResult && (
              <div className="rounded-md border p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">查詢結果</h4>
                  {queryResult.success && (
                    <div className="text-sm text-gray-500">
                      {queryResult.data ? <>返回 {queryResult.rowCount} 行</> : <>影響 {queryResult.rowCount} 行</>}
                      <span className="ml-2">耗時: {queryResult.duration}</span>
                    </div>
                  )}
                </div>

                {queryResult.success ? (
                  <div>
                    {queryResult?.data && Array.isArray(queryResult.data) && queryResult.data.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {queryResult.data[0] &&
                                Object.keys(queryResult.data[0]).map((key) => (
                                  <th
                                    key={key}
                                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {key}
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {queryResult?.data &&
                              Array.isArray(queryResult.data) &&
                              queryResult.data.map((row, i) => (
                                <tr key={i}>
                                  {row &&
                                    Object.values(row).map((value, j) => (
                                      <td key={j} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {value === null ? <span className="text-gray-400">NULL</span> : String(value)}
                                      </td>
                                    ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-sm text-green-600 font-medium">查詢執行成功，無返回數據</div>
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

      {/* 表測試 */}
      <TabsContent value="table">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Table className="mr-2 h-5 w-5 text-blue-500" />
              數據表測試
            </CardTitle>
            <CardDescription>測試數據表結構和生成測試數據</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="table-select" className="text-sm">
                  選擇表
                </Label>
                <Select value={tableToTest} onValueChange={setTableToTest}>
                  <SelectTrigger id="table-select">
                    <SelectValue placeholder="選擇表" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="members">會員表 (members)</SelectItem>
                    <SelectItem value="transactions">交易表 (transactions)</SelectItem>
                    <SelectItem value="users">用戶表 (users)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={getTableStats} disabled={isLoadingTableStats || !tableToTest}>
                  {isLoadingTableStats ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      加載中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      獲取表信息
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isLoadingTableStats ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : tableStats ? (
              <div className="space-y-4">
                <div className="rounded-md bg-slate-50 p-4">
                  <h4 className="text-sm font-medium mb-2">表信息</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">表名</div>
                      <div className="text-sm">{tableStats.tableName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">記錄數</div>
                      <div className="text-sm">{tableStats.rowCount}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">列數</div>
                      <div className="text-sm">{tableStats.columnCount}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">磁盤大小</div>
                      <div className="text-sm">{tableStats.sizeOnDisk}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">索引數</div>
                      <div className="text-sm">{tableStats.indexCount}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">最後更新</div>
                      <div className="text-sm">{new Date(tableStats.lastUpdated).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="bg-slate-50 px-4 py-2 font-medium border-b">樣本數據</div>
                  <div className="p-4">
                    {tableStats?.sampleData &&
                    Array.isArray(tableStats.sampleData) &&
                    tableStats.sampleData.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {tableStats.sampleData[0] &&
                                Object.keys(tableStats.sampleData[0]).map((key) => (
                                  <th
                                    key={key}
                                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {key}
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {tableStats?.sampleData &&
                              Array.isArray(tableStats.sampleData) &&
                              tableStats.sampleData.map((row, i) => (
                                <tr key={i}>
                                  {row &&
                                    Object.values(row).map((value, j) => (
                                      <td key={j} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {value === null ? <span className="text-gray-400">NULL</span> : String(value)}
                                      </td>
                                    ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">無樣本數據</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {tableToTest ? <p>點擊"獲取表信息"按鈕查看表統計信息</p> : <p>請選擇一個表</p>}
              </div>
            )}

            <div className="rounded-md border p-4">
              <h4 className="text-sm font-medium mb-2">生成測試數據</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="record-count" className="text-sm">
                      記錄數量
                    </Label>
                    <Input
                      id="record-count"
                      type="number"
                      value={recordCount}
                      onChange={(e) => setRecordCount(Number.parseInt(e.target.value) || 0)}
                      min={1}
                      max={1000}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={generateTestData}
                      disabled={!tableToTest || recordCount <= 0 || recordCount > 1000}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      生成測試數據
                    </Button>
                  </div>
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>注意</AlertTitle>
                  <AlertDescription>
                    生成測試數據將向選定的表中添加隨機生成的記錄。請確保這是在測試環境中進行。
                  </AlertDescription>
                </Alert>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    清空表數據
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    導出表結構
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearMockData()}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    清除所有模擬數據
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 性能測試 */}
      <TabsContent value="performance">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-green-500" />
              數據庫性能測試
            </CardTitle>
            <CardDescription>測試數據庫性能和響應時間</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>注意</AlertTitle>
              <AlertDescription>性能測試會執行多個查詢以測試數據庫性能。這可能會暫時增加數據庫負載。</AlertDescription>
            </Alert>

            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">性能測試選項</h4>
              <Button
                onClick={runPerformanceTest}
                disabled={isRunningPerformanceTest || connectionStatus !== "connected"}
              >
                {isRunningPerformanceTest ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    測試中...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    開始性能測試
                  </>
                )}
              </Button>
            </div>

            {isRunningPerformanceTest ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : performanceResults ? (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="bg-slate-50 px-4 py-2 font-medium border-b">測試結果</div>
                  <div className="p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">測試名稱</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">耗時</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {performanceResults?.tests &&
                          Array.isArray(performanceResults.tests) &&
                          performanceResults.tests.map((test, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2 text-sm">{test.name}</td>
                              <td className="px-4 py-2 text-sm">{test.duration}</td>
                              <td className="px-4 py-2 text-sm">
                                {test.status === "success" && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    成功
                                  </Badge>
                                )}
                                {test.status === "warning" && (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                    警告
                                  </Badge>
                                )}
                                {test.status === "error" && (
                                  <Badge variant="outline" className="bg-red-100 text-red-800">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    錯誤
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-md bg-slate-50 p-4">
                  <h4 className="text-sm font-medium mb-2">測試摘要</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">總測試數</div>
                      <div className="text-sm">{performanceResults.summary?.totalTests}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">通過測試數</div>
                      <div className="text-sm">{performanceResults.summary?.passedTests}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">警告測試數</div>
                      <div className="text-sm">{performanceResults.summary?.warningTests}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">失敗測試數</div>
                      <div className="text-sm">{performanceResults.summary?.failedTests}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">平均耗時</div>
                      <div className="text-sm">{performanceResults.summary?.averageDuration}</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    導出測試報告
                  </Button>
                  <Button variant="outline" size="sm" onClick={runPerformanceTest}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    重新測試
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>點擊"開始性能測試"按鈕開始測試數據庫性能</p>
              </div>
            )}

            <div className="rounded-md border p-4">
              <h4 className="text-sm font-medium mb-2">自定義性能測試</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="test-iterations" className="text-sm">
                      測試迭代次數
                    </Label>
                    <Input id="test-iterations" type="number" defaultValue={5} min={1} max={20} />
                  </div>
                  <div>
                    <Label htmlFor="test-timeout" className="text-sm">
                      測試超時（秒）
                    </Label>
                    <Input id="test-timeout" type="number" defaultValue={30} min={5} max={120} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="test-read" defaultChecked />
                    <Label htmlFor="test-read" className="text-sm">
                      讀取測試
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="test-write" defaultChecked />
                    <Label htmlFor="test-write" className="text-sm">
                      寫入測試
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="test-transaction" defaultChecked />
                    <Label htmlFor="test-transaction" className="text-sm">
                      事務測試
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="test-index" defaultChecked />
                    <Label htmlFor="test-index" className="text-sm">
                      索引測試
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-gray-500">性能測試結果僅供參考，實際性能可能因數據量和服務器負載而異</div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

