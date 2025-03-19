interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

// 存儲安裝提示事件
let deferredPrompt: BeforeInstallPromptEvent | null = null

// 設置安裝監聽器
export function setupInstallListeners(
  onCanInstall: (event: BeforeInstallPromptEvent) => void,
  onInstallSuccess: () => void,
  onInstallFail: () => void,
): () => void {
  // 攔截瀏覽器的安裝提示
  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    onCanInstall(deferredPrompt)
  }

  // 監聽應用安裝
  const handleAppInstalled = () => {
    deferredPrompt = null
    onInstallSuccess()
  }

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
  window.addEventListener("appinstalled", handleAppInstalled)

  // 返回清理函數
  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.removeEventListener("appinstalled", handleAppInstalled)
  }
}

// 檢查應用是否已安裝
export function isAppInstalled(): boolean {
  // iOS 上的獨立模式
  if (window.navigator.standalone) {
    return true
  }

  // Android 上的顯示模式
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true
  }

  return false
}

// 檢查應用是否可安裝
export function canInstallApp(): boolean {
  return !!deferredPrompt
}

// 提示用戶安裝應用
export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    return false
  }

  try {
    deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    deferredPrompt = null
    return choiceResult.outcome === "accepted"
  } catch (error) {
    console.error("Error prompting for install:", error)
    return false
  }
}

// 獲取設備信息
export function getDeviceInfo() {
  const userAgent = navigator.userAgent
  const platform = navigator.platform

  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
  const isAndroid = /Android/.test(userAgent)
  const isMobile = isIOS || isAndroid || /Mobi|Android/i.test(userAgent)

  return {
    isIOS,
    isAndroid,
    isMobile,
    platform,
    userAgent,
  }
}

// 獲取安裝指南
export function getInstallInstructions() {
  const deviceInfo = getDeviceInfo()

  if (deviceInfo.isIOS) {
    return {
      title: "在 iOS 上安裝",
      steps: ["點擊瀏覽器底部的分享按鈕", '滾動並點擊"添加到主屏幕"', '點擊"添加"確認'],
    }
  }

  if (deviceInfo.isAndroid) {
    return {
      title: "在 Android 上安裝",
      steps: ["點擊瀏覽器菜單按鈕 (三個點)", '點擊"添加到主屏幕"', '點擊"添加"確認'],
    }
  }

  return {
    title: "安裝應用",
    steps: ["點擊瀏覽器的安裝提示", '或使用瀏覽器菜單中的"安裝應用"選項'],
  }
}

