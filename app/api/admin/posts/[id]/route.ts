import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 获取单个文章
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // 检查权限
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id

    // 获取文章详情
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
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 })
    }

    // 检查权限：只有管理员、作者或已发布的文章可以被查看
    if (post.published === false && session.user.role !== "ADMIN" && post.author.id !== session.user.id) {
      return NextResponse.json({ error: "无权查看此文章" }, { status: 403 })
    }

    // 格式化结果
    const formattedPost = {
      ...post,
      categories: post.categories.map((c) => c.category),
      tags: post.tags.map((t) => t.tag),
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error("获取文章详情错误:", error)
    return NextResponse.json({ error: "获取文章详情失败" }, { status: 500 })
  }
}

// 更新文章
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // 检查权限
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id
    const body = await request.json()
    const { title, content, published, categoryIds, tagIds } = body

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!existingPost) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 })
    }

    // 检查权限：只有管理员或作者可以更新文章
    if (session.user.role !== "ADMIN" && existingPost.author.id !== session.user.id) {
      return NextResponse.json({ error: "无权更新此文章" }, { status: 403 })
    }

    // 开始事务
    const updatedPost = await prisma.$transaction(async (tx) => {
      // 更新文章基本信息
      const updated = await tx.post.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
          ...(published !== undefined && { published }),
        },
      })

      // 更新分类
      if (categoryIds !== undefined) {
        // 删除现有分类关联
        await tx.categoryOnPost.deleteMany({
          where: { postId: id },
        })

        // 添加新分类关联
        if (categoryIds.length > 0) {
          await tx.categoryOnPost.createMany({
            data: categoryIds.map((categoryId) => ({
              postId: id,
              categoryId,
            })),
          })
        }
      }

      // 更新标签
      if (tagIds !== undefined) {
        // 删除现有标签关联
        await tx.tagOnPost.deleteMany({
          where: { postId: id },
        })

        // 添加新标签关联
        if (tagIds.length > 0) {
          await tx.tagOnPost.createMany({
            data: tagIds.map((tagId) => ({
              postId: id,
              tagId,
            })),
          })
        }
      }

      return updated
    })

    // 获取更新后的完整文章信息
    const completePost = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // 格式化结果
    const formattedPost = {
      ...completePost,
      categories: completePost.categories.map((c) => c.category),
      tags: completePost.tags.map((t) => t.tag),
    }

    return NextResponse.json({
      message: "文章更新成功",
      post: formattedPost,
    })
  } catch (error) {
    console.error("更新文章错误:", error)
    return NextResponse.json({ error: "更新文章失败" }, { status: 500 })
  }
}

// 删除文章
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // 检查权限
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const id = params.id

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!existingPost) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 })
    }

    // 检查权限：只有管理员或作者可以删除文章
    if (session.user.role !== "ADMIN" && existingPost.author.id !== session.user.id) {
      return NextResponse.json({ error: "无权删除此文章" }, { status: 403 })
    }

    // 删除文章
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "文章删除成功",
    })
  } catch (error) {
    console.error("删除文章错误:", error)
    return NextResponse.json({ error: "删除文章失败" }, { status: 500 })
  }
}

