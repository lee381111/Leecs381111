import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { paymentId, userId } = await request.json()

    if (!paymentId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Here you would verify the payment with Pi Network's backend API
    // For now, we'll approve it directly
    console.log("[v0] Approving Pi payment:", paymentId, "for user:", userId)

    return NextResponse.json({ success: true, paymentId })
  } catch (error) {
    console.error("[v0] Error approving payment:", error)
    return NextResponse.json({ error: "Failed to approve payment" }, { status: 500 })
  }
}
