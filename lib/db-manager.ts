import { sql } from "@vercel/postgres"
import { neon } from "@neondatabase/serverless"
import prisma from "./prisma"

// 最大重试次数
const MAX_RETRIES = 3
// 重试延迟（毫秒）
const RETRY_DELAY = 1000

/**
 * 带重试逻辑的数据库查询执行器
 */
export async function executeWithRetry<T>(
  queryFn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
): Promise<T> {
  try {
    return await queryFn()
  } catch (error) {
    if (retries <= 0) {
      throw error
    }

    console.warn(`数据库查询失败，将在 ${delay}ms 后重试。剩余重试次数: ${retries}`, error)

    // 等待指定时间
    await new Promise((resolve) => setTimeout(resolve, delay))

    // 递归重试，减少重试次数
    return executeWithRetry(queryFn, retries - 1, delay * 1.5)
  }
}

/**
 * 测试 Prisma 数据库连接
 */
export async function testPrismaConnection() {
  try {
    // 检查环境变量
    if (!process.env.DATABASE_URL) {
      return {
        success: false,
        error: "DATABASE_URL 环境变量未设置",
        provider: "prisma",
      }
    }

    // 尝试执行查询
    const result = await executeWithRetry(async () => {
      return await prisma.$queryRaw`SELECT NOW() as current_time`
    })

    return {
      success: true,
      message: "Prisma 数据库连接成功",
      timestamp:
        Array.isArray(result) && result[0]?.current_time
          ? new Date(result[0].current_time).toISOString()
          : new Date().toISOString(),
      provider: "prisma",
    }
  } catch (error) {
    console.error("Prisma 数据库连接测试失败:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      provider: "prisma",
    }
  }
}

/**
 * 测试 Vercel Postgres 连接
 */
export async function testVercelConnection() {
  try {
    // 检查环境变量
    if (!process.env.DATABASE_URL) {
      return {
        success: false,
        error: "DATABASE_URL 环境变量未设置",
        provider: "vercel",
      }
    }

    // 尝试执行查询
    const result = await executeWithRetry(async () => {
      return await sql`SELECT NOW() as current_time`
    })

    return {
      success: true,
      message: "Vercel Postgres 连接成功",
      timestamp: result.rows[0]?.current_time
        ? new Date(result.rows[0].current_time).toISOString()
        : new Date().toISOString(),
      provider: "vercel",
    }
  } catch (error) {
    console.error("Vercel Postgres 连接测试失败:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      provider: "vercel",
    }
  }
}

/**
 * 测试 Neon 数据库连接
 */
export async function testNeonConnection() {
  try {
    // 检查环境变量
    if (!process.env.DATABASE_URL) {
      return {
        success: false,
        error: "DATABASE_URL 环境变量未设置",
        provider: "neon",
      }
    }

    // 创建 Neon SQL 客户端
    const neonClient = neon(process.env.DATABASE_URL)

    // 尝试执行查询
    const result = await executeWithRetry(async () => {
      return await neonClient`SELECT NOW() as current_time`
    })

    return {
      success: true,
      message: "Neon 数据库连接成功",
      timestamp:
        Array.isArray(result) && result[0]?.current_time
          ? new Date(result[0].current_time).toISOString()
          : new Date().toISOString(),
      provider: "neon",
    }
  } catch (error) {
    console.error("Neon 数据库连接测试失败:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      provider: "neon",
    }
  }
}

/**
 * 测试所有数据库连接
 */
export async function testAllConnections() {
  const results = {
    prisma: await testPrismaConnection(),
    vercel: await testVercelConnection(),
    neon: await testNeonConnection(),
    timestamp: new Date().toISOString(),
    databaseUrl: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 15)}...` : "未设置",
  }

  return results
}

/**
 * 获取数据库连接信息
 */
export async function getDatabaseInfo() {
  try {
    // 使用 Prisma 获取数据库信息
    const tableCountQuery = await prisma.$queryRaw`
      SELECT 
        table_schema,
        COUNT(*) as table_count
      FROM 
        information_schema.tables
      WHERE 
        table_schema NOT IN ('pg_catalog', 'information_schema')
      GROUP BY 
        table_schema
    `

    // 获取数据库大小
    const dbSizeQuery = await prisma.$queryRaw`
      SELECT 
        pg_database.datname AS database_name,
        pg_size_pretty(pg_database_size(pg_database.datname)) AS size
      FROM 
        pg_database
      WHERE 
        pg_database.datname = current_database()
    `

    // 获取连接信息
    const connectionQuery = await prisma.$queryRaw`
      SELECT 
        count(*) as active_connections
      FROM 
        pg_stat_activity
      WHERE 
        state = 'active'
    `

    return {
      success: true,
      schemas: tableCountQuery,
      size: dbSizeQuery,
      connections: connectionQuery,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("获取数据库信息失败:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    }
  }
}

/**
 * 执行数据库健康检查
 */
export async function performHealthCheck() {
  try {
    // 测试连接
    const connectionTest = await testPrismaConnection()

    if (!connectionTest.success) {
      return {
        success: false,
        status: "error",
        message: "数据库连接失败",
        details: connectionTest.error,
        timestamp: new Date().toISOString(),
      }
    }

    // 测试读写操作
    const writeResult = await executeWithRetry(async () => {
      // 创建临时测试表
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS _health_check (
          id SERIAL PRIMARY KEY,
          timestamp TIMESTAMP DEFAULT NOW()
        )
      `

      // 写入测试数据
      await prisma.$executeRaw`
        INSERT INTO _health_check (timestamp) VALUES (NOW())
      `

      // 读取测试数据
      const result = await prisma.$queryRaw`
        SELECT * FROM _health_check ORDER BY timestamp DESC LIMIT 1
      `

      // 清理测试数据（保留表结构）
      await prisma.$executeRaw`
        DELETE FROM _health_check WHERE id = (SELECT MAX(id) FROM _health_check)
      `

      return result
    })

    return {
      success: true,
      status: "healthy",
      message: "数据库健康检查通过",
      details: {
        connection: connectionTest,
        readWrite: {
          success: true,
          data: writeResult,
        },
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("数据库健康检查失败:", error)
    return {
      success: false,
      status: "error",
      message: "数据库健康检查失败",
      details: error instanceof Error ? error.message : "未知错误",
      timestamp: new Date().toISOString(),
    }
  }
}

