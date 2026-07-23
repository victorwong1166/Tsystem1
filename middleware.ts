import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { dynamicPaths } from "./app/static-paths"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 檢查是否是動態路徑
  const isDynamicPath = dynamicPaths.some((dynamicPath) => path === dynamicPath || path.startsWith(`${dynamicPath}/`))

  // 如果是動態路徑，添加一個頭部標記，表示這是一個動態路由
  if (isDynamicPath) {
    const response = NextResponse.next()
    response.headers.set("x-dynamic-route", "true")
    return response
  }

  // ===== POS 系統權限防護 =====
  // 檢查登入狀態和角色
  const userRole = request.cookies.get("userRole")?.value || ""
  const userId = request.cookies.get("userId")?.value || ""
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true"

  // POS 相關路徑需要登入且角色為 STAFF 或以上
  const posProtectedPaths = ["/dashboard"]
  const isPosPath = posProtectedPaths.some((p) => path === p || path.startsWith(`${p}/`))

  if (isPosPath && !isLoggedIn) {
    // 未登入，重定向到登入頁
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isPosPath && isLoggedIn && !["STAFF", "MANAGER", "ADMIN"].includes(userRole)) {
    // 沒有權限訪問，重定向到首頁
    return NextResponse.redirect(new URL("/", request.url))
  }

  // 將用戶角色資訊添加到請求頭，供後端使用
  const response = NextResponse.next()
  if (userId) response.headers.set("x-user-id", userId)
  if (userRole) response.headers.set("x-user-role", userRole)

  return response
}

export const config = {
  matcher: [
    /*
     * 匹配所有路徑，除了:
     * - API 路由
     * - _next 靜態文件
     * - 靜態文件（如圖片、字體等）
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
}

