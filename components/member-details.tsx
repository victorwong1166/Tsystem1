import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function MemberDetails({ id }) {
  // 模擬會員數據
  // 實際應用中，這裡會從API獲取數據
  const member = {
    id: id,
    name: "張三",
    phone: "1234-5678",
    email: "zhangsan@example.com",
    address: "香港九龍尖沙咀廣東道123號",
    balance: -2000,
    joinDate: "2023-01-15",
    status: "活躍",
    notes: "VIP客戶，喜歡大額投注",
    category: "regular", // 新增: 會員類別
    agentId: "A001", // 新增: 代理ID
    agentName: "王經理", // 新增: 代理名稱
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>會員資料</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-sm font-medium text-gray-500">ID:</div>
          <div>{member.id}</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-sm font-medium text-gray-500">姓名:</div>
          <div>{member.name}</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-sm font-medium text-gray-500">類別:</div>
          <div>
            {member.category === "shareholder" && "股東"}
            {member.category === "agent" && "代理"}
            {member.category === "regular" && "普通會員"}
          </div>
        </div>
        {member.category === "regular" && member.agentId && (
          <div className="grid grid-cols-2 gap-1">
            <div className="text-sm font-medium text-gray-500">上線代理:</div>
            <div>
              <Link href={`/members/${member.agentId}`} className="text-blue-600 hover:underline">
                {member.agentName}
              </Link>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-1">
          <div className="text-sm font-medium text-gray-500">電話:</div>
          <div>{member.phone}</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-sm font-medium text-gray-500">電子郵件:</div>
          <div>{member.email || "-"}</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-sm font-medium text-gray-500">地址:</div>
          <div>{member.address || "-"}</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-sm font-medium text-gray-500">結餘:</div>
          <div style={{ color: member.balance < 0 ? "red" : "inherit" }}>${member.balance}</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-sm font-medium text-gray-500">加入日期:</div>
          <div>{member.joinDate}</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-sm font-medium text-gray-500">狀態:</div>
          <div>{member.status}</div>
        </div>
        <div className="pt-2">
          <div className="text-sm font-medium text-gray-500">備註:</div>
          <div className="mt-1 whitespace-pre-wrap text-sm">{member.notes || "-"}</div>
        </div>
      </CardContent>
    </Card>
  )
}

