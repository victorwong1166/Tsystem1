"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { testDatabaseWrite } from "@/lib/db-test"

export default function TestDatabaseWritePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState("測試數據 " + new Date().toISOString())

  async function handleTestWrite() {
    setLoading(true)
    try {
      const writeResult = await testDatabaseWrite(testData)
      setResult(writeResult)
    } catch (error) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">數據庫寫入測試</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>測試數據庫寫入功能</CardTitle>
          <CardDescription>此頁面用於測試數據庫的寫入功能是否正常工作</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="testData">測試數據</Label>
              <Input id="testData" value={testData} onChange={(e) => setTestData(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleTestWrite} disabled={loading}>
            {loading ? "測試中..." : "執行寫入測試"}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>測試結果</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

