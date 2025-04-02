import prisma from "@/lib/prisma"

export default async function SystemStatusPage() {
  // 检查数据库连接
  let dbStatus = "未知"
  let dbError = null

  try {
    // 尝试执行一个简单的数据库查询
    await prisma.$queryRaw`SELECT 1`
    dbStatus = "正常"
  } catch (err) {
    dbStatus = "错误"
    dbError = err instanceof Error ? err.message : String(err)
  }

  // 检查环境变量
  const envVars = [
    { name: "DATABASE_URL", value: process.env.DATABASE_URL ? "已设置" : "未设置" },
    { name: "NEXTAUTH_SECRET", value: process.env.NEXTAUTH_SECRET ? "已设置" : "未设置" },
    { name: "NEXTAUTH_URL", value: process.env.NEXTAUTH_URL ? "已设置" : "未设置" },
    { name: "GITHUB_ID", value: process.env.GITHUB_ID ? "已设置" : "未设置" },
    { name: "GITHUB_SECRET", value: process.env.GITHUB_SECRET ? "已设置" : "未设置" },
  ]

  // 检查数据模型状态
  const modelStatus = [
    { name: "用户", count: await prisma.user.count() },
    { name: "产品", count: await prisma.product.count() },
    { name: "订单", count: await prisma.order.count() },
    { name: "账户", count: await prisma.account.count() },
    { name: "会话", count: await prisma.session.count() },
  ]

  // 系统信息
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    uptime: Math.floor(process.uptime()),
    memoryUsage: process.memoryUsage(),
    currentTime: new Date().toISOString(),
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">系统状态</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">数据库状态</h2>
          <div className={`p-4 rounded-lg ${dbStatus === "正常" ? "bg-green-100" : "bg-red-100"}`}>
            <p className="font-medium">状态: {dbStatus}</p>
            {dbError && (
              <div className="mt-4">
                <h3 className="font-medium">错误信息:</h3>
                <pre className="mt-2 p-3 bg-gray-800 text-white rounded overflow-x-auto">{dbError}</pre>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">数据模型状态</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    模型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    记录数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modelStatus.map((model) => (
                  <tr key={model.name}>
                    <td className="px-6 py-4 whitespace-nowrap">{model.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{model.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">环境变量</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    变量名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {envVars.map((env) => (
                  <tr key={env.name}>
                    <td className="px-6 py-4 whitespace-nowrap">{env.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          env.value === "已设置" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {env.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">系统信息</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Node.js 版本:</span> {systemInfo.nodeVersion}
            </p>
            <p>
              <span className="font-medium">平台:</span> {systemInfo.platform}
            </p>
            <p>
              <span className="font-medium">运行时间:</span> {systemInfo.uptime} 秒
            </p>
            <p>
              <span className="font-medium">当前时间:</span> {systemInfo.currentTime}
            </p>
            <div>
              <p className="font-medium">内存使用:</p>
              <pre className="mt-2 p-3 bg-gray-100 rounded overflow-x-auto">
                {JSON.stringify(systemInfo.memoryUsage, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">系统检查</h2>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">注意事项</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>请确保您已经运行了以下命令来初始化数据库：</p>
                  <pre className="mt-2 p-2 bg-gray-800 text-white rounded">npx prisma migrate dev --name init</pre>
                  <pre className="mt-2 p-2 bg-gray-800 text-white rounded">npx ts-node scripts/init-db.ts</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">提示</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>如果您的数据库连接有问题，请检查 DATABASE_URL 环境变量是否正确设置。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

