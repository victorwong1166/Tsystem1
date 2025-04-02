import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("开始初始化数据库...")

    // 创建管理员用户
    const adminPassword = await hash("admin123", 10)
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        name: "管理员",
        email: "admin@example.com",
        password: adminPassword,
        role: "ADMIN",
      },
    })
    console.log("管理员用户创建成功:", admin.id)

    // 创建测试用户
    const userPassword = await hash("user123", 10)
    const user = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        name: "测试用户",
        email: "user@example.com",
        password: userPassword,
        role: "USER",
      },
    })
    console.log("测试用户创建成功:", user.id)

    // 创建示例产品
    const products = await Promise.all([
      prisma.product.upsert({
        where: { id: "prod_1" },
        update: {},
        create: {
          id: "prod_1",
          name: "产品 1",
          description: "这是产品1的描述",
          price: 99.99,
          stock: 100,
          imageUrl: "/placeholder.svg?height=200&width=200",
        },
      }),
      prisma.product.upsert({
        where: { id: "prod_2" },
        update: {},
        create: {
          id: "prod_2",
          name: "产品 2",
          description: "这是产品2的描述",
          price: 149.99,
          stock: 50,
          imageUrl: "/placeholder.svg?height=200&width=200",
        },
      }),
    ])
    console.log(`创建了 ${products.length} 个产品`)

    console.log("数据库初始化完成！")
  } catch (error) {
    console.error("数据库初始化失败:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

