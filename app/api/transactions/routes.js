// app/api/transactions/route.js
import { getAllTransactions, createTransaction } from "@/lib/transactions"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const transactions = await getAllTransactions()
    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const result = await createTransaction(data)
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

