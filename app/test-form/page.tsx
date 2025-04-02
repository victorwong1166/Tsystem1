"use client"

import type React from "react"

import { useState } from "react"

export default function TestFormPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
  })
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error"
    message?: string
  }>({ type: "idle" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: "loading" })

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setStatus({
          type: "success",
          message: "用户创建成功！",
        })
        setFormData({
          name: "",
          email: "",
          role: "USER",
        })
      } else {
        setStatus({
          type: "error",
          message: data.error || "创建用户失败",
        })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "发生错误，请稍后再试",
      })
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">测试表单 - 添加用户</h1>

      {status.type === "success" && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{status.message}</div>
      )}

      {status.type === "error" && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{status.message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            名称
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            邮箱
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            角色
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="USER">普通用户</option>
            <option value="ADMIN">管理员</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={status.type === "loading"}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {status.type === "loading" ? "提交中..." : "创建用户"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">测试步骤</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>填写表单并提交</li>
          <li>检查是否收到成功消息</li>
          <li>
            访问{" "}
            <a href="/api/users" className="text-blue-600 hover:underline">
              /api/users
            </a>{" "}
            查看是否创建成功
          </li>
        </ol>
      </div>
    </div>
  )
}

