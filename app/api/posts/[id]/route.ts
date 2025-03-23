import { type NextRequest, NextResponse } from "next/server"
import { getPostById, updatePost, deletePost, togglePublishPost } from "@/lib/pg-connect"

// 獲取單個文章
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ message: "無效的文章ID" }, { status: 400 })
    }

    const post = await getPostById(id)
    if (!post) {
      return NextResponse.json({ message: "文章不存在" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error: any) {
    console.error(`Error fetching post:`, error)
    return NextResponse.json({ message: "獲取文章失敗", error: error.message }, { status: 500 })
  }
}

// 更新文章
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ message: "無效的文章ID" }, { status: 400 })
    }

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ message: "標題和內容不能為空" }, { status: 400 })
    }

    const updatedPost = await updatePost(id, title, content)
    if (!updatedPost) {
      return NextResponse.json({ message: "文章不存在或更新失敗" }, { status: 404 })
    }

    return NextResponse.json(updatedPost)
  } catch (error: any) {
    console.error(`Error updating post:`, error)
    return NextResponse.json({ message: "更新文章失敗", error: error.message }, { status: 500 })
  }
}

// 刪除文章
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ message: "無效的文章ID" }, { status: 400 })
    }

    const success = await deletePost(id)
    if (!success) {
      return NextResponse.json({ message: "文章不存在或刪除失敗" }, { status: 404 })
    }

    return NextResponse.json({ message: "文章已成功刪除" })
  } catch (error: any) {
    console.error(`Error deleting post:`, error)
    return NextResponse.json({ message: "刪除文章失敗", error: error.message }, { status: 500 })
  }
}

// 發布或取消發布文章
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ message: "無效的文章ID" }, { status: 400 })
    }

    const { published } = await request.json()

    if (typeof published !== "boolean") {
      return NextResponse.json({ message: "發布狀態必須是布爾值" }, { status: 400 })
    }

    const updatedPost = await togglePublishPost(id, published)
    if (!updatedPost) {
      return NextResponse.json({ message: "文章不存在或更新失敗" }, { status: 404 })
    }

    return NextResponse.json(updatedPost)
  } catch (error: any) {
    console.error(`Error updating post publish status:`, error)
    return NextResponse.json({ message: "更新文章發布狀態失敗", error: error.message }, { status: 500 })
  }
}

