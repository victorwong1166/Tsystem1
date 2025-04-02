"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface NotificationSettingsData {
  enableEmailNotifications: boolean
  enablePushNotifications: boolean
  enableInAppNotifications: boolean
  notifyOnNewUser: boolean
  notifyOnNewComment: boolean
  notifyOnSystemError: boolean
  dailyDigest: boolean
  weeklyReport: boolean
  emailTemplate: string
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsData>({
    enableEmailNotifications: false,
    enablePushNotifications: false,
    enableInAppNotifications: true,
    notifyOnNewUser: false,
    notifyOnNewComment: false,
    notifyOnSystemError: true,
    dailyDigest: false,
    weeklyReport: false,
    emailTemplate: "default",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    // 模拟从API获取设置
    const fetchSettings = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch('/api/admin/settings/notifications')
        // const data = await response.json()

        // 模拟数据
        const mockData: NotificationSettingsData = {
          enableEmailNotifications: true,
          enablePushNotifications: true,
          enableInAppNotifications: true,
          notifyOnNewUser: true,
          notifyOnNewComment: true,
          notifyOnSystemError: true,
          dailyDigest: false,
          weeklyReport: true,
          emailTemplate: "default",
        }

        // 模拟网络延迟
        setTimeout(() => {
          setSettings(mockData)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取通知设置失败:", error)
        setLoading(false)
        setMessage({ type: "error", text: "获取通知设置失败" })
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
      // const response = await fetch('/api/admin/settings/notifications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })
      // const data = await response.json()

      // 模拟网络延迟和成功响应
      await new Promise((resolve) => setTimeout(resolve, 800))

      setMessage({ type: "success", text: "通知设置已保存" })
    } catch (error) {
      console.error("保存通知设置失败:", error)
      setMessage({ type: "error", text: "保存通知设置失败" })
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
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-3">通知渠道</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableEmailNotifications"
                    checked={settings.enableEmailNotifications}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>启用邮件通知</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="enablePushNotifications"
                    checked={settings.enablePushNotifications}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>启用推送通知</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableInAppNotifications"
                    checked={settings.enableInAppNotifications}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>启用应用内通知</span>
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-3">通知事件</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifyOnNewUser"
                    checked={settings.notifyOnNewUser}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>新用户注册时通知</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifyOnNewComment"
                    checked={settings.notifyOnNewComment}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>新评论发布时通知</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifyOnSystemError"
                    checked={settings.notifyOnSystemError}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>系统错误时通知</span>
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-3">定期报告</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="dailyDigest"
                    checked={settings.dailyDigest}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>每日摘要</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="weeklyReport"
                    checked={settings.weeklyReport}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>每周报告</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮件模板</label>
            <select
              name="emailTemplate"
              value={settings.emailTemplate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="default">默认模板</option>
              <option value="minimal">简约模板</option>
              <option value="colorful">多彩模板</option>
              <option value="corporate">企业模板</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
            onClick={() => {
              // 模拟发送测试通知
              setMessage({ type: "success", text: "测试通知已发送" })
            }}
          >
            发送测试通知
          </button>

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

