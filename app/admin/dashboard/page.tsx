import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboardPage() {
  // 获取基本统计数据
  const userCount = await prisma.user.count()
  const productCount = await prisma.product.count()
  const orderCount = await prisma.order.count()

  // 获取最近的5个用户
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  // 获取最近的5个订单
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">管理员仪表板</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">用户</h2>
          <p className="text-3xl font-bold">{userCount}</p>
          <Link href="/admin/users" className="text-blue-600 hover:underline mt-2 inline-block">
            查看所有用户
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">产品</h2>
          <p className="text-3xl font-bold">{productCount}</p>
          <Link href="/admin/products" className="text-blue-600 hover:underline mt-2 inline-block">
            查看所有产品
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">订单</h2>
          <p className="text-3xl font-bold">{orderCount}</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline mt-2 inline-block">
            查看所有订单
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">最近注册的用户</h2>
          {recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      邮箱
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      注册时间
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name || "未设置"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email || "未设置"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(user.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">暂无用户数据</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">最近的订单</h2>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      订单ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金额
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{order.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.user.name || order.user.email || "未知用户"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">¥{order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : order.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">暂无订单数据</p>
          )}
        </div>
      </div>
    </div>
  )
}

