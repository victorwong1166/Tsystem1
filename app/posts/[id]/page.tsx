import { getPostById } from "@/lib/pg-connect"
import { notFound } from "next/navigation"

export const revalidate = 60 // 每分鐘重新驗證數據

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(Number.parseInt(params.id))

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <a href="/posts" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← 返回文章列表
      </a>

      <article className="prose lg:prose-xl max-w-none">
        <h1>{post.title}</h1>
        <div className="text-gray-500 mb-6">
          發布於 {new Date(post.created_at).toLocaleDateString()}
          {post.updated_at !== post.created_at && ` · 更新於 ${new Date(post.updated_at).toLocaleDateString()}`}
        </div>

        <div className="mt-8">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  )
}

