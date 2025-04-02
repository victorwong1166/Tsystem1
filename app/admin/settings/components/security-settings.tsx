"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface SecuritySettingsData {
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSymbols: boolean
  passwordExpiryDays: number
  maxLoginAttempts: number
  lockoutDuration: number
  sessionTimeout: number
  enableTwoFactor: boolean
  allowedIPs: string
}

export default function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettingsData>({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 60,
    enableTwoFactor: false,
    allowedIPs: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    // 模拟从API获取设置
    const fetchSettings = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch('/api/admin/settings/security')
        // const data = await response.json()

        // 模拟数据
        const mockData: SecuritySettingsData = {
          passwordMinLength: 8,
          passwordRequireUppercase: true,
          passwordRequireNumbers: true,
          passwordRequireSymbols: false,
          passwordExpiryDays: 90,
          maxLoginAttempts: 5,
          lockoutDuration: 30,
          sessionTimeout: 60,
          enableTwoFactor: false,
          allowedIPs: "192.168.1.0/24, 10.0.0.0/8",
        }

        // 模拟网络延迟
        setTimeout(() => {
          setSettings(mockData)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取安全设置失败:", error)
        setLoading(false)
        setMessage({ type: "error", text: "获取安全设置失败" })
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      setSettings({
        ...settings,
        [name]: (e.target as HTMLInputElement).checked,
      })
    } else if (type === "number") {
      setSettings({
        ...settings,
        [name]: Number.parseInt(value) || 0,
      })
    } else {
      setSettings({
        ...settings,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // 在实际应用中，这里应该是一个API调用
      // const response = await fetch('/api/admin/settings/security', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })
      // const data = await response.json()

      // 模拟网络延迟和成功响应
      await new Promise((resolve) => setTimeout(resolve, 800))

      setMessage({ type: "success", text: "安全设置已保存" })
    } catch (error) {
      console.error("保存安全设置失败:", error)
      setMessage({ type: "error", text: "保存安全设置失败" })
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
            <h3 className="text-lg font-medium mb-3">密码策略</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码最小长度</label>
            <input
              type="number"
              name="passwordMinLength"
              value={settings.passwordMinLength}
              onChange={handleChange}
              min="6"
              max="32"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码过期天数</label>
            <input
              type="number"
              name="passwordExpiryDays"
              value={settings.passwordExpiryDays}
              onChange={handleChange}
              min="0"
              max="365"
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-sm text-gray-500 mt-1">设置为0表示密码永不过期</p>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-3">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="passwordRequireUppercase"
                    checked={settings.passwordRequireUppercase}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>要求包含大写字母</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="passwordRequireNumbers"
                    checked={settings.passwordRequireNumbers}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>要求包含数字</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="passwordRequireSymbols"
                    checked={settings.passwordRequireSymbols}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>要求包含特殊符号</span>
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-3">登录安全</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">最大登录尝试次数</label>
            <input
              type="number"
              name="maxLoginAttempts"
              value={settings.maxLoginAttempts}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">锁定时长（分钟）</label>
            <input
              type="number"
              name="lockoutDuration"
              value={settings.lockoutDuration}
              onChange={handleChange}
              min="5"
              max="1440"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">会话超时（分钟）</label>
            <input
              type="number"
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleChange}
              min="5"
              max="1440"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableTwoFactor"
                checked={settings.enableTwoFactor}
                onChange={handleChange}
                className="mr-2"
              />
              <span>启用两因素认证</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">允许的IP地址（用逗号分隔）</label>
            <textarea
              name="allowedIPs"
              value={settings.allowedIPs}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              rows={3}
              placeholder="例如: 192.168.1.0/24, 10.0.0.0/8"
            />
            <p className="text-sm text-gray-500 mt-1">留空表示允许所有IP地址</p>
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

