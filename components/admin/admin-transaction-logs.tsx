"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Download, Eye, Filter, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// 模擬交易日誌數據
const mockTransactionLogs = [
  {
    id: "TL001",
    userId: "U001",
    username: "admin",
    action: "login",
    details: "管理員登入系統",
    ip: "192.168.1.100",
    timestamp: "2023-05-20 14:30:15",
  },
  {
    id: "TL002",
    userId: "U003",
    username: "operator1",
    action: "create",
    details: "創建新會員 (ID: M128)",
    ip: "192.168.1.101",
    timestamp: "2023-05-20 10:45:22",
  },
  {
    id: "TL003",
    userId: "U002",
    username: "manager",
    action: "update",
    details: "更新會員資料 (ID: M120)",
    ip: "192.168.1.102",
    timestamp: "2023-05-19 16:12:45",
  },
  {
    id: "TL004",
    userId: "U003",
    username: "operator1",
    action: "transaction",
    details: "記錄交易 (買碼 $5000, 會員: M115)",
    ip: "192.168.1.101",
    timestamp: "2023-05-19 11:30:18",
  },
  {
    id: "TL005",
    userId: "U002",
    username: "manager",
    action: "dividend",
    details: "執行分紅操作 (總額: $25,650)",
    ip: "192.168.1.102",
    timestamp: "2023-05-18 18:05:33",
  },
  {
    id: "TL006",
    userId: "U001",
    username: "admin",
    action: "system",
    details: "系統備份操作",
    ip: "192.168.1.100",
    timestamp: "2023-05-18 03:00:00",
  },
  {
    id: "TL007",
    userId: "U004",
    username: "operator2",
    action: "login",
    details: "操作員登入系統",
    ip: "192.168.1.103",
    timestamp: "2023-05-17 09:15:42",
  },
  {
    id: "TL008",
    userId: "U003",
    username: "operator1",
    action: "transaction",
    details: "記錄交易 (兌碼 $3000, 會員: M110)",
    ip: "192.168.1.101",
    timestamp: "2023-05-17 14:22:51",
  },
  {
    id: "TL009",
    userId: "U002",
    username: "manager",
    action: "update",
    details: "更新系統設置",
    ip: "192.168.1.102",
    timestamp: "2023-05-16 10:40:15",
  },
  {
    id: "TL010",
    userId: "U001",
    username: "admin",
    action: "system",
    details: "執行系統維護",
    ip: "192.168.1.100",
    timestamp: "2023-05-15 22:30:00",
  },
]

export default function AdminTransactionLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLog, setSelectedLog] = useState(null)
  const [isLogDetailsOpen, setIsLogDetailsOpen] = useState(false)
  const [actionFilter, setActionFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  // 過濾日誌
  const filteredLogs = mockTransactionLogs.filter((log) => {
    // 搜索詞過濾
    const matchesSearch =
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())

    // 動作類型過濾
    const matchesAction = actionFilter === "all" || log.action === actionFilter

    // 日期範圍過濾
    let matchesDate = true
    if (dateRange.from) {
      const logDate = new Date(log.timestamp.split(" ")[0])
      matchesDate = logDate >= dateRange.from

      if (dateRange.to) {
        matchesDate = matchesDate && logDate <= dateRange.to
      }
    }

    return matchesSearch && matchesAction && matchesDate
  })

  const handleViewLogDetails = (log) => {
    setSelectedLog(log)
    setIsLogDetailsOpen(true)
  }

  const getActionBadge = (action) => {
    switch (action) {
      case "login":
        return <Badge variant="outline">登入</Badge>
      case "create":
        return <Badge variant="success">創建</Badge>
      case "update":
        return <Badge variant="secondary">更新</Badge>
      case "transaction":
        return <Badge variant="default">交易</Badge>
      case "dividend":
        return (
          <Badge variant="purple" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            分紅
          </Badge>
        )
      case "system":
        return <Badge variant="destructive">系統</Badge>
      default:
        return <Badge>{action}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>交易日誌</CardTitle>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            導出日誌
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
            <div className="flex-1 space-y-2">
              <Label>搜索</Label>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="搜索日誌..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-2">
              <Label>動作類型</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="所有類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有類型</SelectItem>
                  <SelectItem value="login">登入</SelectItem>
                  <SelectItem value="create">創建</SelectItem>
                  <SelectItem value="update">更新</SelectItem>
                  <SelectItem value="transaction">交易</SelectItem>
                  <SelectItem value="dividend">分紅</SelectItem>
                  <SelectItem value="system">系統</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-64 space-y-2">
              <Label>日期範圍</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from
                      ? dateRange.to
                        ? `${format(dateRange.from, "yyyy-MM-dd")} 至 ${format(dateRange.to, "yyyy-MM-dd")}`
                        : format(dateRange.from, "yyyy-MM-dd")
                      : "選擇日期範圍"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
                  <div className="flex items-center justify-between p-3 border-t">
                    <Button variant="ghost" size="sm" onClick={() => setDateRange({ from: null, to: null })}>
                      清除
                    </Button>
                    <Button size="sm" onClick={() => document.body.click()}>
                      應用
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              className="md:self-end"
              onClick={() => {
                setSearchTerm("")
                setActionFilter("all")
                setDateRange({ from: null, to: null })
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              重置過濾器
            </Button>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">用戶</th>
                  <th className="px-4 py-3">動作</th>
                  <th className="px-4 py-3">詳情</th>
                  <th className="px-4 py-3">IP地址</th>
                  <th className="px-4 py-3">時間</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b text-sm">
                    <td className="px-4 py-3">{log.id}</td>
                    <td className="px-4 py-3">{log.username}</td>
                    <td className="px-4 py-3">{getActionBadge(log.action)}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{log.details}</td>
                    <td className="px-4 py-3">{log.ip}</td>
                    <td className="px-4 py-3">{log.timestamp}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" onClick={() => handleViewLogDetails(log)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">查看</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="h-8 w-8 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">無匹配結果</h3>
              <p className="text-sm text-gray-500">嘗試調整搜索條件或過濾器</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 日誌詳情對話框 */}
      <Dialog open={isLogDetailsOpen} onOpenChange={setIsLogDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>日誌詳情</DialogTitle>
            <DialogDescription>查看完整日誌信息</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p>{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">時間</p>
                  <p>{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">用戶ID</p>
                  <p>{selectedLog.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">用戶名</p>
                  <p>{selectedLog.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">IP地址</p>
                  <p>{selectedLog.ip}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">動作</p>
                  <p>{getActionBadge(selectedLog.action)}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">詳情</p>
                <div className="mt-1 rounded-md bg-gray-100 p-3">
                  <p>{selectedLog.details}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

