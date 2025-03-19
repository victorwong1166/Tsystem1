// app/api/members/[id]/route.js
import { getMemberById, updateMember } from "@/lib/members"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const { id } = params
    const member = await getMemberById(id)

    if (!member) {
      return NextResponse.json({ error: "會員不存在" }, { status: 404 })
    }

    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()
    const result = await updateMember(id, data)

    if (result.length === 0) {
      return NextResponse.json({ error: "會員不存在" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

