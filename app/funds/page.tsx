import { MemberFundsList } from "@/components/funds/member-funds-list"

export default function FundsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">資金管理</h1>
      <MemberFundsList />
    </div>
  )
}

