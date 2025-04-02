"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface BackupSettingsData {
  enableAutomaticBackups: boolean
  backupFrequency: string
  backupTime: string
  retentionPeriod: number
  backupLocation: string
  includeUploads: boolean
  includeDatabase: boolean
  encryptBackups: boolean
  lastBackupDate: string | null
  lastBackupStatus: string | null
  lastBackupSize: string | null
}

export default function BackupSettings() {
  const [settings, setSettings] = useState<BackupSettingsData>({
    enableAutomaticBackups: false,
    backupFrequency: "daily",
    backupTime: "00:00",
    retentionPeriod: 7,
    backupLocation: "local",
    includeUploads: true,
    includeDatabase: true,
    encryptBackups: false,
    lastBackupDate: null,
    lastBackupStatus: null,
    lastBackupSize: null,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [backingUp, setBackingUp] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    // 模拟从API获取设置
    const fetchSettings = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch('/api/admin/settings/backup')
        // const data = await response.json()

        // 模拟数据
        const mockData: BackupSettingsData = {
          enableAutomaticBackups: true,
          backupFrequency: "daily",
          backupTime: "03:00",
          retentionPeriod: 30,
          backupLocation: "s3",
          includeUploads: true,
          includeDatabase: true,
          encryptBackups: true,
          lastBackupDate: "2023-04-01T03:00:00Z",
          lastBackupStatus: "success",
          lastBackupSize: "256MB",
        }

        // 模拟网络延迟
        setTimeout(() => {
          setSettings(mockData)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取备份设置失败:", error)
        setLoading(false)
        setMessage({ type: "error", text: "获取备份设置失败" })
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // const response = await fetch('/api/admin/settings/backup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })
      // const data = await response.json()

      // 模拟网络延迟和成功响应
      await new Promise((resolve) => setTimeout(resolve, 800))

      setMessage({ type: "success", text: "备份设置已保存" })
    } catch (error) {
      console.error("保存备份设置失败:", error)
      setMessage({ type: "error", text: "保存备份设置失败" })
    } finally {
      setSaving(false)
    }
  }

  const handleBackupNow = async () => {
    setBackingUp(true)
    setMessage({ type: "", text: "" })

    try {
      // 在实际应用中，这里应该是一个API调用
      // const response = await fetch('/api/admin/backup/create', {
      //   method: 'POST'
      // })
      // const data = await response.json()

      // 模拟网络延迟和成功响应
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // 更新最后备份信息
      setSettings({
        ...settings,
        lastBackupDate: new Date().toISOString(),
        lastBackupStatus: "success",
        lastBackupSize: "128MB",
      })

      setMessage({ type: "success", text: "备份已成功创建" })
    } catch (error) {
      console.error("创建备份失败:", error)
      setMessage({ type: "error", text: "创建备份失败" })
    } finally {
      setBackingUp(false)
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

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">最近备份</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {settings.lastBackupDate ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">上次备份时间</div>
                <div className="font-medium">{new Date(settings.lastBackupDate).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">状态</div>
                <div
                  className={`font-medium ${settings.lastBackupStatus === "success" ? "text-green-600" : "text-red-600"}`}
                >
                  {settings.lastBackupStatus === "success" ? "成功" : "失败"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">大小</div>
                <div className="font-medium">{settings.lastBackupSize}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">尚未创建备份</div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableAutomaticBackups"
                checked={settings.enableAutomaticBackups}
                onChange={handleChange}
                className="mr-2"
              />
              <span>启用自动备份</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备份频率</label>
            <select
              name="backupFrequency"
              value={settings.backupFrequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              disabled={!settings.enableAutomaticBackups}
            >
              <option value="hourly">每小时</option>
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备份时间</label>
            <input
              type="time"
              name="backupTime"
              value={settings.backupTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              disabled={!settings.enableAutomaticBackups || settings.backupFrequency === "hourly"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">保留期限（天）</label>
            <input
              type="number"
              name="retentionPeriod"
              value={settings.retentionPeriod}
              onChange={handleChange}
              min="1"
              max="365"
              className="w-full px-3 py-2 border rounded"
              disabled={!settings.enableAutomaticBackups}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备份位置</label>
            <select
              name="backupLocation"
              value={settings.backupLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="local">本地存储</option>
              <option value="s3">Amazon S3</option>
              <option value="gcs">Google Cloud Storage</option>
              <option value="azure">Azure Blob Storage</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-3">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeUploads"
                    checked={settings.includeUploads}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>包含上传文件</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeDatabase"
                    checked={settings.includeDatabase}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>包含数据库</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="encryptBackups"
                    checked={settings.encryptBackups}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>加密备份</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleBackupNow}
            disabled={backingUp}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 mr-2"
          >
            {backingUp ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                备份中...
              </span>
            ) : (
              "立即备份"
            )}
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

