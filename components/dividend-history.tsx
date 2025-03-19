import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart } from "lucide-react"

// Update the dividend history to include loss records

// Add some loss records to the mock data
const dividendHistory = [
  {
    id: "DIV001",
    date: "2023-05-15",
    totalProfit: 25650,
    totalShares: 10,
    dividendPerShare: 2565,
    dividendPerHalfShare: 1282.5,
    status: "已分配",
    isLoss: false,
  },
  {
    id: "DIV002",
    date: "2023-05-12",
    totalProfit: 18200,
    totalShares: 10,
    dividendPerShare: 1820,
    dividendPerHalfShare: 910,
    status: "已分配",
    isLoss: false,
  },
  {
    id: "DIV003",
    date: "2023-05-09",
    totalProfit: -8500,
    totalShares: 10,
    dividendPerShare: -850,
    dividendPerHalfShare: -425,
    status: "已分攤",
    isLoss: true,
  },
  {
    id: "DIV004",
    date: "2023-05-06",
    totalProfit: 15800,
    totalShares: 10,
    dividendPerShare: 1580,
    dividendPerHalfShare: 790,
    status: "已分配",
    isLoss: false,
  },
]

export default function DividendHistory() {
  // Update the total calculation to handle losses
  const totalDividends = dividendHistory.reduce((total, dividend) => {
    // Only add positive profits to the total
    return total + (dividend.isLoss ? 0 : dividend.totalProfit)
  }, 0)

  const totalLosses = dividendHistory.reduce((total, dividend) => {
    // Only add losses to the total
    return total + (dividend.isLoss ? Math.abs(dividend.totalProfit) : 0)
  }, 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        {/* Update the header to show both total dividends and total losses */}
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <PieChart className="mr-2 h-5 w-5 text-purple-500" />
            分紅歷史
          </CardTitle>
          <div className="text-sm">
            <span className="font-semibold text-purple-600 mr-4">總分紅: ${totalDividends.toLocaleString()}</span>
            <span className="font-semibold text-red-600">總虧損: ${totalLosses.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">日期</th>
                <th className="px-4 py-3">總盈利</th>
                <th className="px-4 py-3">總份數</th>
                <th className="px-4 py-3">每股分紅</th>
                <th className="px-4 py-3">每0.5股分紅</th>
                <th className="px-4 py-3">狀態</th>
              </tr>
            </thead>
            {/* Update the table to display profit/loss differently */}
            <tbody>
              {dividendHistory.map((dividend) => (
                <tr key={dividend.id} className="border-b text-sm">
                  <td className="px-4 py-3">{dividend.id}</td>
                  <td className="px-4 py-3">{dividend.date}</td>
                  <td className={`px-4 py-3 font-medium ${dividend.isLoss ? "text-red-600" : ""}`}>
                    {dividend.isLoss ? "-" : ""}${Math.abs(dividend.totalProfit).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{dividend.totalShares}</td>
                  <td className={`px-4 py-3 font-medium ${dividend.isLoss ? "text-red-600" : "text-purple-600"}`}>
                    {dividend.isLoss ? "-" : ""}${Math.abs(dividend.dividendPerShare).toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 ${dividend.isLoss ? "text-red-600" : "text-purple-600"}`}>
                    {dividend.isLoss ? "-" : ""}${Math.abs(dividend.dividendPerHalfShare).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={
                        dividend.isLoss
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {dividend.status}
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

