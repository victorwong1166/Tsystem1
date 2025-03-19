import { sql } from "@/lib/db"

export default async function TestDbPage() {
  try {
    const result = await sql`SELECT NOW() as time`
    const time = result.rows[0]?.time || new Date().toISOString()

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">数据库测试页面</h1>
        <p>当前数据库时间: {time}</p>
      </div>
    )
  } catch (error) {
    console.error("数据库查询失败:", error)

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">数据库测试页面</h1>
        <p className="text-red-500">数据库查询失败: {error.message}</p>
        <p>当前时间: {new Date().toISOString()}</p>
      </div>
    )
  }
}

