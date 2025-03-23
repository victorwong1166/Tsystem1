import { getAllPosts } from "@/lib/pg-connect"
import Link from "next/link"

export const revalidate = 60 // 每分鐘重新驗證數據

export default async function PostsPage() {
  let posts = []
  let error = null

  try {
    posts = await getAllPosts()
  } catch (err) {
    console.error("Error fetching posts:", err)
    error = "獲取文章列表時出錯"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">文章列表</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">暫無文章</p>
          <Link
            href="/admin/posts/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            創建第一篇文章
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 line-clamp-3">{post.content}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                  <Link href={`/posts/${post.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    閱讀更多 →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

