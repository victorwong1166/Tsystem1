export default function EnvCheckPage() {
  // 检查环境变量
  const envVars = [
    { name: "DATABASE_URL", value: process.env.DATABASE_URL ? "已设置" : "未设置" },
    { name: "NEXTAUTH_SECRET", value: process.env.NEXTAUTH_SECRET ? "已设置" : "未设置" },
    { name: "NEXTAUTH_URL", value: process.env.NEXTAUTH_URL ? "已设置" : "未设置" },
    { name: "GITHUB_ID", value: process.env.GITHUB_ID ? "已设置" : "未设置" },
    { name: "GITHUB_SECRET", value: process.env.GITHUB_SECRET ? "已设置" : "未设置" },
    { name: "VAPID_PRIVATE_KEY", value: process.env.VAPID_PRIVATE_KEY ? "已设置" : "未设置" },
    { name: "NEXT_PUBLIC_VAPID_PUBLIC_KEY", value: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? "已设置" : "未设置" },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">环境变量检查</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">环境变量状态</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  变量名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
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
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">解决方案</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">1. 设置必要的环境变量</h3>
            <p className="mt-2">在Vercel项目设置中，添加以下环境变量:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>DATABASE_URL - 数据库连接字符串</li>
              <li>NEXTAUTH_SECRET - NextAuth加密密钥</li>
              <li>NEXTAUTH_URL - 您的网站URL</li>
              <li>GITHUB_ID - GitHub OAuth应用ID</li>
              <li>GITHUB_SECRET - GitHub OAuth应用密钥</li>
            </ul>
          </div>

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
                <h3 className="text-sm font-medium text-yellow-800">注意</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>确保您的DATABASE_URL环境变量指向一个有效的PostgreSQL数据库。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

