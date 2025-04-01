import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("开始初始化数据库...")

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

    console.log("数据库初始化成功")
  } catch (error) {
    console.error("初始化数据库时出错:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

