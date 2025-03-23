"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DeletePostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const id = params.id

  // 獲取文章數據
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("文章不存在")
          }
          throw new Error("獲取文章失敗")
        }

        const postData = await response.json()
        setPost(postData)
      } catch (err: any) {
        setError(err.message || "獲取文章時發生錯誤")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id])

  // 刪除文章
  const handleDelete = async () => {
    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "刪除文章失敗")
      }

      router.push("/admin/posts")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "刪除文章時發生錯誤")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>加載中...</p>
      </div>
    )
  }

  if (!post && !error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>文章不存在</p>
        <Link href="/admin/posts" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          返回文章列表
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">刪除文章</h1>
        <Link href="/admin/posts" className="text-gray-600 hover:text-gray-900">
          返回文章列表
        </Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">確認刪除</h2>
        <p className="mb-6">您確定要刪除文章 "{post?.title}" 嗎？此操作無法撤銷。</p>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? "刪除中..." : "確認刪除"}
          </button>

          <Link
            href="/admin/posts"
            className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
          >
            取消
          </Link>
        </div>
      </div>
    </div>
  )
}

