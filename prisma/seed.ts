import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("开始数据库种子填充...")

    // 清理现有数据
    console.log("清理现有数据...")
    await prisma.notification.deleteMany({})
    await prisma.transaction.deleteMany({})
    await prisma.tagOnPost.deleteMany({})
    await prisma.categoryOnPost.deleteMany({})
    await prisma.comment.deleteMany({})
    await prisma.post.deleteMany({})
    await prisma.tag.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.setting.deleteMany({})

    console.log("创建用户...")
    // 创建管理员用户
    const adminPassword = await hash("admin123", 10)
    const admin = await prisma.user.create({
      data: {
        name: "系统管理员",
        email: "admin@example.com",
        password: adminPassword,
        role: "ADMIN",
        bio: "系统管理员账户",
      },
    })

    // 创建编辑用户
    const editorPassword = await hash("editor123", 10)
    const editor = await prisma.user.create({
      data: {
        name: "内容编辑",
        email: "editor@example.com",
        password: editorPassword,
        role: "EDITOR",
        bio: "负责内容编辑和审核",
      },
    })

    // 创建普通用户
    const userPassword = await hash("user123", 10)
    const user = await prisma.user.create({
      data: {
        name: "测试用户",
        email: "user@example.com",
        password: userPassword,
        role: "USER",
        bio: "普通测试用户账户",
      },
    })

    console.log("创建分类...")
    // 创建分类
    const categories = await Promise.all([
      prisma.category.create({ data: { name: "技术" } }),
      prisma.category.create({ data: { name: "生活" } }),
      prisma.category.create({ data: { name: "工作" } }),
      prisma.category.create({ data: { name: "学习" } }),
    ])

    console.log("创建标签...")
    // 创建标签
    const tags = await Promise.all([
      prisma.tag.create({ data: { name: "JavaScript" } }),
      prisma.tag.create({ data: { name: "React" } }),
      prisma.tag.create({ data: { name: "Next.js" } }),
      prisma.tag.create({ data: { name: "Prisma" } }),
      prisma.tag.create({ data: { name: "数据库" } }),
      prisma.tag.create({ data: { name: "前端" } }),
      prisma.tag.create({ data: { name: "后端" } }),
    ])

    console.log("创建文章...")
    // 创建文章
    const post1 = await prisma.post.create({
      data: {
        title: "使用 Next.js 和 Prisma 构建现代应用",
        content:
          "这是一篇关于如何使用 Next.js 和 Prisma 构建现代全栈应用的文章。Next.js 是一个流行的 React 框架，而 Prisma 是一个现代的数据库工具。",
        published: true,
        authorId: admin.id,
      },
    })

    const post2 = await prisma.post.create({
      data: {
        title: "Prisma 数据库迁移指南",
        content: "本文将介绍如何使用 Prisma 进行数据库迁移，包括创建模型、生成迁移文件和应用迁移。",
        published: true,
        authorId: editor.id,
      },
    })

    const post3 = await prisma.post.create({
      data: {
        title: "我的学习笔记",
        content: "这是我最近学习的一些笔记和心得体会。",
        published: false,
        authorId: user.id,
      },
    })

    console.log("添加分类和标签到文章...")
    // 添加分类和标签到文章
    await prisma.categoryOnPost.createMany({
      data: [
        { postId: post1.id, categoryId: categories[0].id }, // 技术
        { postId: post2.id, categoryId: categories[0].id }, // 技术
        { postId: post2.id, categoryId: categories[3].id }, // 学习
        { postId: post3.id, categoryId: categories[3].id }, // 学习
      ],
    })

    await prisma.tagOnPost.createMany({
      data: [
        { postId: post1.id, tagId: tags[1].id }, // React
        { postId: post1.id, tagId: tags[2].id }, // Next.js
        { postId: post1.id, tagId: tags[3].id }, // Prisma
        { postId: post2.id, tagId: tags[3].id }, // Prisma
        { postId: post2.id, tagId: tags[4].id }, // 数据库
        { postId: post3.id, tagId: tags[3].id }, // Prisma
      ],
    })

    console.log("创建评论...")
    // 创建评论
    await prisma.comment.createMany({
      data: [
        {
          content: "非常有用的文章，谢谢分享！",
          postId: post1.id,
          authorId: user.id,
        },
        {
          content: "这篇文章解决了我的问题，感谢！",
          postId: post1.id,
          authorId: editor.id,
        },
        {
          content: "我对 Prisma 迁移有一些疑问，可以详细解释一下吗？",
          postId: post2.id,
          authorId: user.id,
        },
      ],
    })

    console.log("创建交易记录...")
    // 创建交易记录
    await prisma.transaction.createMany({
      data: [
        {
          amount: 100.0,
          description: "初始存款",
          type: "DEPOSIT",
          status: "COMPLETED",
          userId: user.id,
        },
        {
          amount: 50.0,
          description: "购买服务",
          type: "WITHDRAWAL",
          status: "COMPLETED",
          userId: user.id,
        },
        {
          amount: 25.0,
          description: "转账给朋友",
          type: "TRANSFER",
          status: "PENDING",
          userId: user.id,
        },
      ],
    })

    console.log("创建通知...")
    // 创建通知
    await prisma.notification.createMany({
      data: [
        {
          title: "欢迎使用系统",
          content: "感谢您注册我们的系统，希望您使用愉快！",
          type: "INFO",
          userId: user.id,
        },
        {
          title: "交易成功",
          content: "您的存款交易已成功完成。",
          type: "SUCCESS",
          userId: user.id,
        },
        {
          title: "待处理交易",
          content: "您有一笔待处理的转账交易。",
          type: "WARNING",
          userId: user.id,
        },
      ],
    })

    console.log("创建系统设置...")
    // 创建系统设置
    await prisma.setting.createMany({
      data: [
        { key: "SITE_NAME", value: "我的应用" },
        { key: "SITE_DESCRIPTION", value: "一个使用 Next.js 和 Prisma 构建的现代应用" },
        { key: "MAINTENANCE_MODE", value: "false" },
        { key: "ALLOW_SIGNUPS", value: "true" },
      ],
    })

    console.log("数据库种子填充完成！")
  } catch (error) {
    console.error("数据库种子填充错误:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

