"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Member } from "@/lib/members-db"

interface MemberListProps {
  initialMembers?: Member[]
}

export default function MemberList({ initialMembers = [] }: MemberListProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [loading, setLoading] = useState(!initialMembers.length)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  // 如果沒有初始數據，則從API獲取
  useEffect(() => {
    if (initialMembers.length === 0) {
      fetchMembers()
    }
  }, [initialMembers.length])

  // 搜索功能
  useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        fetchMembers(searchQuery)
      }, 300)

      return () => clearTimeout(delayDebounceFn)
    } else if (searchQuery === "") {
      fetchMembers()
    }
  }, [searchQuery])

  const fetchMembers = async (query?: string) => {
    setLoading(true)
    setError(null)

    try {
      const url = query ? `/api/members?query=${encodeURIComponent(query)}` : "/api/members"

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("獲取會員列表失敗")
      }

      const data = await response.json()

      if (data.success) {
        setMembers(data.data)
      } else {
        throw new Error(data.error || "獲取會員列表失敗")
      }
    } catch (error) {
      console.error("獲取會員列表錯誤:", error)
      setError(error instanceof Error ? error.message : "獲取會員列表失敗")
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除這個會員嗎？此操作不可撤銷。")) {
      return
    }

    try {
      const response = await fetch(`/api/members/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("刪除會員失敗")
      }

      const data = await response.json()

      if (data.success) {
        // 從列表中移除已刪除的會員
        setMembers(members.filter((member) => member.id !== id))
      } else {
        throw new Error(data.error || "刪除會員失敗")
      }
    } catch (error) {
      console.error("刪除會員錯誤:", error)
      alert(error instanceof Error ? error.message : "刪除會員失敗")
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <Input
            placeholder="搜索會員..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">{searchQuery ? "沒有找到符合條件的會員" : "暫無會員數據"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>電話</TableHead>
                  <TableHead>電子郵件</TableHead>
                  <TableHead>類別</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.phone || "-"}</TableCell>
                    <TableCell>{member.email || "-"}</TableCell>
                    <TableCell>{member.category || "regular"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/members/${member.id}`}>查看</Link>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(member.id)}>
                          刪除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

