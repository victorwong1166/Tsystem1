"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { CalendarIcon, Calculator } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DividendForm() {
  const [date, setDate] = useState(new Date())
  const [totalProfit, setTotalProfit] = useState("25650")
  const [totalShares, setTotalShares] = useState("10")
  const [shareUnit, setShareUnit] = useState("1")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculationTab, setCalculationTab] = useState("auto")

  // 計算下一次結算日期（每三天結算一次）
  const nextSettlementDate = addDays(new Date(), 3 - (new Date().getDate() % 3))

  // Modify the displayDividend calculation to handle negative values
  // Calculate each share's dividend or loss contribution
  const dividendPerShare = Number.parseFloat(totalProfit) / Number.parseFloat(totalShares)
  const dividendPerHalfShare = dividendPerShare / 2

  // Determine if this is a profit or loss
  const isLoss = Number.parseFloat(totalProfit) < 0

  // Based on selected unit, display dividend or loss contribution
  const displayDividend = shareUnit === "1" ? dividendPerShare : dividendPerHalfShare

  // Update the form submission handler to handle losses
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 模擬API請求
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 實際應用中，這裡會調用API進行分紅或虧損分攤
      console.log("分紅/虧損數據:", {
        date: format(date, "yyyy-MM-dd"),
        totalProfit,
        totalShares,
        shareUnit,
        dividendPerUnit: displayDividend,
        isLoss,
      })

      if (isLoss) {
        toast({
          title: "虧損分攤成功",
          description: `已成功分攤虧損 $${Math.abs(Number.parseFloat(totalProfit)).toFixed(2)}，每${shareUnit}股需補回 $${Math.abs(displayDividend).toFixed(2)}`,
        })
      } else {
        toast({
          title: "分紅成功",
          description: `已成功分配盈利 $${totalProfit}，每${shareUnit}股獲得 $${displayDividend.toFixed(2)}`,
        })
      }

      // 重置表單
      setTotalProfit("")
    } catch (error) {
      toast({
        title: isLoss ? "虧損分攤失敗" : "分紅失敗",
        description: "處理時發生錯誤，請重試",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5 text-purple-500" />
          分紅計算
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="date">分紅日期</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "yyyy-MM-dd") : "選擇日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">下次結算日期: {format(nextSettlementDate, "yyyy-MM-dd")}</p>
          </div>

          <Tabs defaultValue="auto" onValueChange={setCalculationTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="auto">自動計算</TabsTrigger>
              <TabsTrigger value="manual">手動輸入</TabsTrigger>
            </TabsList>
            <TabsContent value="auto">
              <div className="grid gap-2 mt-2">
                <Label>當前盈利 (自動計算)</Label>
                <Input type="text" value={`$${totalProfit}`} className="bg-gray-50" readOnly />
                <p className="text-xs text-muted-foreground">系統自動計算的當前盈利總額</p>
              </div>
            </TabsContent>
            <TabsContent value="manual">
              <div className="grid gap-2 mt-2">
                <Label htmlFor="totalProfit">盈利金額 (HKD)</Label>
                <Input
                  id="totalProfit"
                  type="number"
                  value={totalProfit}
                  onChange={(e) => setTotalProfit(e.target.value)}
                  required
                  min="0"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-2">
            <Label htmlFor="totalShares">總份數</Label>
            <Input
              id="totalShares"
              type="number"
              value={totalShares}
              onChange={(e) => setTotalShares(e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="grid gap-2">
            <Label>分紅單位</Label>
            <RadioGroup value={shareUnit} onValueChange={setShareUnit} className="flex">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="unit-1" />
                <Label htmlFor="unit-1" className="cursor-pointer">
                  每1股
                </Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="0.5" id="unit-0.5" />
                <Label htmlFor="unit-0.5" className="cursor-pointer">
                  每0.5股
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Update the preview section to show profit or loss */}
          <div className="rounded-md bg-purple-50 p-4 mt-4">
            <div className="font-medium text-purple-800">{isLoss ? "虧損分攤預覽" : "分紅預覽"}</div>
            <div className={`mt-2 text-2xl font-bold ${isLoss ? "text-red-600" : "text-purple-700"}`}>
              {isLoss ? "-" : "+"}${Math.abs(displayDividend).toFixed(2)}{" "}
              <span className="text-sm font-normal">/ 每{shareUnit}股</span>
            </div>
            <div className={`mt-1 text-sm ${isLoss ? "text-red-500" : "text-purple-600"}`}>
              {isLoss ? "總虧損" : "總分紅"}: ${Math.abs(Number.parseFloat(totalProfit)).toFixed(2)}
            </div>
            {isLoss && <div className="mt-2 text-sm text-red-500 font-medium">股東需按份數比例補回虧損金額</div>}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        {/* Update the button text and color based on profit/loss */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full ${isLoss ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}
        >
          {isSubmitting ? "處理中..." : isLoss ? "確認虧損分攤" : "確認分紅"}
        </Button>
      </CardFooter>
    </Card>
  )
}

