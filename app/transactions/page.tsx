import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import TransactionSearch from "@/components/transaction-search"
import TransactionList from "@/components/transaction-list"

export const metadata: Metadata = {
  title: "交易系統 - 交易記錄",
  description: "交易系統交易記錄",
}

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">交易記錄</h1>
        </div>
        <TransactionSearch />
        <div className="mt-6">
          <TransactionList />
        </div>
      </main>
    </div>
  )
}

