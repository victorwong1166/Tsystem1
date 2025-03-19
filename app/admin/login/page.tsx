import type { Metadata } from "next"
import AdminLoginForm from "@/components/admin/admin-login-form"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "交易系統 - 後台登入",
  description: "交易系統後台管理登入",
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-slate-800" />
          </div>
          <h1 className="text-3xl font-bold">交易系統後台管理</h1>
          <p className="text-gray-600">請登入以繼續使用管理系統</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}

