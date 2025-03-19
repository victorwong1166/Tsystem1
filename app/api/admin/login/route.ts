import { NextResponse } from "next/server"

// 這只是一個簡單的示例。在實際應用中，您應該使用更安全的方法來存儲和驗證憑據
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "password123"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 簡單的憑據檢查
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // 在實際應用中，您應該設置一個安全的 JWT 或會話 cookie
      return NextResponse.json({ success: true, message: "登入成功" })
    } else {
      return NextResponse.json({ success: false, message: "用戶名或密碼錯誤" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "登入過程中發生錯誤" }, { status: 500 })
  }
}

