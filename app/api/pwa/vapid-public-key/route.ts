import { NextResponse } from "next/server"

// 這裡應該是您的 VAPID 公鑰
// 在實際應用中，應該從環境變量中獲取
const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"

export async function GET() {
  return new NextResponse(VAPID_PUBLIC_KEY)
}

