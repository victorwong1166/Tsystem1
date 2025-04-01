import { PrismaClient } from "@prisma/client"

// PrismaClient 是在 Node.js 环境中使用的，不是在浏览器中
// 如果在浏览器中使用，会导致多个实例
// 这个方法确保我们只创建一个 PrismaClient 实例
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

