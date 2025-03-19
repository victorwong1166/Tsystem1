import { PWAManager } from "@/components/pwa-manager"

export default function PWASettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">應用設置</h1>
      <PWAManager />
    </div>
  )
}

