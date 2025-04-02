"use client"

import { useState, useEffect } from "react"

interface UserActivity {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  details: string
  timestamp: string
  ip: string
}

export default function UserActivity() {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  useEffect(() => {
    // 模拟从API获取用户活动
    const fetchUserActivities = async () => {
      try {
        // 在实际应用中，这里应该是一个API调用
        // const response = await fetch('/api/admin/monitoring/user-activities')
        // const data = await response.json()

        // 生成模拟数据
        const actions = ["login", "logout", "create", "update", "delete", "view"]
        const resources = ["user", "post", "comment", "setting", "profile"]
        const userNames = ["管理员", "编辑", "测试用户", "张三", "李四", "王五"]

        const mockActivities: UserActivity[] = Array.from({ length: 20 }, (_, i) => {
          const action = actions[Math.floor(Math.random() * actions.length)]
          const resource = resources[Math.floor(Math.random() * resources.length)]
          const userName = userNames[Math.floor(Math.random() * userNames.length)]
          const userId = `user-${Math.floor(Math.random() * 10) + 1}`

          let details = ""
          if (action === "login" || action === "logout") {
            details = `用户${action === "login" ? "登录" : "登出"}系统`
          } else if (action === "create") {
            details = `创建了新的${resource}`
          } else if (action === "update") {
            details = `更新了${resource}信息`
          } else if (action === "delete") {
            details = `删除了${resource}`
          } else if (action === "view") {
            details = `查看了${resource}详情`
          }

          const date = new Date()
          date.setMinutes(date.getMinutes() - i * 15) // 每条活动间隔15分钟

          return {
            id: `activity-${i}`,
            userId,
            userName,
            action,
            resource,
            details,
            timestamp: date.toISOString(),
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          }
        })

        // 模拟网络延迟
        setTimeout(() => {
          setActivities(mockActivities)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("获取用户活动失败:", error)
        setLoading(false)
      }
    }

    fetchUserActivities()
  }, [])

  const getActionColor = (action: string) => {
    switch (action) {
      case "login":
        return "bg-green-100 text-green-800"
      case "logout":
        return "bg-blue-100 text-blue-800"
      case "create":
        return "bg-purple-100 text-purple-800"
      case "update":
        return "bg-yellow-100 text-yellow-800"
      case "delete":
        return "bg-red-100 text-red-800"
      case "view":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "login":
        return "登录"
      case "logout":
        return "登出"
      case "create":
        return "创建"
      case "update":
        return "更新"
      case "delete":
        return "删除"
      case "view":
        return "查看"
      default:
        return action
    }
  }

  const filteredActivities = activities.filter((activity) => {
    // 文本过滤
    const textMatch =
      filter === "" ||
      activity.userName.toLowerCase().includes(filter.toLowerCase()) ||
      activity.details.toLowerCase().includes(filter.toLowerCase()) ||
      activity.resource.toLowerCase().includes(filter.toLowerCase())

    // 操作过滤
    const actionMatch = actionFilter === "all" || activity.action === actionFilter

    return textMatch && actionMatch
  })

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
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="搜索用户或活动..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">所有操作</option>
            <option value="login">登录</option>
            <option value="logout">登出</option>
            <option value="create">创建</option>
            <option value="update">更新</option>
            <option value="delete">删除</option>
            <option value="view">查看</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">时间</th>
              <th className="px-4 py-2 text-left">用户</th>
              <th className="px-4 py-2 text-left">操作</th>
              <th className="px-4 py-2 text-left">资源</th>
              <th className="px-4 py-2 text-left">详情</th>
              <th className="px-4 py-2 text-left">IP地址</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <tr key={activity.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{new Date(activity.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2">{activity.userName}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(activity.action)}`}>
                      {getActionLabel(activity.action)}
                    </span>
                  </td>
                  <td className="px-4 py-2 capitalize">{activity.resource}</td>
                  <td className="px-4 py-2">{activity.details}</td>
                  <td className="px-4 py-2 font-mono text-sm">{activity.ip}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  没有找到匹配的用户活动
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

