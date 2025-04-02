import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 获取所有文章
export async function GET(request: Request) {
  try {
    // 检查权限
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const published = searchParams.get("published")
    const categoryId = searchParams.get("categoryId") || undefined
    const tagId = searchParams.get("tagId") || undefined

    // 计算分页
    const skip = (page - 1) * limit

    // 构建查询条件
    let where: any = {
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    }

    // 如果不是管理员，只能看到自己的文章或已发布的文章
    if (session.user.role !== "ADMIN") {
      where = {
        ...where,
        OR: [{ authorId: session.user.id }, { published: true }],
      }
    } else if (published !== null) {
      // 管理员可以按发布状态筛选
      where.published = published === "true"
    }

    // 按分类筛选
    if (categoryId) {
      where.categories = {
        some: {
          categoryId,
        },
      }
    }

    // 按标签筛选
    if (tagId) {
      where.tags = {
        some: {
          tagId,
        },
      }
    }

    // 查询文章
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          published: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    // 格式化结果
    const formattedPosts = posts.map((post) => ({
      ...post,
      categories: post.categories.map((c) => c.category),
      tags: post.tags.map((t) => t.tag),
    }))

    // 计算分页信息
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("获取文章列表错误:", error)
    return NextResponse.json({ error: "获取文章列表失败" }, { status: 500 })
  }
}

// 创建文章
export async function POST(request: Request) {
  try {
    // 检查权限
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, published, categoryIds, tagIds } = body

    // 验证必填字段
    if (!title) {
      return NextResponse.json({ error: "标题是必填字段" }, { status: 400 })
    }

    // 创建文章
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        author: {
          connect: { id: session.user.id },
        },
      },
    })

    // 添加分类
    if (categoryIds && categoryIds.length > 0) {
      const categoryConnections = categoryIds.map((categoryId) => ({
        postId: newPost.id,
        categoryId,
      }))

      await prisma.categoryOnPost.createMany({
        data: categoryConnections,
      })
    }

    // 添加标签
    if (tagIds && tagIds.length > 0) {
      const tagConnections = tagIds.map((tagId) => ({
        postId: newPost.id,
        tagId,
      }))

      await prisma.tagOnPost.createMany({
        data: tagConnections,
      })
    }

    // 获取完整的文章信息
    const completePost = await prisma.post.findUnique({
      where: { id: newPost.id },
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

    return NextResponse.json({ message: "文章创建成功", post: formattedPost }, { status: 201 })
  } catch (error) {
    console.error("创建文章错误:", error)
    return NextResponse.json({ error: "创建文章失败" }, { status: 500 })
  }
}

