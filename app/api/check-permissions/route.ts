import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 })
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    const client = await pool.connect()
    try {
      // 检查是否可以创建临时表
      await client.query("CREATE TABLE IF NOT EXISTS _permission_test (id SERIAL PRIMARY KEY, test TEXT)")

      // 检查是否可以插入数据
      await client.query("INSERT INTO _permission_test (test) VALUES ($1)", ["test_value"])

      // 检查是否可以查询数据
      const selectResult = await client.query("SELECT * FROM _permission_test")

      // 检查是否可以更新数据
      await client.query("UPDATE _permission_test SET test = $1 WHERE test = $2", ["updated_value", "test_value"])

      // 检查是否可以删除数据
      await client.query("DELETE FROM _permission_test WHERE test = $1", ["updated_value"])

      // 检查是否可以删除表
      await client.query("DROP TABLE _permission_test")

      return NextResponse.json({
        success: true,
        message: "权限检查通过",
        permissions: {
          connect: true,
          create: true,
          insert: true,
          select: true,
          update: true,
          delete: true,
          drop: true,
        },
      })
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "未知错误",
          hint: "数据库用户权限不足",
        },
        { status: 500 },
      )
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error) {
    console.error("权限检查错误:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

