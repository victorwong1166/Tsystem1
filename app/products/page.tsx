"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get("category")
  const searchQuery = searchParams.get("search")

  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProducts(1)
  }, [categorySlug, searchQuery])

  const fetchProducts = async (page: number) => {
    setLoading(true)
    setError("")

    try {
      let url = `/api/products?page=${page}&limit=${pagination.limit}`

      if (categorySlug) {
        url += `&category=${categorySlug}`
      }

      if (searchQuery) {
        url += `&search=${searchQuery}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "获取产品失败")
      }

      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      setError(error instanceof Error ? error.message : "获取产品失败")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    fetchProducts(page)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {categorySlug ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} 产品` : "所有产品"}
        {searchQuery && ` - 搜索: "${searchQuery}"`}
      </h1>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-6">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">没有找到产品</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={product.image || "/placeholder.svg?height=400&width=600"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-indigo-600 font-bold">¥{product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">
                        {product.stock > 0 ? `库存: ${product.stock}` : "缺货"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
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

