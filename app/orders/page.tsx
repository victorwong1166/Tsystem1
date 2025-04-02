"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    image: string
  }
}

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  orderItems: OrderItem[]
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/orders")
    } else if (status === "authenticated") {
      fetchOrders(1)
    }
  }, [status])

  const fetchOrders = async (page: number) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/orders?page=${page}&limit=${pagination.limit}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "获取订单失败")
      }

      setOrders(data.orders)
      setPagination(data.pagination)
    } catch (error) {
      setError(error instanceof Error ? error.message : "获取订单失败")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    fetchOrders(page)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "待处理"
      case "PROCESSING":
        return "处理中"
      case "SHIPPED":
        return "已发货"
      case "DELIVERED":
        return "已送达"
      case "CANCELLED":
        return "已取消"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "SHIPPED":
        return "bg-purple-100 text-purple-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">我的订单</h1>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-6">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600">您还没有订单</p>
          <Link
            href="/products"
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            浏览产品
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <span className="text-gray-500">订单号: </span>
                    <span className="font-medium">{order.id}</span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center py-2 border-b last:border-b-0">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden relative">
                        <img
                          src={item.product.image || "/placeholder.svg?height=200&width=200"}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <Link href={`/products/${item.product.id}`} className="font-medium hover:text-indigo-600">
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-gray-500">
                          数量: {item.quantity} × ¥{item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">¥{(item.quantity * item.price).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <div className="text-sm text-gray-500">下单时间: {new Date(order.createdAt).toLocaleString()}</div>
                  <div className="text-lg font-bold">总计: ¥{order.total.toFixed(2)}</div>
                </div>

                <div className="p-4 border-t flex justify-end">
                  <Link
                    href={`/orders/${order.id}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  上一页
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      pagination.page === page ? "bg-indigo-600 text-white" : "border hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  下一页
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  )
}

