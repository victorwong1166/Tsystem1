import { pool } from "@/lib/pg-connect"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TestDbPage() {
  let dbStatus = "正在連接..."
  let dbTime = ""
  let tables: string[] = []
  let error = null

  try {
    const client = await pool.connect()
    try {
      dbStatus = "連接成功"

      // 獲取當前時間
      const timeResult = await client.query("SELECT NOW() as time")
      dbTime = new Date(timeResult.rows[0].time).toLocaleString()

      // 獲取表列表
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `)
      tables = tablesResult.rows.map((row) => row.table_name)
    } finally {
      client.release()
    }
  } catch (err: any) {
    dbStatus = "連接失敗"
    error = err.message
    console.error("數據庫查詢失敗:", err)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">數據庫連接測試</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">連接狀態</h2>
        <div className="mb-4">
          <span className="font-medium">狀態:</span>
          <span className={`ml-2 ${dbStatus === "連接成功" ? "text-green-600" : "text-red-600"}`}>{dbStatus}</span>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">錯誤:</p>
            <p>{error}</p>
          </div>
        )}

        {dbTime && (
          <div className="mb-4">
            <span className="font-medium">數據庫時間:</span>
            <span className="ml-2">{dbTime}</span>
          </div>
        )}
      </div>

      {tables.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">數據庫表</h2>
          <ul className="list-disc pl-5">
            {tables.map((table, index) => (
              <li key={index} className="mb-1">
                {table}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

