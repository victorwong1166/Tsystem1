import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "交易系統 - 儀表板",
  description: "交易系統儀表板",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

