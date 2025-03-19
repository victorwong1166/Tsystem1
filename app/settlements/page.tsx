"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SettlementSearch } from "@/components/settlement-search"
import { SettlementHistory } from "@/components/settlement-history"

export default function SettlementsPage() {
  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
    keyword: "",
  })

  const handleSearch = (params: any) => {
    setSearchParams(params)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">結算歷史</h1>
        </div>
      </div>

      <SettlementSearch onSearch={handleSearch} />
      <SettlementHistory searchParams={searchParams} />
    </div>
  )
}

