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

  return NextResponse.next()
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

