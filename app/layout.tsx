import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import SessionProvider from "@/components/session-provider"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "我的商城",
  description: "一个功能完整的电子商务网站",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="zh">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <footer className="bg-white border-t py-8">
            <div className="container mx-auto px-4">
              <div className="text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} 我的商城. 保留所有权利.</p>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}



import './globals.css'