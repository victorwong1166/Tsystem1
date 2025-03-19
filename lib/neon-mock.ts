// 模拟 Neon 数据库客户端
export function neon(connectionString?: string) {
  // 如果没有提供连接字符串，使用模拟实现
  if (!connectionString) {
    console.log("未提供 Neon 数据库连接字符串，使用模拟实现")

    // 返回一个模拟的 SQL 执行函数
    return async (sql: string, ...params: any[]) => {
      console.log("模拟 Neon SQL 查询:", sql, params)

      // 处理特殊查询
      if (sql.toLowerCase().includes("select 1")) {
        return [{ "?column?": 1 }]
      }

      if (sql.toLowerCase().includes("select now()")) {
        return [{ now: new Date().toISOString() }]
      }

      // 默认返回空数组
      return []
    }
  }

  // 如果提供了连接字符串，但我们知道它在构建时不可用
  // 仍然返回模拟实现
  console.log("提供了 Neon 数据库连接字符串，但在构建时使用模拟实现")
  return async (sql: string, ...params: any[]) => {
    console.log("模拟 Neon SQL 查询 (构建时):", sql, params)
    return []
  }
}

// 导出模拟的 Neon 客户端
export default neon

