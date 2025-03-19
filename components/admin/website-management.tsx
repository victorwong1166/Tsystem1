"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Globe, Plus, Edit, Trash2, Copy, Eye, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// 模擬網站數據
const mockWebsites = [
  {
    id: "1",
    name: "主要交易網站",
    domain: "trade.example.com",
    template: "trading",
    status: "active",
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    name: "VIP客戶專區",
    domain: "vip.example.com",
    template: "vip",
    status: "active",
    createdAt: "2023-06-20",
  },
  {
    id: "3",
    name: "推廣落地頁",
    domain: "promo.example.com",
    template: "landing",
    status: "inactive",
    createdAt: "2023-07-10",
  },
]

// 模擬模板數據
const websiteTemplates = [
  { id: "trading", name: "交易系統模板", description: "完整的交易系統界面" },
  { id: "vip", name: "VIP客戶模板", description: "為高端客戶設計的專屬界面" },
  { id: "landing", name: "推廣落地頁", description: "用於市場推廣的簡潔落地頁" },
  { id: "custom", name: "自定義模板", description: "從頭開始創建自定義網站" },
]

export default function WebsiteManagement() {
  const [websites, setWebsites] = useState(mockWebsites)
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWebsite, setNewWebsite] = useState({
    name: "",
    domain: "",
    template: "",
    description: "",
  })

  // 過濾網站列表
  const filteredWebsites = activeTab === "all" ? websites : websites.filter((site) => site.status === activeTab)

  // 創建新網站
  const handleCreateWebsite = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const website = {
      id,
      ...newWebsite,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setWebsites([...websites, website])
    setNewWebsite({ name: "", domain: "", template: "", description: "" })
    setIsCreateDialogOpen(false)

    toast({
      title: "網站創建成功",
      description: `${website.name} 已成功創建`,
    })
  }

  // 刪除網站
  const handleDeleteWebsite = (id) => {
    setWebsites(websites.filter((site) => site.id !== id))
    toast({
      title: "網站已刪除",
      description: "網站已成功刪除",
    })
  }

  // 切換網站狀態
  const toggleWebsiteStatus = (id) => {
    setWebsites(
      websites.map((site) => {
        if (site.id === id) {
          const newStatus = site.status === "active" ? "inactive" : "active"
          return { ...site, status: newStatus }
        }
        return site
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部網站</TabsTrigger>
            <TabsTrigger value="active">已啟用</TabsTrigger>
            <TabsTrigger value="inactive">已停用</TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              建立新網站
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-white text-slate-800">
            <DialogHeader>
              <DialogTitle>建立新網站</DialogTitle>
              <DialogDescription>填寫以下信息創建一個新的網站或落地頁。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  網站名稱
                </Label>
                <Input
                  id="name"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                  className="col-span-3 bg-white border-gray-300"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="domain" className="text-right">
                  域名
                </Label>
                <Input
                  id="domain"
                  value={newWebsite.domain}
                  onChange={(e) => setNewWebsite({ ...newWebsite, domain: e.target.value })}
                  className="col-span-3 bg-white border-gray-300"
                  placeholder="example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template" className="text-right">
                  模板
                </Label>
                <Select
                  onValueChange={(value) => setNewWebsite({ ...newWebsite, template: value })}
                  value={newWebsite.template}
                >
                  <SelectTrigger className="col-span-3 bg-white border-gray-300">
                    <SelectValue placeholder="選擇網站模板" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {websiteTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  描述
                </Label>
                <Textarea
                  id="description"
                  value={newWebsite.description}
                  onChange={(e) => setNewWebsite({ ...newWebsite, description: e.target.value })}
                  className="col-span-3 bg-white border-gray-300"
                  placeholder="網站描述..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCreateWebsite}
                disabled={!newWebsite.name || !newWebsite.domain || !newWebsite.template}
              >
                創建網站
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWebsites.map((website) => (
          <Card key={website.id} className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-slate-800">{website.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1 text-slate-600">
                    <Globe className="h-3 w-3 mr-1" />
                    {website.domain}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`status-${website.id}`} className="sr-only">
                    狀態
                  </Label>
                  <Switch
                    id={`status-${website.id}`}
                    checked={website.status === "active"}
                    onCheckedChange={() => toggleWebsiteStatus(website.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600">
                <p>模板: {websiteTemplates.find((t) => t.id === website.template)?.name || website.template}</p>
                <p>創建日期: {website.createdAt}</p>
                <p>狀態: {website.status === "active" ? "已啟用" : "已停用"}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm" className="text-slate-700 border-gray-300">
                <Eye className="h-4 w-4 mr-1" />
                預覽
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-slate-700 border-gray-300">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">編輯</span>
                </Button>
                <Button variant="outline" size="sm" className="text-slate-700 border-gray-300">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">設置</span>
                </Button>
                <Button variant="outline" size="sm" className="text-slate-700 border-gray-300">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">複製</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-gray-300 hover:text-red-700 hover:border-red-500"
                  onClick={() => handleDeleteWebsite(website.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">刪除</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

