import { NextResponse } from "next/server"
import { db } from "@/lib/db-mock"

export async function POST(request: Request) {
  try {
    console.log("生成测试数据")

    // 生成会员测试数据
    const membersResult = await generateMembers()

    // 生成积分类型测试数据
    const pointTypesResult = await generatePointTypes()

    // 生成资金类别测试数据
    const fundCategoriesResult = await generateFundCategories()

    // 生成交易记录测试数据
    const transactionsResult = await generateTransactions()

    return NextResponse.json({
      success: true,
      message: "测试数据生成成功",
      results: {
        members: membersResult,
        pointTypes: pointTypesResult,
        fundCategories: fundCategoriesResult,
        transactions: transactionsResult,
      },
    })
  } catch (error) {
    console.error("生成测试数据时出错:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "生成测试数据时出错",
      },
      { status: 500 },
    )
  }
}

// 生成会员测试数据
async function generateMembers() {
  try {
    // 清空现有数据
    await db.query("DELETE FROM members")

    // 插入测试数据
    const members = [
      { name: "张三", email: "zhangsan@example.com", phone: "13800000001", points: 100 },
      { name: "李四", email: "lisi@example.com", phone: "13800000002", points: 200 },
      { name: "王五", email: "wangwu@example.com", phone: "13800000003", points: 150 },
      { name: "赵六", email: "zhaoliu@example.com", phone: "13800000004", points: 300 },
      { name: "钱七", email: "qianqi@example.com", phone: "13800000005", points: 250 },
    ]

    for (const member of members) {
      await db.query("INSERT INTO members (name, email, phone, points) VALUES ($1, $2, $3, $4)", [
        member.name,
        member.email,
        member.phone,
        member.points,
      ])
    }

    return { count: members.length }
  } catch (error) {
    console.error("生成会员测试数据时出错:", error)
    return { error: error.message }
  }
}

// 生成积分类型测试数据
async function generatePointTypes() {
  try {
    // 清空现有数据
    await db.query("DELETE FROM point_types")

    // 插入测试数据
    const pointTypes = [
      { name: "普通积分", description: "可用于兑换商品" },
      { name: "VIP积分", description: "VIP会员专用积分" },
      { name: "活动积分", description: "参与活动获得的积分" },
      { name: "消费积分", description: "消费获得的积分" },
    ]

    for (const pointType of pointTypes) {
      await db.query("INSERT INTO point_types (name, description) VALUES ($1, $2)", [
        pointType.name,
        pointType.description,
      ])
    }

    return { count: pointTypes.length }
  } catch (error) {
    console.error("生成积分类型测试数据时出错:", error)
    return { error: error.message }
  }
}

// 生成资金类别测试数据
async function generateFundCategories() {
  try {
    // 清空现有数据
    await db.query("DELETE FROM fund_categories")

    // 插入测试数据
    const fundCategories = [
      { name: "现金", description: "现金资金" },
      { name: "信用", description: "信用资金" },
      { name: "礼品卡", description: "礼品卡资金" },
      { name: "优惠券", description: "优惠券资金" },
    ]

    for (const fundCategory of fundCategories) {
      await db.query("INSERT INTO fund_categories (name, description) VALUES ($1, $2)", [
        fundCategory.name,
        fundCategory.description,
      ])
    }

    return { count: fundCategories.length }
  } catch (error) {
    console.error("生成资金类别测试数据时出错:", error)
    return { error: error.message }
  }
}

// 生成交易记录测试数据
async function generateTransactions() {
  try {
    // 清空现有数据
    await db.query("DELETE FROM transactions")

    // 获取会员ID
    const membersResult = await db.query("SELECT id FROM members")
    const memberIds = membersResult.rows.map((row) => row.id)

    // 获取积分类型ID
    const pointTypesResult = await db.query("SELECT id FROM point_types")
    const pointTypeIds = pointTypesResult.rows.map((row) => row.id)

    // 获取资金类别ID
    const fundCategoriesResult = await db.query("SELECT id FROM fund_categories")
    const fundCategoryIds = fundCategoriesResult.rows.map((row) => row.id)

    // 交易类型
    const transactionTypes = ["deposit", "withdraw", "purchase", "refund", "point_add", "point_use"]

    // 生成随机交易记录
    const transactions = []
    const now = new Date()

    for (let i = 0; i < 20; i++) {
      const memberId = memberIds[Math.floor(Math.random() * memberIds.length)]
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)]
      const amount = Math.floor(Math.random() * 1000) + 1
      const description = `测试交易 #${i + 1}`
      const createdAt = new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      const affectsPoints = ["point_add", "point_use", "purchase"].includes(type)
      const affectsFunds = ["deposit", "withdraw", "purchase", "refund"].includes(type)
      const pointTypeId = affectsPoints ? pointTypeIds[Math.floor(Math.random() * pointTypeIds.length)] : null
      const fundCategoryId = affectsFunds ? fundCategoryIds[Math.floor(Math.random() * fundCategoryIds.length)] : null

      await db.query(
        `INSERT INTO transactions 
         (member_id, type, amount, description, created_at, affects_points, affects_funds, point_type_id, fund_category_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [memberId, type, amount, description, createdAt, affectsPoints, affectsFunds, pointTypeId, fundCategoryId],
      )

      transactions.push({
        member_id: memberId,
        type,
        amount,
        description,
        created_at: createdAt,
        affects_points: affectsPoints,
        affects_funds: affectsFunds,
        point_type_id: pointTypeId,
        fund_category_id: fundCategoryId,
      })
    }

    return { count: transactions.length }
  } catch (error) {
    console.error("生成交易记录测试数据时出错:", error)
    return { error: error.message }
  }
}

