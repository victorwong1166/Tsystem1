"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllMembers } from "@/lib/members"
import { UserCircle, Calendar, Phone, Mail, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function MemberList() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const data = await getAllMembers()
        setMembers(data)
      } catch (error) {
        console.error("Failed to fetch members:", error)
        toast({
          title: "錯誤",
          description: "無法獲取會員數據，請稍後再試",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [toast])

  const handleDelete = async (id: number) => {
    // 這裡可以實現刪除會員的功能
    toast({
      title: "功能未實現",
      description: "刪除會員功能尚未實現",
      variant: "default",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <UserCircle className="h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">尚無會員數據</h3>
            <p className="mt-2 text-sm text-gray-500">目前系統中沒有任何會員記錄，請點擊「新增會員」按鈕添加。</p>
            <Link href="/members/new" className="mt-4">
              <Button>新增會員</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>電話</TableHead>
              <TableHead>電子郵件</TableHead>
              <TableHead>註冊日期</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{member.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    {member.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {member.phone || "未設置"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {member.email || "未設置"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {new Date(member.created_at).toLocaleDateString("zh-TW")}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.active ? "success" : "secondary"}>{member.active ? "活躍" : "非活躍"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/members/edit/${member.id}`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">編輯</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">刪除</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

