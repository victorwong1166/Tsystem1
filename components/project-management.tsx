"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 項目類型定義
export interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export default function ProjectManagement() {
  // 從本地存儲加載項目
  const loadProjects = (): Project[] => {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem("transaction-projects")
    return saved ? JSON.parse(saved) : []
  }

  const [projects, setProjects] = useState<Project[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  })

  // 加載項目
  useEffect(() => {
    setProjects(loadProjects())
  }, [])

  // 保存項目到本地存儲
  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem("transaction-projects", JSON.stringify(updatedProjects))
    setProjects(updatedProjects)
  }

  // 添加新項目
  const handleAddProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "錯誤",
        description: "項目名稱不能為空",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toISOString()
    const project: Project = {
      id: `project-${Date.now()}`,
      name: newProject.name.trim(),
      description: newProject.description.trim(),
      createdAt: now,
      updatedAt: now,
    }

    const updatedProjects = [...projects, project]
    saveProjects(updatedProjects)

    setNewProject({ name: "", description: "" })
    setIsAddDialogOpen(false)

    toast({
      title: "項目已添加",
      description: `項目 "${project.name}" 已成功添加`,
    })
  }

  // 編輯項目
  const handleEditProject = () => {
    if (!currentProject || !currentProject.name.trim()) {
      toast({
        title: "錯誤",
        description: "項目名稱不能為空",
        variant: "destructive",
      })
      return
    }

    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? { ...currentProject, updatedAt: new Date().toISOString() } : p,
    )

    saveProjects(updatedProjects)
    setIsEditDialogOpen(false)

    toast({
      title: "項目已更新",
      description: `項目 "${currentProject.name}" 已成功更新`,
    })
  }

  // 刪除項目
  const handleDeleteProject = (id: string) => {
    const projectToDelete = projects.find((p) => p.id === id)
    if (!projectToDelete) return

    const updatedProjects = projects.filter((p) => p.id !== id)
    saveProjects(updatedProjects)

    toast({
      title: "項目已刪除",
      description: `項目 "${projectToDelete.name}" 已成功刪除`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">項目管理</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加項目
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">尚未添加任何項目</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              添加第一個項目
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span className="text-lg">{project.name}</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentProject(project)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{project.description || "無描述"}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>創建於: {new Date(project.createdAt).toLocaleDateString()}</span>
                  <Badge variant="outline" className="text-xs">
                    項目
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 添加項目對話框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加新項目</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">項目名稱 *</Label>
              <Input
                id="project-name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="輸入項目名稱"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">項目描述</Label>
              <Textarea
                id="project-description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="輸入項目描述（可選）"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              取消
            </Button>
            <Button onClick={handleAddProject}>
              <Save className="mr-2 h-4 w-4" />
              保���
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 編輯項目對話框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯項目</DialogTitle>
          </DialogHeader>
          {currentProject && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-project-name">項目名稱 *</Label>
                <Input
                  id="edit-project-name"
                  value={currentProject.name}
                  onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                  placeholder="輸入項目名稱"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-project-description">項目描述</Label>
                <Textarea
                  id="edit-project-description"
                  value={currentProject.description || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  placeholder="輸入項目描述（可選）"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              取消
            </Button>
            <Button onClick={handleEditProject}>
              <Save className="mr-2 h-4 w-4" />
              更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

