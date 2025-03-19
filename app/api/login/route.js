// app/api/login/route.js
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    // 在實際應用中，您應該從數據庫中獲取用戶並驗證密碼
    // 這裡我們使用硬編碼的憑據進行演示
    if (username === "admin" && password === "admin") {
      // 設置會話cookie
      cookies().set("auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 一周
        path: "/",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "用戶名或密碼不正確" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

