"use client"

import { useEffect, useState } from "react"

export default function DebugEnv() {
  const [publicKey, setPublicKey] = useState<string | null>(null)

  useEffect(() => {
    // 在客戶端渲染時獲取環境變量
    setPublicKey(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null)
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="font-bold">環境變量調試</h3>
      <p>NEXT_PUBLIC_VAPID_PUBLIC_KEY: {publicKey ? "已設置" : "未設置"}</p>
      {publicKey && (
        <p className="text-xs text-gray-500 break-all mt-2">
          值: {publicKey.substring(0, 10)}...{publicKey.substring(publicKey.length - 10)}
        </p>
      )}
    </div>
  )
}

