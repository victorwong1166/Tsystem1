export default function DeploymentTimePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">部署时间测试</h1>

      <div className="p-4 bg-blue-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">环境变量</h2>
        <p>LAST_DEPLOYMENT_TIME: {process.env.LAST_DEPLOYMENT_TIME || "未设置"}</p>
        <p className="mt-4 text-sm text-gray-600">当前服务器时间: {new Date().toISOString()}</p>
      </div>
    </div>
  )
}

