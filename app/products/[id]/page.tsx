"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useSession } from "next-auth/react"

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

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { data: session } = useSession()

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [addingToCart, setAddingToCart] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "获取产品详情失败")
      }

      setProduct(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "获取产品详情失败")
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value)
    }
  }

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const addToCart = async () => {
    if (!session) {
      router.push("/login?redirect=" + encodeURIComponent(`/products/${id}`))
      return
    }

    setAddingToCart(true)
    setMessage("")

    try {
      // 这里可以实现添加到购物车的逻辑
      // 例如，调用API将产品添加到购物车

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500))

      setMessage("产品已添加到购物车")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "添加到购物车失败")
    } finally {
      setAddingToCart(false)
    }
  }

  const buyNow = async () => {
    if (!session) {
      router.push("/login?redirect=" + encodeURIComponent(`/products/${id}`))
      return
    }

    // 创建订单
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              productId: id,
              quantity,
            },
          ],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "创建订单失败")
      }

      // 跳转到订单确认页面
      router.push(`/orders/${data.order.id}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "创建订单失败")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-red-100 text-red-700 rounded">{error || "产品不存在"}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 md:h-full">
          <Image
            src={product.image || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-4">
            <span className="text-2xl font-bold text-indigo-600">¥{product.price.toFixed(2)}</span>
          </div>

          <div className="mt-4">
            <span
              className={`px-2 py-1 rounded text-sm ${
                product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {product.stock > 0 ? `库存: ${product.stock}` : "缺货"}
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">描述</h2>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>

          {product.stock > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">数量</h2>
              <div className="flex items-center mt-2">
                <button onClick={decreaseQuantity} className="px-3 py-1 border rounded-l">
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-t border-b"
                />
                <button onClick={increaseQuantity} className="px-3 py-1 border rounded-r">
                  +
                </button>
              </div>
            </div>
          )}

          {message && (
            <div
              className={`mt-4 p-3 rounded ${
                message.includes("失败") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            <button
              onClick={addToCart}
              disabled={product.stock === 0 || addingToCart}
              className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {addingToCart ? "添加中..." : "加入购物车"}
            </button>

            <button
              onClick={buyNow}
              disabled={product.stock === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              立即购买
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

