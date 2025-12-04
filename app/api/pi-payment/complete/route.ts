import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { paymentId, txid, userId, amount } = await request.json()

    if (!paymentId || !txid || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Payment completed (no database):", paymentId, txid, userId, amount)

    return NextResponse.json({ success: true, paymentId, txid })
  } catch (error) {
    console.error("[v0] Error completing payment:", error)
    return NextResponse.json({ error: "Failed to complete payment" }, { status: 500 })
  }
}
