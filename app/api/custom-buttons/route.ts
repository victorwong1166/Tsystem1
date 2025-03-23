import { NextResponse } from "next/server"
import { db } from "@/lib/db-connect"
import { customButtons } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// 獲取所有自定義按鈕
export async function GET() {
  try {
    const buttons = await db.select().from(customButtons).orderBy(customButtons.sortOrder)

    return NextResponse.json({
      success: true,
      data: buttons,
    })
  } catch (error) {
    console.error("Error fetching custom buttons:", error)
    return NextResponse.json(
      {
        success: false,
        error: "獲取自定義按鈕失敗",
      },
      { status: 500 },
    )
  }
}

// 創建新的自定義按鈕
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "未授權操作",
        },
        { status: 403 },
      )
    }

    const data = await request.json()

    // 驗證必填字段
    if (!data.name || !data.displayName || !data.buttonType || !data.value) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少必填字段",
        },
        { status: 400 },
      )
    }

    // 創建新按鈕
    const newButton = await db
      .insert(customButtons)
      .values({
        name: data.name,
        displayName: data.displayName,
        buttonType: data.buttonType,
        value: data.value,
        color: data.color || "#3b82f6",
        icon: data.icon,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdBy: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: newButton[0],
    })
  } catch (error) {
    console.error("Error creating custom button:", error)
    return NextResponse.json(
      {
        success: false,
        error: "創建自定義按鈕失敗",
      },
      { status: 500 },
    )
  }
}

// 更新自定義按鈕
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "未授權操作",
        },
        { status: 403 },
      )
    }

    const data = await request.json()

    // 驗證必填字段
    if (!data.id) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少按鈕ID",
        },
        { status: 400 },
      )
    }

    // 更新按鈕
    const updateData: any = {
      updatedAt: new Date(),
    }

    // 只更新提供的字段
    if (data.name !== undefined) updateData.name = data.name
    if (data.displayName !== undefined) updateData.displayName = data.displayName
    if (data.buttonType !== undefined) updateData.buttonType = data.buttonType
    if (data.value !== undefined) updateData.value = data.value
    if (data.color !== undefined) updateData.color = data.color
    if (data.icon !== undefined) updateData.icon = data.icon
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    const updatedButton = await db
      .update(customButtons)
      .set(updateData)
      .where(eq(customButtons.id, data.id))
      .returning()

    if (updatedButton.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "按鈕不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedButton[0],
    })
  } catch (error) {
    console.error("Error updating custom button:", error)
    return NextResponse.json(
      {
        success: false,
        error: "更新自定義按鈕失敗",
      },
      { status: 500 },
    )
  }
}

// 刪除自定義按鈕
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "未授權操作",
        },
        { status: 403 },
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少按鈕ID",
        },
        { status: 400 },
      )
    }

    const deletedButton = await db
      .delete(customButtons)
      .where(eq(customButtons.id, Number.parseInt(id)))
      .returning()

    if (deletedButton.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "按鈕不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: deletedButton[0],
    })
  } catch (error) {
    console.error("Error deleting custom button:", error)
    return NextResponse.json(
      {
        success: false,
        error: "刪除自定義按鈕失敗",
      },
      { status: 500 },
    )
  }
}

