import AdminHeader from "@/components/admin/admin-header"
import WebsiteManagement from "@/components/admin/website-management"

export default function AdminWebsitesPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800">
      <AdminHeader />
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">網站管理</h1>
        <WebsiteManagement />
      </main>
    </div>
  )
}

