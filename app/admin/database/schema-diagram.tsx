"use client"

import { useState } from "react"

export default function SchemaDiagram() {
  const [activeTab, setActiveTab] = useState("core")

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">数据库表结构</h1>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === "core" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("core")}
          >
            核心表
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "relation" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("relation")}
          >
            关联表
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "transaction" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("transaction")}
          >
            交易与通知
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "settings" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("settings")}
          >
            系统设置
          </button>
        </div>
      </div>

      {activeTab === "core" && (
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">User 表</h2>
            <p className="text-gray-600 mb-4">用户信息表，存储系统用户数据</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">id</td>
                  <td className="px-4 py-2">String (cuid)</td>
                  <td className="px-4 py-2">主键，自动生成</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">name</td>
                  <td className="px-4 py-2">String</td>
                  <td className="px-4 py-2">用户名称</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">email</td>
                  <td className="px-4 py-2">String (unique)</td>
                  <td className="px-4 py-2">电子邮箱，唯一</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">password</td>
                  <td className="px-4 py-2">String?</td>
                  <td className="px-4 py-2">密码（哈希后存储）</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">role</td>
                  <td className="px-4 py-2">Enum (Role)</td>
                  <td className="px-4 py-2">用户角色：USER, ADMIN, EDITOR</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">avatar</td>
                  <td className="px-4 py-2">String?</td>
                  <td className="px-4 py-2">头像 URL</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">bio</td>
                  <td className="px-4 py-2">String?</td>
                  <td className="px-4 py-2">个人简介</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">createdAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">创建时间</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">updatedAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">更新时间</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Post 表</h2>
            <p className="text-gray-600 mb-4">文章表，存储博客文章数据</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">id</td>
                  <td className="px-4 py-2">String (cuid)</td>
                  <td className="px-4 py-2">主键，自动生成</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">title</td>
                  <td className="px-4 py-2">String</td>
                  <td className="px-4 py-2">文章标题</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">content</td>
                  <td className="px-4 py-2">String?</td>
                  <td className="px-4 py-2">文章内容</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">published</td>
                  <td className="px-4 py-2">Boolean</td>
                  <td className="px-4 py-2">是否发布</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">authorId</td>
                  <td className="px-4 py-2">String (FK)</td>
                  <td className="px-4 py-2">作者 ID，外键关联 User 表</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">createdAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">创建时间</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">updatedAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">更新时间</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Comment 表</h2>
            <p className="text-gray-600 mb-4">评论表，存储文章评论数据</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">id</td>
                  <td className="px-4 py-2">String (cuid)</td>
                  <td className="px-4 py-2">主键，自动生成</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">content</td>
                  <td className="px-4 py-2">String</td>
                  <td className="px-4 py-2">评论内容</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">postId</td>
                  <td className="px-4 py-2">String (FK)</td>
                  <td className="px-4 py-2">文章 ID，外键关联 Post 表</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">authorId</td>
                  <td className="px-4 py-2">String (FK)</td>
                  <td className="px-4 py-2">作者 ID，外键关联 User 表</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">createdAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">创建时间</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">updatedAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">更新时间</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "relation" && (
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Category 表</h2>
            <p className="text-gray-600 mb-4">分类表，存储文章分类</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">id</td>
                  <td className="px-4 py-2">String (cuid)</td>
                  <td className="px-4 py-2">主键，自动生成</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">name</td>
                  <td className="px-4 py-2">String (unique)</td>
                  <td className="px-4 py-2">分类名称，唯一</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">CategoryOnPost 表</h2>
            <p className="text-gray-600 mb-4">文章分类关联表，多对多关系</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">postId</td>
                  <td className="px-4 py-2">String (FK)</td>
                  <td className="px-4 py-2">文章 ID，外键关联 Post 表</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">categoryId</td>
                  <td className="px-4 py-2">String (FK)</td>
                  <td className="px-4 py-2">分类 ID，外键关联 Category 表</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">assignedAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">分配时间</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-sm text-gray-600">注：主键为 (postId, categoryId) 组合</p>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Tag 表</h2>
            <p className="text-gray-600 mb-4">标签表，存储文章标签</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">id</td>
                  <td className="px-4 py-2">String (cuid)</td>
                  <td className="px-4 py-2">主键，自动生成</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">name</td>
                  <td className="px-4 py-2">String (unique)</td>
                  <td className="px-4 py-2">标签名称，唯一</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">TagOnPost 表</h2>
            <p className="text-gray-600 mb-4">文章标签关联表，多对多关系</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">postId</td>
                  <td className="px-4 py-2">String (FK)</td>
                  <td className="px-4 py-2">文章 ID，外键关联 Post 表</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">tagId</td>
                  <td className="px-4 py-2">String (FK)</td>
                  <td className="px-4 py-2">标签 ID，外键关联 Tag 表</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">assignedAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">分配时间</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-sm text-gray-600">注：主键为 (postId, tagId) 组合</p>
          </div>
        </div>
      )}

      {activeTab === "transaction" && (
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Transaction 表</h2>
            <p className="text-gray-600 mb-4">交易表，存储用户交易记录</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">id</td>
                  <td className="px-4 py-2">String (cuid)</td>
                  <td className="px-4 py-2">主键，自动生成</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">amount</td>
                  <td className="px-4 py-2">Float</td>
                  <td className="px-4 py-2">交易金额</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">description</td>
                  <td className="px-4 py-2">String?</td>
                  <td className="px-4 py-2">交易描述</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">type</td>
                  <td className="px-4 py-2">Enum (TransactionType)</td>
                  <td className="px-4 py-2">交易类型：DEPOSIT, WITHDRAWAL, TRANSFER</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">status</td>
                  <td className="px-4 py-2">Enum (TransactionStatus)</td>
                  <td className="px-4 py-2">交易状态：PENDING, COMPLETED, FAILED, CANCELLED</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">userId</td>
                  <td className="px-4 py-2">String (FK)</td>
                  <td className="px-4 py-2">用户 ID，外键关联 User 表</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">createdAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">创建时间</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">updatedAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">更新时间</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Notification 表</h2>
            <p className="text-gray-600 mb-4">通知表，存储用户通知</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">id</td>
                  <td className="px-4 py-2">String (cuid)</td>
                  <td className="px-4 py-2">主键，自动生成</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">title</td>
                  <td className="px-4 py-2">String</td>
                  <td className="px-4 py-2">通知标题</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">content</td>
                  <td className="px-4 py-2">String</td>
                  <td className="px-4 py-2">通知内容</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">type</td>
                  <td className="px-4 py-2">Enum (NotificationType)</td>
                  <td className="px-4 py-2">通知类型：INFO, SUCCESS, WARNING, ERROR</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">read</td>
                  <td className="px-4 py-2">Boolean</td>
                  <td className="px-4 py-2">是否已读</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">userId</td>
                  <td className="px-4 py-2">String (FK)</td>
                  <td className="px-4 py-2">用户 ID，外键关联 User 表</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">createdAt</td>
                  <td className="px-4 py-2">DateTime</td>
                  <td className="px-4 py-2">创建时间</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Setting 表</h2>
            <p className="text-gray-600 mb-4">系统设置表，存储全局配置</p>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">字段名</th>
                  <th className="px-4 py-2 text-left">类型</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">id</td>
                  <td className="px-4 py-2">String (cuid)</td>
                  <td className="px-4 py-2">主键，自动生成</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">key</td>
                  <td className="px-4 py-2">String (unique)</td>
                  <td className="px-4 py-2">设置键名，唯一</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">value</td>
                  <td className="px-4 py-2">String</td>
                  <td className="px-4 py-2">设置值</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">枚举类型</h2>
            <p className="text-gray-600 mb-4">系统中使用的枚举类型定义</p>

            <h3 className="font-medium mt-4 mb-2">Role 枚举</h3>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">值</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">USER</td>
                  <td className="px-4 py-2">普通用户</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">ADMIN</td>
                  <td className="px-4 py-2">管理员</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">EDITOR</td>
                  <td className="px-4 py-2">编辑</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-medium mt-4 mb-2">TransactionType 枚举</h3>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">值</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">DEPOSIT</td>
                  <td className="px-4 py-2">存款</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">WITHDRAWAL</td>
                  <td className="px-4 py-2">取款</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">TRANSFER</td>
                  <td className="px-4 py-2">转账</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-medium mt-4 mb-2">TransactionStatus 枚举</h3>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">值</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">PENDING</td>
                  <td className="px-4 py-2">待处理</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">COMPLETED</td>
                  <td className="px-4 py-2">已完成</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">FAILED</td>
                  <td className="px-4 py-2">失败</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">CANCELLED</td>
                  <td className="px-4 py-2">已取消</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-medium mt-4 mb-2">NotificationType 枚举</h3>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">值</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">INFO</td>
                  <td className="px-4 py-2">信息</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">SUCCESS</td>
                  <td className="px-4 py-2">成功</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">WARNING</td>
                  <td className="px-4 py-2">警告</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">ERROR</td>
                  <td className="px-4 py-2">错误</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

