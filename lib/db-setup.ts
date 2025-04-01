import prisma from "./prisma"

export async function setupDatabase() {
  try {
    console.log("开始设置数据库...")

    // 检查数据库连接
    await prisma.$connect()
    console.log("数据库连接成功")

    // 检查用户表是否存在
    let tableExists = false
    try {
      const result = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'User'
        );
      `
      // @ts-ignore
      tableExists = result[0]?.exists || false
    } catch (error) {
      console.error("检查表存在时出错:", error)
      tableExists = false
    }

    if (!tableExists) {
      console.log("表不存在，创建示例数据...")

      // 创建示例用户
      const user1 = await prisma.user.create({
        data: {
          name: "测试用户",
          email: "test@example.com",
        },
      })

      const user2 = await prisma.user.create({
        data: {
          name: "管理员",
          email: "admin@example.com",
        },
      })

      console.log("已创建用户:", user1.id, user2.id)

      // 创建示例帖子
      const post1 = await prisma.post.create({
        data: {
          title: "第一篇文章",
          content: "这是第一篇示例文章的内容。",
          published: true,
          authorId: user1.id,
        },
      })

      const post2 = await prisma.post.create({
        data: {
          title: "草稿文章",
          content: "这是一篇未发布的草稿文章。",
          published: false,
          authorId: user2.id,
        },
      })

      console.log("已创建帖子:", post1.id, post2.id)

      return {
        success: true,
        message: "数据库初始化成功",
        data: {
          users: [user1, user2],
          posts: [post1, post2],
        },
      }
    } else {
      console.log("表已存在，跳过初始化")

      // 计算现有数据
      const userCount = await prisma.user.count()
      const postCount = await prisma.post.count()

      return {
        success: true,
        message: "数据库已存在，无需初始化",
        data: {
          userCount,
          postCount,
        },
      }
    }
  } catch (error) {
    console.error("设置数据库时出错:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    }
  } finally {
    await prisma.$disconnect()
  }
}

export async function getDatabaseStatus() {
  try {
    await prisma.$connect()

    // 获取表信息
    const userCount = await prisma.user.count()
    const postCount = await prisma.post.count()

    // 获取最新用户
    const latestUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    // 获取最新帖子
    const latestPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    return {
      success: true,
      data: {
        userCount,
        postCount,
        latestUsers,
        latestPosts,
      },
    }
  } catch (error) {
    console.error("获取数据库状态时出错:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    }
  } finally {
    await prisma.$disconnect()
  }
}

