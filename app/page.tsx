import LoginForm from "@/components/login-form"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">交易系統</h1>
          <p className="text-gray-600">請登入以繼續使用系統</p>
        </div>
        <LoginForm />
      </div>
      <PWAInstallPrompt />
    </div>
  )
}

