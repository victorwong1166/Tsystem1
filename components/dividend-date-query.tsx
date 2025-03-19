"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import { CalendarIcon, PieChart } from "lucide-react"

export default function DividendDateQuery() {
  const [date, setDate] = useState(new Date())

  // 計算下一次結算日期（每三天結算一次）
  const nextSettlementDate = addDays(new Date(), 3 - (new Date().getDate() % 3))

  // 計算未來的幾次分紅日期
  const futureDates = [
    nextSettlementDate,
    addDays(nextSettlementDate, 3),
    addDays(nextSettlementDate, 6),
    addDays(nextSettlementDate, 9),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="mr-2 h-5 w-5 text-purple-500" />
          分紅日期查詢
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">日曆查詢</h3>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">即將到來的分紅日期</h3>
            <ul className="space-y-2">
              {futureDates.map((date, index) => (
                <li key={index} className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-purple-500 mr-2" />
                  <span className={index === 0 ? "font-medium text-purple-700" : ""}>
                    {format(date, "yyyy-MM-dd")}
                    {index === 0 && " (下次分紅)"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">分紅規則</h3>
            <p className="text-sm text-gray-600">
              系統每三天進行一次分紅結算，根據當前盈利情況向股東分配利潤。 如有虧損，股東需按份數比例補回虧損金額。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

