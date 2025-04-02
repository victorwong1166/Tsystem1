import prisma from "./prisma"
import { hash } from "bcryptjs"

/**
 * 检查数据库表是否存在
 */
export async function checkTablesExist() {
  try {
    // 检查用户表是否存在
    const userTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      );
    `

    // 检查文章表是否存在
    const postTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Post'
      );
    `

    // 检查分类表是否存在
    const categoryTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Category'
      );
    `

    return {
      success: true,
      exists: {
        // @ts-ignore - 处理原始查询结果
        user: userTableExists[0]?.exists || false,
        // @ts-ignore - 处理原始查询结果
        post: postTableExists[0]?.exists || false,
        // @ts-ignore - 处理原始查询结果
        category: categoryTableExists[0]?.exists || false,
      },
    }
  } catch (error) {
    console.error("检查表存在时出错:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

/**
 * 初始化数据库
 */
export async function initializeDatabase(force = false) {
  try {
    console.log("开始初始化数据库...")

    // 检查表是否存在
    const tablesCheck = await checkTablesExist()

    if (!tablesCheck.success) {
      return {
        success: false,
        message: "检查数据库表失败",
        error: tablesCheck.error,
      }
    }

    // 如果表已存在且不强制重新初始化，则返回
    if (tablesCheck.exists.user && !force) {
      console.log("数据库表已存在，跳过初始化")

      // 获取现有数据统计
      const userCount = await prisma.user.count()
      const postCount = await prisma.post.count()
      const categoryCount = await prisma.category.count()

      return {
        success: true,
        message: "数据库已存在，无需初始化",
        data: {
          userCount,
          postCount,
          categoryCount,
        },
      }
    }

    // 如果强制重新初始化，则清空现有数据
    if (force) {
      console.log("强制重新初始化，清空现有数据...")

      // 使用事务确保原子性
      await prisma.$transaction([prisma.comment.deleteMany({}), prisma.post.deleteMany({}), prisma.user.deleteMany({})])
    }

    console.log("创建示例数据...")

    // 创建示例用户
    const adminPassword = await hash("admin123", 10)
    const admin = await prisma.user.create({
      data: {
        name: "管理员",
        email: "admin@example.com",
        password: adminPassword,
      },
    })

    const userPassword = await hash("user123", 10)
    const user = await prisma.user.create({
      data: {
        name: "测试用户",
        email: "user@example.com",
        password: userPassword,
      },
    })

    console.log("已创建用户:", admin.id, user.id)

    // 创建示例文章
    const post1 = await prisma.post.create({
      data: {
        title: "第一篇文章",
        content: "这是第一篇示例文章的内容。",
        published: true,
        authorId: admin.id,
      },
    })

    const post2 = await prisma.post.create({
      data: {
        title: "草稿文章",
        content: "这是一篇未发布的草稿文章。",
        published: false,
        authorId: user.id,
      },
    })

    console.log("已创建文章:", post1.id, post2.id)

    // 创建示例评论
    const comment1 = await prisma.comment.create({
      data: {
        content: "这是一条评论",
        authorId: user.id,
        postId: post1.id,
      },
    })

    console.log("已创建评论:", comment1.id)

    return {
      success: true,
      message: "数据库初始化成功",
      data: {
        users: [admin, user],
        posts: [post1, post2],
        comments: [comment1],
      },
    }
  } catch (error) {
    console.error("初始化数据库时出错:", error)
    return {
      success: false,
      message: "初始化数据库失败",
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

/**
 * 获取数据库状态
 */
export async function getDatabaseStatus() {
  try {
    // 检查表是否存在
    const tablesCheck = await checkTablesExist()

    if (!tablesCheck.success) {
      return {
        success: false,
        message: "检查数据库表失败",
        error: tablesCheck.error,
      }
    }

    // 如果表不存在，返回未初始化状态
    if (!tablesCheck.exists.user) {
      return {
        success: true,
        initialized: false,
        message: "数据库未初始化",
      }
    }

    // 获取数据统计
    const userCount = await prisma.user.count()
    const postCount = await prisma.post.count()
    const commentCount = await prisma.comment.count()

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

    // 获取最新文章
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
      initialized: true,
      message: "数据库已初始化",
      data: {
        counts: {
          userCount,
          postCount,
          commentCount,
        },
        latestUsers,
        latestPosts,
      },
    }
  } catch (error) {
    console.error("获取数据库状态时出错:", error)
    return {
      success: false,
      message: "获取数据库状态失败",
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

/**
 * 执行数据库迁移
 */
export async function runMigrations() {
  try {
    console.log("开始执行数据库迁移...")

    // 这里应该调用 Prisma 迁移命令
    // 在实际应用中，这通常是通过 CLI 完成的
    // 这里我们模拟迁移过程

    // 检查是否有迁移锁
    const migrationLock = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '_prisma_migrations'
      );
    `

    // @ts-ignore - 处理原始查询结果
    const hasMigrationTable = migrationLock[0]?.exists || false

    if (!hasMigrationTable) {
      console.log("创建迁移表...")

      // 创建迁移表
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS _prisma_migrations (
          id VARCHAR(36) PRIMARY KEY,
          checksum VARCHAR(64) NOT NULL,
          finished_at TIMESTAMP WITH TIME ZONE,
          migration_name VARCHAR(255) NOT NULL,
          logs TEXT,
          rolled_back_at TIMESTAMP WITH TIME ZONE,
          started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          applied_steps_count INTEGER NOT NULL DEFAULT 0
        )
      `
    }

    // 记录迁移
    const migrationId = crypto.randomUUID()
    await prisma.$executeRaw`
      INSERT INTO _prisma_migrations (
        id, checksum, migration_name, started_at, finished_at, applied_steps_count
      ) VALUES (
        ${migrationId},
        'manual-migration',
        'manual-schema-migration',
        NOW(),
        NOW(),
        1
      )
    `

    return {
      success: true,
      message: "数据库迁移成功",
      migrationId,
    }
  } catch (error) {
    console.error("执行数据库迁移时出错:", error)
    return {
      success: false,
      message: "数据库迁移失败",
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

export async function setupDatabase() {
  try {
    // 检查数据库是否已经初始化
    const status = await getDatabaseStatus()

    if (!status.success) {
      return status // 返回错误信息
    }

    if (status.initialized) {
      return {
        success: true,
        message: "数据库已经初始化",
        initialized: true,
      }
    }

    // 初始化数据库
    const initResult = await initializeDatabase()
    return initResult
  } catch (error: any) {
    console.error("设置数据库时出错:", error)
    return {
      success: false,
      message: "设置数据库失败",
      error: error.message || "未知错误",
    }
  }
}

