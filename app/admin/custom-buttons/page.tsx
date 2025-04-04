import type { Metadata } from "next"
import AdminLayout from "@/app/admin/components/AdminLayout"
import CustomButtonsManager from "./components/CustomButtonsManager"

export const metadata: Metadata = {
  title: "自定義按鈕管理",
  description: "管理交易和支付方式按鈕",
}

export default function CustomButtonsPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">自定義按鈕管理</h1>
        <CustomButtonsManager />
      </div>
    </AdminLayout>
  )
}

