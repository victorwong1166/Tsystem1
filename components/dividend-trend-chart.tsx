"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

// 使用與dividend-history.tsx相同的模擬數據
const dividendHistory = [
  {
    id: "DIV001",
    date: "2023-05-15",
    totalProfit: 25650,
    totalShares: 10,
    dividendPerShare: 2565,
    dividendPerHalfShare: 1282.5,
    status: "已分配",
    isLoss: false,
  },
  {
    id: "DIV002",
    date: "2023-05-12",
    totalProfit: 18200,
    totalShares: 10,
    dividendPerShare: 1820,
    dividendPerHalfShare: 910,
    status: "已分配",
    isLoss: false,
  },
  {
    id: "DIV003",
    date: "2023-05-09",
    totalProfit: -8500,
    totalShares: 10,
    dividendPerShare: -850,
    dividendPerHalfShare: -425,
    status: "已分攤",
    isLoss: true,
  },
  {
    id: "DIV004",
    date: "2023-05-06",
    totalProfit: 15800,
    totalShares: 10,
    dividendPerShare: 1580,
    dividendPerHalfShare: 790,
    status: "已分配",
    isLoss: false,
  },
  {
    id: "DIV005",
    date: "2023-05-03",
    totalProfit: 22300,
    totalShares: 10,
    dividendPerShare: 2230,
    dividendPerHalfShare: 1115,
    status: "已分配",
    isLoss: false,
  },
  {
    id: "DIV006",
    date: "2023-04-30",
    totalProfit: -5200,
    totalShares: 10,
    dividendPerShare: -520,
    dividendPerHalfShare: -260,
    status: "已分攤",
    isLoss: true,
  },
  {
    id: "DIV007",
    date: "2023-04-27",
    totalProfit: 19500,
    totalShares: 10,
    dividendPerShare: 1950,
    dividendPerHalfShare: 975,
    status: "已分配",
    isLoss: false,
  },
  {
    id: "DIV008",
    date: "2023-04-24",
    totalProfit: 17800,
    totalShares: 10,
    dividendPerShare: 1780,
    dividendPerHalfShare: 890,
    status: "已分配",
    isLoss: false,
  },
]

// 為圖表準備數據
const prepareChartData = (data) => {
  // 按日期排序，從舊到新
  return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export default function DividendTrendChart() {
  const [chartView, setChartView] = useState("profit")

  // 準備圖表數據
  const chartData = prepareChartData(dividendHistory)

  // 計算累計盈利
  let cumulativeProfit = 0
  const cumulativeData = chartData.map((item) => {
    cumulativeProfit += item.totalProfit
    return {
      ...item,
      cumulativeProfit,
    }
  })

  // 自定義工具提示
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{`日期: ${label}`}</p>
          {chartView === "profit" ? (
            <>
              <p className="text-sm">
                <span className={payload[0].value >= 0 ? "text-green-600" : "text-red-600"}>
                  {`盈利: ${payload[0].value >= 0 ? "+" : ""}${payload[0].value.toLocaleString()}`}
                </span>
              </p>
              <p className="text-sm">
                <span className={payload[1].value >= 0 ? "text-purple-600" : "text-red-600"}>
                  {`累計: ${payload[1].value >= 0 ? "+" : ""}${payload[1].value.toLocaleString()}`}
                </span>
              </p>
            </>
          ) : (
            <p className="text-sm">
              <span className={payload[0].value >= 0 ? "text-green-600" : "text-red-600"}>
                {`每股分紅: ${payload[0].value >= 0 ? "+" : ""}${payload[0].value.toLocaleString()}`}
              </span>
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
            分紅走勢圖
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profit" onValueChange={setChartView} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profit">盈利走勢</TabsTrigger>
            <TabsTrigger value="dividend">分紅走勢</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {chartView === "profit" ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="totalProfit"
                    name="單次盈利"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="cumulativeProfit" name="累計盈利" stroke="#8b5cf6" strokeWidth={2} />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="dividendPerShare"
                  name="每股分紅"
                  stroke="#8b5cf6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>* 圖表顯示了歷史分紅趨勢，可切換查看盈利走勢或每股分紅走勢</p>
        </div>
      </CardContent>
    </Card>
  )
}

