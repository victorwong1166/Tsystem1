import { getAllPosts } from "@/lib/pg-connect"
import Link from "next/link"

export const revalidate = 10 // 每10秒重新驗證數據

export default async function AdminPostsPage() {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link href="/admin/posts/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          新增文章
        </Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">暫無文章，點擊上方按鈕創建第一篇文章</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">標題</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  創建日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.published ? "已發布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/posts/${post.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      編輯
                    </Link>
                    <Link href={`/admin/posts/${post.id}/delete`} className="text-red-600 hover:text-red-900">
                      刪除
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

