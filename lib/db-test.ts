import { sql } from "@vercel/postgres"

export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT NOW()`
    return { success: true, timestamp: result.rows[0].now }
  } catch (error) {
    console.error("Database test error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function testDatabaseWrite() {
  try {
    // 创建一个临时表进行测试
    await sql`CREATE TABLE IF NOT EXISTS test_write (id SERIAL PRIMARY KEY, data TEXT, created_at TIMESTAMP DEFAULT NOW())`

    // 写入一些测试数据
    const result =
      await sql`INSERT INTO test_write (data) VALUES ('Test data at ${new Date().toISOString()}') RETURNING *`

    return {
      success: true,
      message: "数据写入成功",
      data: result.rows[0],
    }
  } catch (error) {
    console.error("Database write test error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function testDatabasePerformance() {
  try {
    const startTime = Date.now()

    // 创建一个临时表进行测试
    await sql`CREATE TABLE IF NOT EXISTS performance_test (id SERIAL PRIMARY KEY, data TEXT, created_at TIMESTAMP DEFAULT NOW())`

    // 执行多次写入操作
    const iterations = 10
    for (let i = 0; i < iterations; i++) {
      await sql`INSERT INTO performance_test (data) VALUES ('Performance test ${i} at ${new Date().toISOString()}')`
    }

    // 执行读取操作
    await sql`SELECT * FROM performance_test ORDER BY created_at DESC LIMIT 100`

    const endTime = Date.now()
    const duration = endTime - startTime

    return {
      success: true,
      message: "性能测试完成",
      duration,
      operationsPerSecond: (iterations / (duration / 1000)).toFixed(2),
    }
  } catch (error) {
    console.error("Database performance test error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

