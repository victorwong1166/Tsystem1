import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminLayout from "@/app/admin/components/AdminLayout"
import CustomButtonsManager from "./components/CustomButtonsManager"

export const metadata: Metadata = {
  title: "自定義按鈕管理 | 交易系統",
  description: "管理系統中使用的自定義按鈕",
}

export default async function CustomButtonsPage() {
  const session = await getServerSession(authOptions)

  // 檢查用戶是否已登錄且是管理員
  if (!session || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin/custom-buttons")
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">自定義按鈕管理</h1>
        <CustomButtonsManager />
      </div>
    </AdminLayout>
  )
}

