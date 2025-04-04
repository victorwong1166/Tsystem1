import { type NextRequest, NextResponse } from "next/server"
import { createPost, getAllPosts } from "@/lib/pg-connect"

// 獲取所有文章
export async function GET(request: NextRequest) {
  try {
    const posts = await getAllPosts()
    return NextResponse.json(posts)
  } catch (error: any) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ message: "獲取文章列表失敗", error: error.message }, { status: 500 })
  }
}

// 創建新文章
export async function POST(request: NextRequest) {
  try {
    const { title, content, authorId } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ message: "標題和內容不能為空" }, { status: 400 })
    }

    const newPost = await createPost(title, content, authorId || null)
    return NextResponse.json(newPost, { status: 201 })
  } catch (error: any) {
    console.error("Error creating post:", error)
    return NextResponse.json({ message: "創建文章失敗", error: error.message }, { status: 500 })
  }
}

