"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface UISettingsData {
  theme: string
  primaryColor: string
  accentColor: string
  fontSize: string
  borderRadius: string
  enableDarkMode: boolean
  showUserAvatar: boolean
  enableAnimations: boolean
  sidebarPosition: string
}

export default function UISettings() {
  const [settings, setSettings] = useState<UISettingsData>({
    theme: "",
    primaryColor: "",
    accentColor: "",
    fontSize: "",
    borderRadius: "",
    enableDarkMode: false,
    showUserAvatar: true,
    enableAnimations: true,
    sidebarPosition: "left",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    // 模拟从API获取设置
    const fetchSettings = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch('/api/admin/settings/ui')
        // const data = await response.json()

        // 模拟数据
        const mockData: UISettingsData = {
          theme: "light",
          primaryColor: "#3b82f6",
          accentColor: "#10b981",
          fontSize: "medium",
          borderRadius: "medium",
          enableDarkMode: true,
          showUserAvatar: true,
          enableAnimations: true,
          sidebarPosition: "left",
        }

        // 模拟网络延迟
        setTimeout(() => {
          setSettings(mockData)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取UI设置失败:", error)
        setLoading(false)
        setMessage({ type: "error", text: "获取UI设置失败" })
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // const response = await fetch('/api/admin/settings/ui', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })
      // const data = await response.json()

      // 模拟网络延迟和成功响应
      await new Promise((resolve) => setTimeout(resolve, 800))

      setMessage({ type: "success", text: "UI设置已保存" })
    } catch (error) {
      console.error("保存UI设置失败:", error)
      setMessage({ type: "error", text: "保存UI设置失败" })
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
            <label className="block text-sm font-medium text-gray-700 mb-1">主题</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="light">浅色主题</option>
              <option value="dark">深色主题</option>
              <option value="system">跟随系统</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">主色调</label>
            <div className="flex items-center">
              <input
                type="color"
                name="primaryColor"
                value={settings.primaryColor}
                onChange={handleChange}
                className="w-10 h-10 border rounded mr-2"
              />
              <input
                type="text"
                name="primaryColor"
                value={settings.primaryColor}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">强调色</label>
            <div className="flex items-center">
              <input
                type="color"
                name="accentColor"
                value={settings.accentColor}
                onChange={handleChange}
                className="w-10 h-10 border rounded mr-2"
              />
              <input
                type="text"
                name="accentColor"
                value={settings.accentColor}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
            <select
              name="fontSize"
              value={settings.fontSize}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">圆角大小</label>
            <select
              name="borderRadius"
              value={settings.borderRadius}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="none">无</option>
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">侧边栏位置</label>
            <select
              name="sidebarPosition"
              value={settings.sidebarPosition}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="left">左侧</option>
              <option value="right">右侧</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="enableDarkMode"
                  checked={settings.enableDarkMode}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>启用深色模式切换</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="showUserAvatar"
                  checked={settings.showUserAvatar}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>显示用户头像</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="enableAnimations"
                  checked={settings.enableAnimations}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>启用界面动画</span>
              </label>
            </div>
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

