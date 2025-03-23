import { getAllPosts } from "@/lib/pg-connect"

export const revalidate = 60 // 每分鐘重新驗證數據

export default async function PostsPage() {
  const posts = await getAllPosts()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">文章列表</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">暫無文章</p>
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
                  <a href={`/posts/${post.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    閱讀更多 →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

