// app/test-db/page.js
import { sql } from "@/lib/db"

export default async function TestDbPage() {
  // 測試數據庫連接
  const result = await sql`SELECT NOW() as time`

  return (
    <div>
      <h1>數據庫連接測試</h1>
      <p>當前數據庫時間: {result[0].time.toString()}</p>
    </div>
  )
}

