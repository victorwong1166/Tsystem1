"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// 创建用户的服务器操作
export async function createUser(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // 基本验证
    if (!name || !email || !password) {
      return {
        error: "所有字段都是必填的",
        success: false,
      }
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        error: "该邮箱已被注册",
        success: false,
      }
    }

    // 创建新用户
    await prisma.user.create({
      data: {
        name,
        email,
        password, // 注意：实际应用中应该对密码进行哈希处理
      },
    })

    // 重新验证用户列表页面
    revalidatePath("/users")

    return {
      message: "用户创建成功",
      success: true,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      error: "创建用户时发生错误",
      success: false,
    }
  }
}

// 更新用户的服务器操作
export async function updateUser(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return {
        error: "用户不存在",
        success: false,
      }
    }

    // 更新用户
    await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    })

    // 重新验证用户页面
    revalidatePath(`/users/${id}`)
    revalidatePath("/users")

    return {
      message: "用户更新成功",
      success: true,
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      error: "更新用户时发生错误",
      success: false,
    }
  }
}

// 删除用户的服务器操作
export async function deleteUser(id: string) {
  try {
    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return {
        error: "用户不存在",
        success: false,
      }
    }

    // 删除用户
    await prisma.user.delete({
      where: { id },
    })

    // 重新验证用户列表页面
    revalidatePath("/users")

    // 重定向到用户列表页面
    redirect("/users")
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      error: "删除用户时发生错误",
      success: false,
    }
  }
}

