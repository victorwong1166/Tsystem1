"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAllMembers } from "@/lib/members"

export function MemberSelect({ onSelect }) {
  const [open, setOpen] = useState(false)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const data = await getAllMembers()
        setMembers(data)
        setError(null)
      } catch (err) {
        console.error("獲取會員數據失敗:", err)
        setError("無法加載會員數據")
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const handleSelect = (member) => {
    setSelectedMember(member)
    onSelect(member)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedMember ? selectedMember.name : "選擇會員..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="搜索會員..." />
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              加載中...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-500">{error}</div>
          ) : (
            <CommandList>
              <CommandEmpty>未找到會員</CommandEmpty>
              <CommandGroup>
                {members.map((member) => (
                  <CommandItem key={member.id} value={member.id.toString()} onSelect={() => handleSelect(member)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedMember?.id === member.id ? "opacity-100" : "opacity-0")}
                    />
                    {member.name} {member.phone ? `(${member.phone})` : ""}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

