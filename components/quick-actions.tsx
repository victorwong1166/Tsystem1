"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { List, DollarSign, CreditCard, FileText, ArrowDownCircle } from "lucide-react"

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    { name: "索引列表", icon: <List className="mr-2 h-4 w-4" />, path: "/transactions" },
    { name: "買籌碼", icon: <DollarSign className="mr-2 h-4 w-4" />, path: "/transactions/buy-chips" },
    { name: "兌籌碼", icon: <CreditCard className="mr-2 h-4 w-4" />, path: "/transactions/redeem-chips" },
    { name: "簽借", icon: <FileText className="mr-2 h-4 w-4" />, path: "/transactions/loan" },
    { name: "還款", icon: <ArrowDownCircle className="mr-2 h-4 w-4" />, path: "/transactions/repayment" },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map((action) => (
            <Button
              key={action.name}
              variant="outline"
              className="h-auto flex-col py-4 text-center"
              onClick={() => router.push(action.path)}
            >
              <div className="flex items-center justify-center">{action.icon}</div>
              <span>{action.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

