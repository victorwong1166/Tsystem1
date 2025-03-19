// 模拟数据库实现，不依赖任何外部模块

// 模拟数据存储
const mockDatabase: Record<string, any[]> = {
  members: [
    { id: 1, name: "张三", email: "zhangsan@example.com", points: 100 },
    { id: 2, name: "李四", email: "lisi@example.com", points: 200 },
    { id: 3, name: "王五", email: "wangwu@example.com", points: 150 },
  ],
  transactions: [
    {
      id: 1,
      member_id: 1,
      transaction_time: new Date(),
      transaction_type: "购买",
      amount: 100,
      points: 10,
      description: "购买商品",
    },
    {
      id: 2,
      member_id: 2,
      transaction_time: new Date(),
      transaction_type: "充值",
      amount: 200,
      points: 20,
      description: "账户充值",
    },
  ],
  signs: [
    {
      id: 1,
      member_id: 1,
      sign_time: new Date(),
      sign_type: "签到",
      points: 5,
    },
    {
      id: 2,
      member_id: 2,
      sign_time: new Date(),
      sign_type: "签到",
      points: 5,
    },
  ],
  points: [],
  funds: [],
}

// 模拟数据库连接池
export const pool = {
  query: async (text: string, params: any[] = []) => {
    console.log("模拟数据库查询:", { text, params })

    // 简单的查询解析器，仅用于基本操作
    if (text.toLowerCase().includes("select")) {
      const tableName = extractTableName(text)
      return { rows: mockDatabase[tableName] || [] }
    }

    return { rows: [] }
  },
  connect: async () => {
    console.log("模拟数据库连接")
    return {
      query: async () => ({ rows: [] }),
      release: () => {},
    }
  },
  end: async () => {
    console.log("模拟数据库连接结束")
  },
  sql: async (strings: TemplateStringsArray, ...values: any[]) => {
    // 构建查询字符串
    let text = strings[0]
    for (let i = 0; i < values.length; i++) {
      text += `$${i + 1}${strings[i + 1] || ""}`
    }

    console.log("模拟 SQL 查询:", text)

    // 简单的查询解析器，仅用于基本操作
    if (text.toLowerCase().includes("select")) {
      const tableName = extractTableName(text)
      return { rows: mockDatabase[tableName] || [] }
    }

    return { rows: [] }
  },
}

// 模拟 SQL 模板标签函数
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  // 构建查询字符串
  let text = strings[0]
  for (let i = 0; i < values.length; i++) {
    text += `$${i + 1}${strings[i + 1] || ""}`
  }

  console.log("模拟 SQL 查询:", text)

  // 简单的查询解析器，仅用于基本操作
  if (text.toLowerCase().includes("select")) {
    const tableName = extractTableName(text)
    return { rows: mockDatabase[tableName] || [] }
  }

  return { rows: [] }
}

// 模拟数据库对象
export const db = {
  query: pool.query,
  connect: pool.connect,
  end: pool.end,
  sql: sql,
}

// 辅助函数：从 SQL 查询中提取表名
function extractTableName(query: string): string {
  // 非常简单的实现，仅用于演示
  const fromMatch = query.match(/from\s+([a-z_]+)/i)
  if (fromMatch && fromMatch[1]) {
    return fromMatch[1]
  }

  // 默认返回空表
  return ""
}

