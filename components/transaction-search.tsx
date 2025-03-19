"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function TransactionSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [filteredMembers, setFilteredMembers] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 實際應用中，這裡會調用API進行搜索
    console.log("搜索交易:", { searchTerm, transactionType, dateRange })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 relative">
              <Label htmlFor="search">會員名稱或交易ID</Label>
              <Input
                id="search"
                type="text"
                placeholder="搜索..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  // 當輸入內容變化時，顯示下拉選單
                  if (e.target.value.trim()) {
                    // 模擬會員數據
                    const mockMembers = [
                      { id: "M001", name: "張三" },
                      { id: "M002", name: "李四" },
                      { id: "M003", name: "王五" },
                      { id: "M004", name: "趙六" },
                      { id: "M005", name: "張偉" },
                      { id: "M006", name: "王偉" },
                      { id: "M007", name: "李明" },
                      { id: "M008", name: "陳明" },
                    ]
                    // 過濾包含輸入字符的會員
                    const filtered = mockMembers.filter(
                      (member) => member.name.includes(e.target.value) || member.id.includes(e.target.value),
                    )
                    setFilteredMembers(filtered)
                    setShowDropdown(true)
                  } else {
                    setShowDropdown(false)
                  }
                }}
              />
              {showDropdown && searchTerm.trim() && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchTerm(member.name)
                          setShowDropdown(false)
                        }}
                      >
                        {member.name} ({member.id})
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">無匹配會員</div>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">交易類型</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="所有類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有類型</SelectItem>
                  <SelectItem value="buy">買籌碼</SelectItem>
                  <SelectItem value="redeem">兌籌碼</SelectItem>
                  <SelectItem value="loan">簽借</SelectItem>
                  <SelectItem value="repayment">還款</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">日期範圍</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="date">
                  <SelectValue placeholder="所有時間" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有時間</SelectItem>
                  <SelectItem value="today">今天</SelectItem>
                  <SelectItem value="yesterday">昨天</SelectItem>
                  <SelectItem value="week">本週</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="custom">自定義</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            搜索
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

