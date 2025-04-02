import prisma from "@/lib/prisma"

export default async function DbTestPage() {
  let connectionStatus = "未知"
  let error = null
  let userCount = 0

  try {
    // 尝试执行一个简单的数据库查询
    userCount = await prisma.user.count()
    connectionStatus = "连接成功"
  } catch (err) {
    connectionStatus = "连接失败"
    error = err instanceof Error ? err.message : String(err)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">数据库连接测试</h1>

      <div className={`p-4 rounded-lg ${connectionStatus === "连接成功" ? "bg-green-100" : "bg-red-100"}`}>
        <h2 className="text-xl font-semibold mb-2">连接状态</h2>
        <p className="font-medium">状态: {connectionStatus}</p>
        {error && (
          <div className="mt-4">
            <h3 className="font-medium">错误信息:</h3>
            <pre className="mt-2 p-3 bg-gray-800 text-white rounded overflow-x-auto">{error}</pre>
          </div>
        )}
        {connectionStatus === "连接成功" && <p className="mt-2">用户数量: {userCount}</p>}
      </div>

      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">环境变量检查</h2>
        <p>DATABASE_URL: {process.env.DATABASE_URL ? "已设置 ✓" : "未设置 ✗"}</p>
        <p>GITHUB_ID: {process.env.GITHUB_ID ? "已设置 ✓" : "未设置 ✗"}</p>
        <p>GITHUB_SECRET: {process.env.GITHUB_SECRET ? "已设置 ✓" : "未设置 ✗"}</p>
        <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? "已设置 ✓" : "未设置 ✗"}</p>
        <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL ? "已设置 ✓" : "未设置 ✗"}</p>
      </div>
    </div>
  )
}

