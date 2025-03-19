// 导入模拟的 Neon 客户端
import neonMock from "./neon-mock"

// 获取 Neon 客户端的包装函数
export function getNeonClient() {
  // 尝试从 @neondatabase/serverless 导入 neon
  // 如果失败，使用我们的模拟实现
  let neonClient
  try {
    // 使用 require 而不是动态 import，避免构建时错误
    const { neon } = require("@neondatabase/serverless")

    // 如果没有设置 DATABASE_URL，使用模拟实现
    if (!process.env.DATABASE_URL) {
      console.log("未设置 DATABASE_URL，使用模拟 Neon 客户端")
      return neonMock
    }

    neonClient = neon
  } catch (error) {
    console.log("无法导入 @neondatabase/serverless，使用模拟实现")
    neonClient = neonMock
  }

  // 返回一个包装函数，确保即使在没有连接字符串的情况下也能工作
  return (connectionString?: string) => {
    if (!connectionString) {
      console.log("未提供 Neon 数据库连接字符串，使用模拟实现")
      return neonMock()
    }

    try {
      return neonClient(connectionString)
    } catch (error) {
      console.error("创建 Neon 客户端时出错:", error)
      return neonMock()
    }
  }
}

// 导出包装后的 Neon 客户端
export const safeNeon = getNeonClient()

// 默认导出
export default safeNeon

