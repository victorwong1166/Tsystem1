"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

export function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setShowUpdatePrompt(true)
                setWaitingWorker(newWorker)
              }
            })
          }
        })
      })
    }
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" })
      setShowUpdatePrompt(false)
      window.location.reload()
    }
  }

  if (!showUpdatePrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="mr-4">
              <h3 className="font-medium">應用更新可用</h3>
              <p className="text-sm text-gray-500">有新版本可用，請更新以獲取最新功能</p>
            </div>
            <Button onClick={handleUpdate} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              更新
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

