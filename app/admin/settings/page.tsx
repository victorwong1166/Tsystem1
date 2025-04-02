import { Suspense } from "react"
import GeneralSettings from "./components/general-settings"
import UISettings from "./components/ui-settings"
import NotificationSettings from "./components/notification-settings"
import SecuritySettings from "./components/security-settings"
import BackupSettings from "./components/backup-settings"
import LoadingCard from "../monitoring/components/loading-card"

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">系统设置</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">常规设置</h2>
        <Suspense fallback={<LoadingCard />}>
          <GeneralSettings />
        </Suspense>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">界面设置</h2>
        <Suspense fallback={<LoadingCard />}>
          <UISettings />
        </Suspense>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">通知设置</h2>
        <Suspense fallback={<LoadingCard />}>
          <NotificationSettings />
        </Suspense>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">安全设置</h2>
        <Suspense fallback={<LoadingCard />}>
          <SecuritySettings />
        </Suspense>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">备份设置</h2>
        <Suspense fallback={<LoadingCard />}>
          <BackupSettings />
        </Suspense>
      </div>
    </div>
  )
}

