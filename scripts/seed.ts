import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  try {
    // 创建管理员用户
    const adminPassword = await hash("admin123", 12)
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: "ADMIN",
      },
    })
    console.log("管理员用户创建成功:", admin.email)

    // 创建测试用户
    const userPassword = await hash("user123", 12)
    const user = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        name: "Test User",
        email: "user@example.com",
        password: userPassword,
        role: "USER",
        profile: {
          create: {
            phone: "123-456-7890",
            address: "123 Test St",
            city: "测试城市",
            country: "中国",
          },
        },
      },
    })
    console.log("测试用户创建成功:", user.email)

    // 创建产品类别
    const categories = [
      { name: "电子产品", slug: "electronics" },
      { name: "服装", slug: "clothing" },
      { name: "家居", slug: "home" },
      { name: "书籍", slug: "books" },
    ]

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      })
    }
    console.log("产品类别创建成功")

    // 创建产品
    const electronicsCategory = await prisma.category.findUnique({
      where: { slug: "electronics" },
    })

    const clothingCategory = await prisma.category.findUnique({
      where: { slug: "clothing" },
    })

    if (electronicsCategory && clothingCategory) {
      const products = [
        {
          name: "智能手机",
          description: "最新款智能手机，拥有高性能处理器和出色的相机系统。",
          price: 3999.99,
          stock: 50,
          categoryId: electronicsCategory.id,
          image: "https://placehold.co/600x400?text=智能手机",
        },
        {
          name: "笔记本电脑",
          description: "轻薄便携的笔记本电脑，适合工作和娱乐。",
          price: 5999.99,
          stock: 30,
          categoryId: electronicsCategory.id,
          image: "https://placehold.co/600x400?text=笔记本电脑",
        },
        {
          name: "T恤",
          description: "舒适的纯棉T恤，多种颜色可选。",
          price: 99.99,
          stock: 100,
          categoryId: clothingCategory.id,
          image: "https://placehold.co/600x400?text=T恤",
        },
        {
          name: "牛仔裤",
          description: "经典款牛仔裤，耐穿且时尚。",
          price: 199.99,
          stock: 80,
          categoryId: clothingCategory.id,
          image: "https://placehold.co/600x400?text=牛仔裤",
        },
      ]

      for (const product of products) {
        await prisma.product.upsert({
          where: { id: product.name },
          update: {},
          create: product,
        })
      }
      console.log("产品创建成功")
    }

    console.log("数据库初始化完成")
  } catch (error) {
    console.error("数据库初始化失败:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

