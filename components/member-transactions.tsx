import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function MemberTransactions({ id }) {
  // 模擬交易數據
  // 實際應用中，這裡會從API獲取數據
  const transactions = [
    {
      id: "TX123456",
      type: "買碼",
      typeId: "buy",
      amount: 5000,
      date: "2023-05-15 14:30",
      status: "完成",
    },
    {
      id: "TX123457",
      type: "兌碼",
      typeId: "redeem",
      amount: 3000,
      date: "2023-05-15 22:45",
      status: "完成",
    },
    {
      id: "TX123458",
      type: "簽碼",
      typeId: "sign",
      amount: 2000,
      date: "2023-05-14 19:20",
      status: "盈利",
    },
    {
      id: "TX123459",
      type: "還碼",
      typeId: "return",
      amount: 1500,
      date: "2023-05-14 10:15",
      status: "虧損",
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">類型</th>
                <th className="px-4 py-3">金額</th>
                <th className="px-4 py-3">日期</th>
                <th className="px-4 py-3">狀態</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b text-sm">
                  <td className="px-4 py-3">{transaction.id}</td>
                  <td className="px-4 py-3">
                    {transaction.typeId === "sign" ? (
                      <span className="flex items-center text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        {transaction.type}
                      </span>
                    ) : transaction.typeId === "return" ? (
                      <span className="flex items-center text-red-600">
                        <TrendingDown className="mr-1 h-4 w-4" />
                        {transaction.type}
                      </span>
                    ) : (
                      transaction.type
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {transaction.typeId === "sign" ? (
                      <span className="text-green-600">+${transaction.amount}</span>
                    ) : transaction.typeId === "return" ? (
                      <span className="text-red-600">-${transaction.amount}</span>
                    ) : (
                      `$${transaction.amount}`
                    )}
                  </td>
                  <td className="px-4 py-3">{transaction.date}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        transaction.status === "盈利"
                          ? "success"
                          : transaction.status === "虧損"
                            ? "destructive"
                            : "default"
                      }
                      className={
                        transaction.status === "盈利"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "虧損"
                            ? "bg-red-100 text-red-800"
                            : ""
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

