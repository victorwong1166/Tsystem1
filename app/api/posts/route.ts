import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET 请求处理程序 - 获取所有帖子
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ posts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "获取帖子时发生错误" }, { status: 500 })
  }
}

// POST 请求处理程序 - 创建新帖子
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, authorId, published = false } = body

    // 基本验证
    if (!title || !authorId) {
      return NextResponse.json({ error: "标题和作者ID是必填的" }, { status: 400 })
    }

    // 检查作者是否存在
    const author = await prisma.user.findUnique({
      where: { id: authorId },
    })

    if (!author) {
      return NextResponse.json({ error: "作者不存在" }, { status: 404 })
    }

    // 创建新帖子
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ post: newPost }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "创建帖子时发生错误" }, { status: 500 })
  }
}

