export default async function EnvCheckPage() {
  // 检查环境变量
  const dbUrl = process.env.DATABASE_URL
  const hasDbUrl = !!dbUrl

  // 获取 URL 前缀（如果存在）
  const dbUrlPrefix = hasDbUrl ? dbUrl.substring(0, 20) + "..." : "N/A"

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">环境变量检查</h1>

      <div className="p-4 bg-gray-100 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">数据库连接</h2>
        <p>DATABASE_URL 环境变量: {hasDbUrl ? "已设置" : "未设置"}</p>
        {hasDbUrl && <p className="mt-2">URL 前缀: {dbUrlPrefix}</p>}
      </div>

      {!hasDbUrl && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">缺少必要的环境变量</h2>
          <p>DATABASE_URL 环境变量未设置。请在 Vercel 项目设置中添加此环境变量。</p>

          <div className="mt-4 p-4 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">设置步骤:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>登录 Vercel 仪表板</li>
              <li>选择您的项目</li>
              <li>点击 "Settings" 标签</li>
              <li>选择 "Environment Variables"</li>
              <li>添加名为 DATABASE_URL 的新环境变量</li>
              <li>输入您的 Neon 数据库连接字符串</li>
              <li>点击 "Save" 并重新部署您的项目</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

