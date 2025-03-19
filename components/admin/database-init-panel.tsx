"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function DatabaseInitPanel() {
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [tablesStatus, setTablesStatus] = useState<any>(null)
  const [initResult, setInitResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const checkTables = async () => {
    setLoading(true)
    setError(null)
    setErrorDetails(null)

    try {
      const response = await fetch("/api/database/initialize")
      const data = await response.json()

      if (data.success) {
        setTablesStatus(data.tablesStatus)
      } else {
        setError(data.error || "檢查數據庫表時出錯")
        setErrorDetails(data.details || null)
      }
    } catch (err) {
      setError("檢查數據庫表時出錯: " + (err.message || "未知錯誤"))
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setInitializing(true)
    setError(null)
    setErrorDetails(null)
    setInitResult(null)

    try {
      const response = await fetch("/api/database/initialize", {
        method: "POST",
      })
      const data = await response.json()

      setInitResult(data)

      if (data.success) {
        // 重新檢查表狀態
        await checkTables()
      } else {
        setError(data.message || "初始化數據庫時出錯")
        setErrorDetails(data.details || null)
      }
    } catch (err) {
      setError("初始化數據庫時出錯: " + (err.message || "未知錯誤"))
    } finally {
      setInitializing(false)
    }
  }

  useEffect(() => {
    checkTables()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>數據庫初始化</CardTitle>
        <CardDescription>檢查並初始化數據庫表結構</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>錯誤</AlertTitle>
            <AlertDescription>{error}</AlertDescription>

            {errorDetails && (
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="details">
                  <AccordionTrigger>查看詳細信息</AccordionTrigger>
                  <AccordionContent>
                    <pre className="text-xs overflow-auto p-2 bg-red-50 rounded">{errorDetails}</pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </Alert>
        )}

        {initResult && initResult.success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>成功</AlertTitle>
            <AlertDescription>{initResult.message}</AlertDescription>
          </Alert>
        )}

        {!tablesStatus && !error && (
          <div className="flex flex-col items-center justify-center py-8">
            <Database className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">正在檢查數據庫連接和表狀態...</p>
          </div>
        )}

        {tablesStatus && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">數據庫表狀態</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span>會員表 (members):</span>
                {tablesStatus.members ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>交易表 (transactions):</span>
                {tablesStatus.transactions ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>分紅表 (dividends):</span>
                {tablesStatus.dividends ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>代理表 (agents):</span>
                {tablesStatus.agents ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>資金表 (funds):</span>
                {tablesStatus.funds ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>積分類型表 (point_types):</span>
                {tablesStatus.pointTypes ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>會員積分表 (member_points):</span>
                {tablesStatus.memberPoints ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>積分交易表 (point_transactions):</span>
                {tablesStatus.pointTransactions ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={checkTables} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          檢查表狀態
        </Button>
        <Button onClick={initializeDatabase} disabled={initializing || (tablesStatus && tablesStatus.allExist)}>
          {initializing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
          {tablesStatus && tablesStatus.allExist ? "數據庫已初始化" : "初始化數據庫"}
        </Button>
      </CardFooter>
    </Card>
  )
}

