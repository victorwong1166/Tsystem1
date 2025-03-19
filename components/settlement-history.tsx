"use client"

import { useState, useEffect } from "react"
import { Printer, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface SettlementHistoryProps {
  searchParams: {
    startDate: string
    endDate: string
    keyword: string
  }
}

// 模擬結算數據
const mockSettlements = [
  {
    id: 1,
    date: "2025-03-17",
    time: "06:33",
    venue: "WW 新场",
    version: "第31更",
    totalAmount: 196300,
    status: "completed",
    notes: "正常結算",
  },
  {
    id: 2,
    date: "2025-03-16",
    time: "22:15",
    venue: "WW 新场",
    version: "第30更",
    totalAmount: 152800,
    status: "completed",
    notes: "",
  },
  {
    id: 3,
    date: "2025-03-16",
    time: "14:20",
    venue: "WW 新场",
    version: "第29更",
    totalAmount: -50500,
    status: "completed",
    notes: "虧損結算",
  },
  {
    id: 4,
    date: "2025-03-15",
    time: "23:45",
    venue: "WW 新场",
    version: "第28更",
    totalAmount: 42800,
    status: "completed",
    notes: "",
  },
  {
    id: 5,
    date: "2025-03-15",
    time: "15:30",
    venue: "WW 新场",
    version: "第27更",
    totalAmount: 78600,
    status: "completed",
    notes: "",
  },
]

export function SettlementHistory({ searchParams }: SettlementHistoryProps) {
  const [settlements, setSettlements] = useState(mockSettlements)
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 模擬搜索過濾
  useEffect(() => {
    let filtered = [...mockSettlements]

    if (searchParams.startDate) {
      filtered = filtered.filter((s) => s.date >= searchParams.startDate)
    }

    if (searchParams.endDate) {
      filtered = filtered.filter((s) => s.date <= searchParams.endDate)
    }

    if (searchParams.keyword) {
      const keyword = searchParams.keyword.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.venue.toLowerCase().includes(keyword) ||
          s.notes.toLowerCase().includes(keyword) ||
          s.version.toLowerCase().includes(keyword),
      )
    }

    setSettlements(filtered)
  }, [searchParams])

  const handleViewDetails = (settlement: any) => {
    setSelectedSettlement(settlement)
    setIsDialogOpen(true)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("zh-HK").format(amount)
  }

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead>時間</TableHead>
              <TableHead>場次</TableHead>
              <TableHead>版本</TableHead>
              <TableHead className="text-right">上下水</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>備註</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settlements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  沒有找到結算記錄
                </TableCell>
              </TableRow>
            ) : (
              settlements.map((settlement) => (
                <TableRow key={settlement.id}>
                  <TableCell>{settlement.date}</TableCell>
                  <TableCell>{settlement.time}</TableCell>
                  <TableCell>{settlement.venue}</TableCell>
                  <TableCell>{settlement.version}</TableCell>
                  <TableCell className={`text-right font-medium ${getAmountColor(settlement.totalAmount)}`}>
                    {formatAmount(settlement.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      已完成
                    </Badge>
                  </TableCell>
                  <TableCell>{settlement.notes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(settlement)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>結算詳情</DialogTitle>
          </DialogHeader>

          {selectedSettlement && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">日期時間</p>
                  <p className="font-medium">
                    {selectedSettlement.date} {selectedSettlement.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">場次</p>
                  <p className="font-medium">
                    {selectedSettlement.venue} {selectedSettlement.version}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-4 text-left font-medium border-b">項目</th>
                      <th className="py-2 px-4 text-right font-medium border-b">金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b">上下水</td>
                      <td
                        className={`py-2 px-4 text-right border-b font-medium ${getAmountColor(selectedSettlement.totalAmount)}`}
                      >
                        {formatAmount(selectedSettlement.totalAmount)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">碼房輸贏</td>
                      <td className="py-2 px-4 text-right border-b font-medium text-green-600">
                        {formatAmount(selectedSettlement.totalAmount * 1.12)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">朱盤誤差</td>
                      <td className="py-2 px-4 text-right border-b font-medium">0</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">碼糧</td>
                      <td className="py-2 px-4 text-right border-b font-medium text-red-600">{formatAmount(-6800)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">人工</td>
                      <td className="py-2 px-4 text-right border-b font-medium text-red-600">{formatAmount(-6700)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">雜費</td>
                      <td className="py-2 px-4 text-right border-b font-medium text-red-600">{formatAmount(-9500)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">利是</td>
                      <td className="py-2 px-4 text-right border-b font-medium">0</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">場租&系統</td>
                      <td className="py-2 px-4 text-right border-b font-medium">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-4 text-left font-medium border-b"></th>
                      <th className="py-2 px-4 text-center font-medium border-b">開波</th>
                      <th className="py-2 px-4 text-center font-medium border-b">結帳</th>
                      <th className="py-2 px-4 text-center font-medium border-b"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b">銀頭</td>
                      <td className="py-2 px-4 text-center border-b">0</td>
                      <td className="py-2 px-4 text-center border-b">19,100</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">19,100</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">存款</td>
                      <td className="py-2 px-4 text-center border-b">-208,700</td>
                      <td className="py-2 px-4 text-center border-b">-238,700</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">30,000</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">欠款</td>
                      <td className="py-2 px-4 text-center border-b">122,100</td>
                      <td className="py-2 px-4 text-center border-b">329,300</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">207,200</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-4 text-left font-medium border-b">日期</th>
                      <th className="py-2 px-4 text-center font-medium border-b">總份數</th>
                      <th className="py-2 px-4 text-center font-medium border-b">上下水</th>
                      <th className="py-2 px-4 text-center font-medium border-b">1份</th>
                      <th className="py-2 px-4 text-center font-medium border-b">0.5份</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b">3月14日</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">10</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">42,800</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">4,280</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">2,140</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">3月15日</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">10</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-red-600">-50,500</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-red-600">-5,050</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-red-600">-2,525</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">3月16日</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">10</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">196,300</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">19,630</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">9,815</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="py-2 px-4 border-b font-medium">總計</td>
                      <td className="py-2 px-4 text-center border-b"></td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">188,600</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">18,860</td>
                      <td className="py-2 px-4 text-center border-b font-medium text-green-600">9,430</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  列印
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  下載
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

