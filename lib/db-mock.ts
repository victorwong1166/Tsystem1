// 模拟数据库实现

// 模拟数据存储
const mockDatabase: Record<string, any[]> = {
  members: [
    { id: 1, name: "张三", email: "zhangsan@example.com", phone: "13800000001", points: 100 },
    { id: 2, name: "李四", email: "lisi@example.com", phone: "13800000002", points: 200 },
    { id: 3, name: "王五", email: "wangwu@example.com", phone: "13800000003", points: 150 },
  ],
  transactions: [
    {
      id: 1,
      member_id: 1,
      type: "deposit",
      amount: 1000,
      description: "初始存款",
      created_at: new Date().toISOString(),
      affects_points: false,
      affects_funds: true,
      point_type_id: null,
      fund_category_id: 1,
    },
    {
      id: 2,
      member_id: 2,
      type: "point_add",
      amount: 500,
      description: "积分奖励",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      affects_points: true,
      affects_funds: false,
      point_type_id: 1,
      fund_category_id: null,
    },
  ],
  point_types: [
    { id: 1, name: "普通积分", description: "可用于兑换商品" },
    { id: 2, name: "VIP积分", description: "VIP会员专用积分" },
  ],
  fund_categories: [
    { id: 1, name: "现金", description: "现金资金" },
    { id: 2, name: "信用", description: "信用资金" },
  ],
  member_points: [],
  member_funds: [],
}

// 模拟数据库操作
export const db = {
  query: async (sql: string, params: any[] = []) => {
    console.log("模拟 SQL 查询:", sql)
    console.log("参数:", params)

    // 处理特殊查询
    if (sql.toLowerCase().includes("select now()")) {
      return {
        rows: [{ now: new Date().toISOString(), time: new Date().toISOString() }],
      }
    }

    // 处理删除操作
    if (sql.toLowerCase().includes("delete from")) {
      const tableName = sql.toLowerCase().split("delete from")[1].trim().split(" ")[0]
      if (mockDatabase[tableName]) {
        mockDatabase[tableName] = []
        return { rowCount: 0 }
      }
    }

    // 处理插入操作
    if (sql.toLowerCase().includes("insert into")) {
      const tableName = sql.toLowerCase().split("insert into")[1].trim().split(" ")[0]

      if (mockDatabase[tableName]) {
        const newId =
          mockDatabase[tableName].length > 0 ? Math.max(...mockDatabase[tableName].map((item) => item.id || 0)) + 1 : 1

        const newItem: any = { id: newId }

        // 从 SQL 中提取列名
        const columnsMatch = sql.match(/$$([^)]+)$$/)
        if (columnsMatch && columnsMatch[1]) {
          const columns = columnsMatch[1].split(",").map((col) => col.trim())

          // 设置列值
          columns.forEach((col, index) => {
            if (col !== "id") {
              newItem[col] = params[index]
            }
          })

          mockDatabase[tableName].push(newItem)
          return { rows: [newItem], rowCount: 1 }
        }
      }
    }

    // 处理选择操作
    if (sql.toLowerCase().includes("select")) {
      // 提取表名
      const fromMatch = sql.toLowerCase().match(/from\s+([a-z_]+)/i)
      if (fromMatch && fromMatch[1]) {
        const tableName = fromMatch[1]

        if (mockDatabase[tableName]) {
          // 处理 WHERE 条件
          if (sql.toLowerCase().includes("where")) {
            // 非常简单的 WHERE 解析，仅用于演示
            const whereClause = sql.toLowerCase().split("where")[1].trim()

            // 处理 id = ? 条件
            if (whereClause.includes("id =")) {
              const id = params[0]
              const filteredRows = mockDatabase[tableName].filter((item) => item.id === id)
              return { rows: filteredRows }
            }
          }

          // 如果没有特殊条件，返回所有行
          return { rows: mockDatabase[tableName] }
        }
      }
    }

    // 默认返回空结果
    return { rows: [], rowCount: 0 }
  },

  execute: async (sql: string, params: any[] = []) => {
    return db.query(sql, params)
  },
}

// 导出模拟池对象
export const pool = {
  query: db.query,
  connect: async () => {
    console.log("模拟数据库连接")
    return {
      query: db.query,
      release: () => console.log("模拟释放连接"),
    }
  },
  end: async () => {
    console.log("模拟关闭数据库连接池")
  },
}

// 测试连接函数
export async function testConnection() {
  try {
    const result = await db.query("SELECT NOW() as time")
    return {
      success: true,
      message: "数据库连接成功",
      time: result.rows[0].time,
    }
  } catch (error) {
    console.error("测试数据库连接失败:", error)
    return {
      success: false,
      message: "数据库连接失败: " + (error.message || "未知错误"),
    }
  }
}

