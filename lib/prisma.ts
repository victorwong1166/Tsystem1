import { PrismaClient } from "@prisma/client"

// 定义全局类型
declare global {
  var prisma: PrismaClient | undefined
}

// 连接选项
const prismaOptions = {
  log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  errorFormat: "pretty" as const,
}

// 创建 Prisma 客户端实例
export const prisma = globalThis.prisma || new PrismaClient(prismaOptions)

// 在开发环境中保存到全局变量，避免热重载时创建多个实例
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma

// 导出默认实例
export default prisma

// 导出连接测试函数
export async function testPrismaConnection() {
  try {
    // 尝试执行简单查询
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    return {
      success: true,
      message: "Prisma 数据库连接成功",
      timestamp: new Date().toISOString(),
      data: result,
    }
  } catch (error) {
    console.error("Prisma 数据库连接测试失败:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      timestamp: new Date().toISOString(),
    }
  }
}

