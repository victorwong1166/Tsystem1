// 模拟数据库实现
export const db = {
  query: async (sql: string, params: any[] = []) => {
    console.log("模拟 SQL 查询:", sql)
    console.log("参数:", params)

    // 根据查询类型返回不同的模拟数据
    if (sql.toLowerCase().includes("select now()")) {
      return {
        rows: [{ now: new Date().toISOString(), time: new Date().toISOString() }],
      }
    }

    if (sql.toLowerCase().includes("select * from members")) {
      return {
        rows: [
          { id: 1, name: "张三", points: 100, created_at: new Date().toISOString() },
          { id: 2, name: "李四", points: 200, created_at: new Date().toISOString() },
        ],
      }
    }

    if (sql.toLowerCase().includes("select * from transactions")) {
      return {
        rows: [
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
      }
    }

    if (sql.toLowerCase().includes("select * from point_types")) {
      return {
        rows: [
          { id: 1, name: "普通积分", description: "可用于兑换商品" },
          { id: 2, name: "VIP积分", description: "VIP会员专用积分" },
        ],
      }
    }

    if (sql.toLowerCase().includes("select * from fund_categories")) {
      return {
        rows: [
          { id: 1, name: "现金", description: "现金资金" },
          { id: 2, name: "信用", description: "信用资金" },
        ],
      }
    }

    // 对于插入、更新和删除操作，返回成功
    if (
      sql.toLowerCase().includes("insert") ||
      sql.toLowerCase().includes("update") ||
      sql.toLowerCase().includes("delete")
    ) {
      return {
        rows: [{ id: Math.floor(Math.random() * 1000) }],
        rowCount: 1,
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

