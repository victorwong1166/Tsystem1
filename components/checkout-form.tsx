"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, CreditCard, DollarSign, Printer } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function CheckoutForm({ onClose, title = "結帳", description = "請確認結帳信息" }) {
  const [date, setDate] = useState(new Date())
  const [totalAmount, setTotalAmount] = useState("12400")
  const [actualAmount, setActualAmount] = useState("12400")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [notes, setNotes] = useState("")
  const [printReceipt, setPrintReceipt] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 模擬API請求
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 實際應用中，這裡會調用API進行結帳
      console.log("結帳數據:", {
        date: format(date, "yyyy-MM-dd"),
        totalAmount,
        actualAmount,
        paymentMethod,
        notes,
        printReceipt,
      })

      toast({
        title: "結算成功",
        description: `已成功結算 $${actualAmount}`,
      })

      // 關閉結帳表單
      onClose()
    } catch (error) {
      toast({
        title: "結算失敗",
        description: "處理結算時發生錯誤，請重試",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="date">結算日期</Label>
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="totalAmount">應收金額 (HKD)</Label>
            <Input
              id="totalAmount"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="bg-gray-100"
              readOnly
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="actualAmount">實收金額 (HKD)</Label>
            <Input
              id="actualAmount"
              type="number"
              value={actualAmount}
              onChange={(e) => setActualAmount(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">支付方式</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="選擇支付方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>現金</span>
                  </div>
                </SelectItem>
                <SelectItem value="bank">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>銀行轉賬</span>
                  </div>
                </SelectItem>
                <SelectItem value="wechat">微信支付</SelectItem>
                <SelectItem value="alipay">支付寶</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">備註</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="輸入備註信息"
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="printReceipt" checked={printReceipt} onCheckedChange={setPrintReceipt} />
            <Label htmlFor="printReceipt" className="cursor-pointer">
              <div className="flex items-center">
                <Printer className="mr-2 h-4 w-4" />
                <span>列印收據</span>
              </div>
            </Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          取消
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "處理中..." : "確認結算"}
        </Button>
      </CardFooter>
    </Card>
  )
}

