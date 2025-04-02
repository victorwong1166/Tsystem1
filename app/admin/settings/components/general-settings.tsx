"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface GeneralSettingsData {
  siteName: string
  siteDescription: string
  adminEmail: string
  timezone: string
  dateFormat: string
  timeFormat: string
  language: string
  maintenanceMode: boolean
}

export default function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettingsData>({
    siteName: "",
    siteDescription: "",
    adminEmail: "",
    timezone: "",
    dateFormat: "",
    timeFormat: "",
    language: "",
    maintenanceMode: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    // 模拟从API获取设置
    const fetchSettings = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch('/api/admin/settings/general')
        // const data = await response.json()

        // 模拟数据
        const mockData: GeneralSettingsData = {
          siteName: "我的应用",
          siteDescription: "一个使用 Next.js 和 Prisma 构建的现代应用",
          adminEmail: "admin@example.com",
          timezone: "Asia/Shanghai",
          dateFormat: "YYYY-MM-DD",
          timeFormat: "HH:mm:ss",
          language: "zh-CN",
          maintenanceMode: false,
        }

        // 模拟网络延迟
        setTimeout(() => {
          setSettings(mockData)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取设置失败:", error)
        setLoading(false)
        setMessage({ type: "error", text: "获取设置失败" })
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // 在实际应用中，这里应该是一个API调用
      // const response = await fetch('/api/admin/settings/general', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })
      // const data = await response.json()

      // 模拟网络延迟和成功响应
      await new Promise((resolve) => setTimeout(resolve, 800))

      setMessage({ type: "success", text: "设置已保存" })
    } catch (error) {
      console.error("保存设置失败:", error)
      setMessage({ type: "error", text: "保存设置失败" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="border rounded-lg p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6">
      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">管理员邮箱</label>
            <input
              type="email"
              name="adminEmail"
              value={settings.adminEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
            <textarea
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">时区</label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Asia/Shanghai">亚洲/上海 (GMT+8)</option>
              <option value="Asia/Tokyo">亚洲/东京 (GMT+9)</option>
              <option value="America/New_York">美国/纽约 (GMT-5)</option>
              <option value="Europe/London">欧洲/伦敦 (GMT+0)</option>
              <option value="Europe/Paris">欧洲/巴黎 (GMT+1)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English (US)</option>
              <option value="ja-JP">日本語</option>
              <option value="ko-KR">한국어</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期格式</label>
            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY年MM月DD日">YYYY年MM月DD日</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">时间格式</label>
            <select
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="HH:mm:ss">24小时制 (HH:mm:ss)</option>
              <option value="hh:mm:ss A">12小时制 (hh:mm:ss AM/PM)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="mr-2"
              />
              <span>启用维护模式</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              启用维护模式后，只有管理员可以访问网站，其他用户将看到维护页面。
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存设置"}
          </button>
        </div>
      </form>
    </div>
  )
}

