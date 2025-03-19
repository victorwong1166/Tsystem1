import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { UpdateNotification } from "@/components/update-notification"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { PWAOfflineIndicator } from "@/components/pwa-offline-indicator"

export const metadata: Metadata = {
  title: "交易系統",
  description: "百家樂交易系統",
  generator: "v0.dev",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "交易系統",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/icons/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <PWAInitializer />
        {children}
        <UpdateNotification />
        <PWAInstallPrompt />
        <PWAOfflineIndicator />
      </body>
    </html>
  )
}

// PWA 初始化組件
function PWAInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // 註冊服務工作線程
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/service-worker.js')
                .then(function(registration) {
                  console.log('Service Worker registered with scope:', registration.scope);
                  
                  // 監聽控制權變化，然後重新加載頁面
                  navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (window.refreshing) return;
                    window.refreshing = true;
                    window.location.reload();
                  });
                })
                .catch(function(error) {
                  console.error('Service Worker registration failed:', error);
                });
            });
          }
          
          // 記錄最後同步時間
          if (navigator.onLine) {
            localStorage.setItem('lastSyncTime', Date.now().toString());
          }
          
          // 添加離線類
          if (!navigator.onLine) {
            document.body.classList.add('offline-mode');
          }
          
          // 監聽網絡狀態變化
          window.addEventListener('online', () => {
            document.body.classList.remove('offline-mode');
            localStorage.setItem('lastSyncTime', Date.now().toString());
          });
          
          window.addEventListener('offline', () => {
            document.body.classList.add('offline-mode');
          });
        `,
      }}
    />
  )
}



import './globals.css'