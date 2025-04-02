import Link from "next/link"

export default function DatabaseManagementPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">数据库管理</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/database/tables">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">表结构</h2>
            <p className="text-gray-600">查看数据库表结构和关系图</p>
          </div>
        </Link>

        <Link href="/admin/database-diagnostics">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">数据库诊断</h2>
            <p className="text-gray-600">检查数据库连接和健康状态</p>
          </div>
        </Link>

        <Link href="/admin/database/prisma-viewer">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Prisma 模型</h2>
            <p className="text-gray-600">查看 Prisma 模型定义</p>
          </div>
        </Link>

        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">数据初始化</h2>
          <p className="text-gray-600">初始化数据库和示例数据</p>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">数据备份</h2>
          <p className="text-gray-600">备份和恢复数据库</p>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">数据迁移</h2>
          <p className="text-gray-600">管理数据库迁移</p>
        </div>
      </div>

      <div className="mt-8 border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">数据库状态</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-100 rounded-lg">
            <h3 className="font-medium mb-1">连接状态</h3>
            <p className="text-2xl font-bold text-green-700">正常</p>
          </div>

          <div className="p-4 bg-blue-100 rounded-lg">
            <h3 className="font-medium mb-1">表数量</h3>
            <p className="text-2xl font-bold text-blue-700">9</p>
          </div>

          <div className="p-4 bg-purple-100 rounded-lg">
            <h3 className="font-medium mb-1">数据库大小</h3>
            <p className="text-2xl font-bold text-purple-700">12.5 MB</p>
          </div>
        </div>
      </div>
    </div>
  )
}

