import { NextResponse } from "next/server"
import {
  getMemberFunds,
  updateMemberFunds,
  getAllMemberFunds,
  addMemberFunds,
  deductMemberFunds,
  freezeMemberFunds,
  unfreezeMemberFunds,
} from "@/lib/funds"

// 獲取會員資金信息
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get("memberId")

    if (memberId) {
      // 獲取特定會員的資金信息
      const result = await getMemberFunds(Number.parseInt(memberId))

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }

      return NextResponse.json({ success: true, data: result.data })
    } else {
      // 獲取所有會員的資金信息
      const result = await getAllMemberFunds()

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 })
      }

      return NextResponse.json({ success: true, data: result.data })
    }
  } catch (error) {
    console.error("獲取資金信息錯誤:", error)
    return NextResponse.json(
      { success: false, error: "獲取資金信息錯誤: " + (error as Error).message },
      { status: 500 },
    )
  }
}

// 更新會員資金信息
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { memberId, action, amount, data } = body

    if (!memberId) {
      return NextResponse.json({ success: false, error: "缺少會員ID" }, { status: 400 })
    }

    // 根據不同的操作執行不同的資金操作
    if (action) {
      let result

      switch (action) {
        case "add":
          if (!amount) {
            return NextResponse.json({ success: false, error: "缺少金額" }, { status: 400 })
          }
          result = await addMemberFunds(memberId, Number.parseFloat(amount))
          break

        case "deduct":
          if (!amount) {
            return NextResponse.json({ success: false, error: "缺少金額" }, { status: 400 })
          }
          result = await deductMemberFunds(memberId, Number.parseFloat(amount))
          break

        case "freeze":
          if (!amount) {
            return NextResponse.json({ success: false, error: "缺少金額" }, { status: 400 })
          }
          result = await freezeMemberFunds(memberId, Number.parseFloat(amount))
          break

        case "unfreeze":
          if (!amount) {
            return NextResponse.json({ success: false, error: "缺少金額" }, { status: 400 })
          }
          result = await unfreezeMemberFunds(memberId, Number.parseFloat(amount))
          break

        case "update":
          if (!data) {
            return NextResponse.json({ success: false, error: "缺少更新數據" }, { status: 400 })
          }
          result = await updateMemberFunds(memberId, data)
          break

        default:
          return NextResponse.json({ success: false, error: "不支持的操作" }, { status: 400 })
      }

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }

      return NextResponse.json({ success: true, data: result.data })
    } else if (data) {
      // 直接更新資金信息
      const result = await updateMemberFunds(memberId, data)

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }

      return NextResponse.json({ success: true, data: result.data })
    } else {
      return NextResponse.json({ success: false, error: "缺少操作或更新數據" }, { status: 400 })
    }
  } catch (error) {
    console.error("更新資金信息錯誤:", error)
    return NextResponse.json(
      { success: false, error: "更新資金信息錯誤: " + (error as Error).message },
      { status: 500 },
    )
  }
}

