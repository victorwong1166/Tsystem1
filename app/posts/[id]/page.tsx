import { getPostById } from "@/lib/pg-connect"
import Link from "next/link"
import { notFound } from "next/navigation"

export const revalidate = 60 // 每分鐘重新驗證數據

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/posts" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← 返回文章列表
      </Link>

      <article className="bg-white shadow-md rounded-lg p-6 mt-4">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        <div className="text-gray-500 mb-6">
          發布於 {new Date(post.created_at).toLocaleDateString()}
          {post.updated_at && post.updated_at !== post.created_at && (
            <span> · 更新於 {new Date(post.updated_at).toLocaleDateString()}</span>
          )}
        </div>

        <div className="prose max-w-none">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  )
}

