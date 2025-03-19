import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import DividendHistory from "@/components/dividend-history"
import DividendDateQuery from "@/components/dividend-date-query"
import DividendTrendChart from "@/components/dividend-trend-chart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "交易系統 - 股東分紅",
  description: "交易系統股東分紅",
}

export default function DividendsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回儀表板
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">股東分紅記錄</h1>
          <p className="mt-2 text-gray-500">查看分紅歷史記錄及下次分紅日期</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <DividendDateQuery />
          </div>
          <div className="md:col-span-2">
            <div className="space-y-6">
              <DividendTrendChart />
              <DividendHistory />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

