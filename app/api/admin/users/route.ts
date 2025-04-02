import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 获取所有用户
export async function GET(request: Request) {
  try {
    // 检查管理员权限
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || undefined

    // 计算分页
    const skip = (page - 1) * limit

    // 构建查询条件
    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(role ? { role } : {}),
    }

    // 查询用户
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    // 计算分页信息
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("获取用户列表错误:", error)
    return NextResponse.json({ error: "获取用户列表失败" }, { status: 500 })
  }
}

// 创建用户
export async function POST(request: Request) {
  try {
    // 检查管理员权限
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权访问" }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, password, role, bio } = body

    // 验证必填字段
    if (!name || !email) {
      return NextResponse.json({ error: "名称和邮箱是必填字段" }, { status: 400 })
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 })
    }

    // 创建用户
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // 注意：实际应用中应该对密码进行哈希处理
        role: role || "USER",
        bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ message: "用户创建成功", user: newUser }, { status: 201 })
  } catch (error) {
    console.error("创建用户错误:", error)
    return NextResponse.json({ error: "创建用户失败" }, { status: 500 })
  }
}

