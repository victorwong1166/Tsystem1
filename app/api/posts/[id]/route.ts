import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET 请求处理程序 - 获取单个帖子
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const post = await prisma.post.findUnique({
      where: { id },
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

    if (!post) {
      return NextResponse.json({ error: "帖子不存在" }, { status: 404 })
    }

    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "获取帖子时发生错误" }, { status: 500 })
  }
}

// PATCH 请求处理程序 - 更新帖子
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { title, content, published } = body

    // 检查帖子是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: "帖子不存在" }, { status: 404 })
    }

    // 更新帖子
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published }),
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

    return NextResponse.json({ post: updatedPost }, { status: 200 })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "更新帖子时发生错误" }, { status: 500 })
  }
}

// DELETE 请求处理程序 - 删除帖子
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 检查帖子是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: "帖子不存在" }, { status: 404 })
    }

    // 删除帖子
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ message: "帖子已成功删除" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "删除帖子时发生错误" }, { status: 500 })
  }
}

