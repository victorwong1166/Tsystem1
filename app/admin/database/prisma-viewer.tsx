"use client"

import { useState } from "react"

export default function PrismaViewer() {
  const [showFullSchema, setShowFullSchema] = useState(false)

  const prismaSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String?
  role          Role      @default(USER)
  avatar        String?
  bio           String?
  posts         Post[]
  comments      Comment[]
  transactions  Transaction[]
  notifications Notification[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Post {
  id        String    @id @default(cuid())
  title     String
  content   String?
  published Boolean   @default(false)
  authorId  String
  author    User      @relation(fields: [authorId], references: [id])
  comments  Comment[]
  categories CategoryOnPost[]
  tags      TagOnPost[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Category {
  id    String          @id @default(cuid())
  name  String          @unique
  posts CategoryOnPost[]
}

model CategoryOnPost {
  postId     String
  post       Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())

  @@id([postId, categoryId])
}

model Tag {
  id    String      @id @default(cuid())
  name  String      @unique
  posts TagOnPost[]
}

model TagOnPost {
  postId     String
  post       Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  tagId      String
  tag        Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())

  @@id([postId, tagId])
}

model Transaction {
  id          String   @id @default(cuid())
  amount      Float
  description String?
  type        TransactionType
  status      TransactionStatus @default(PENDING)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Notification {
  id        String           @id @default(cuid())
  title     String
  content   String
  type      NotificationType
  read      Boolean          @default(false)
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  createdAt DateTime         @default(now())
}

model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value String
}

enum Role {
  USER
  ADMIN
  EDITOR
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  TRANSFER
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
}`

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Prisma 模型定义</h1>

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setShowFullSchema(!showFullSchema)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showFullSchema ? "显示简化版" : "显示完整模型"}
        </button>

        <a
          href="https://pris.ly/d/prisma-schema"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          查看 Prisma 文档
        </a>
      </div>

      <div className="border rounded-lg bg-gray-50 p-4 overflow-auto">
        <pre className="text-sm">
          {showFullSchema
            ? prismaSchema
            : prismaSchema.split("\n").slice(0, 40).join("\n") + "\n\n// ... 更多模型定义 ..."}
        </pre>
      </div>

      <div className="mt-6 border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Prisma 模型说明</h2>

        <ul className="space-y-2">
          <li>
            <span className="font-medium">@id</span>：定义主键
          </li>
          <li>
            <span className="font-medium">@default(cuid())</span>：设置默认值为自动生成的 CUID
          </li>
          <li>
            <span className="font-medium">@unique</span>：定义唯一约束
          </li>
          <li>
            <span className="font-medium">@relation</span>：定义表关系
          </li>
          <li>
            <span className="font-medium">@default(now())</span>：设置默认值为当前时间
          </li>
          <li>
            <span className="font-medium">@updatedAt</span>：自动更新时间戳
          </li>
          <li>
            <span className="font-medium">@@id([field1, field2])</span>：定义复合主键
          </li>
          <li>
            <span className="font-medium">onDelete: Cascade</span>：定义级联删除行为
          </li>
        </ul>
      </div>
    </div>
  )
}

