import { PrismaClient } from "@prisma/client"

// 防止在开发环境中创建多个 Prisma 实例
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

