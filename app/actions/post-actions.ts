"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// 创建帖子的服务器操作
export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const authorId = formData.get("authorId") as string
    const publishedValue = formData.get("published")
    const published = publishedValue === "true" || publishedValue === "on"

    // 基本验证
    if (!title || !authorId) {
      return {
        error: "标题和作者ID是必填的",
        success: false,
      }
    }

    // 检查作者是否存在
    const author = await prisma.user.findUnique({
      where: { id: authorId },
    })

    if (!author) {
      return {
        error: "作者不存在",
        success: false,
      }
    }

    // 创建新帖子
    await prisma.post.create({
      data: {
        title,
        content,
        published,
        author: {
          connect: { id: authorId },
        },
      },
    })

    // 重新验证帖子列表页面
    revalidatePath("/posts")

    return {
      message: "帖子创建成功",
      success: true,
    }
  } catch (error) {
    console.error("Error creating post:", error)
    return {
      error: "创建帖子时发生错误",
      success: false,
    }
  }
}

// 更新帖子的服务器操作
export async function updatePost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const publishedValue = formData.get("published")
    const published = publishedValue === "true" || publishedValue === "on"

    // 检查帖子是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return {
        error: "帖子不存在",
        success: false,
      }
    }

    // 更新帖子
    await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(publishedValue !== null && { published }),
      },
    })

    // 重新验证帖子页面
    revalidatePath(`/posts/${id}`)
    revalidatePath("/posts")

    return {
      message: "帖子更新成功",
      success: true,
    }
  } catch (error) {
    console.error("Error updating post:", error)
    return {
      error: "更新帖子时发生错误",
      success: false,
    }
  }
}

// 删除帖子的服务器操作
export async function deletePost(id: string) {
  try {
    // 检查帖子是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return {
        error: "帖子不存在",
        success: false,
      }
    }

    // 删除帖子
    await prisma.post.delete({
      where: { id },
    })

    // 重新验证帖子列表页面
    revalidatePath("/posts")

    // 重定向到帖子列表页面
    redirect("/posts")
  } catch (error) {
    console.error("Error deleting post:", error)
    return {
      error: "删除帖子时发生错误",
      success: false,
    }
  }
}

