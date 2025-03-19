"use client"

import { SignTableList } from "@/components/sign-table-list"

export default function SignTablePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">簽碼表</h1>
      <SignTableList />
    </div>
  )
}

