import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    console.log("[v0] Delete account request for userId:", userId)

    if (!userId) {
      console.log("[v0] No userId provided")
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Create Supabase admin client with service role key
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("[v0] Deleting user data from tables...")

    const deleteResults = await Promise.allSettled([
      supabase.from("notes").delete().eq("user_id", userId),
      supabase.from("diaries").delete().eq("user_id", userId),
      supabase.from("schedules").delete().eq("user_id", userId),
      supabase.from("todo_items").delete().eq("user_id", userId),
      supabase.from("travel_records").delete().eq("user_id", userId),
      supabase.from("health_records").delete().eq("user_id", userId),
      supabase.from("medications").delete().eq("user_id", userId),
      supabase.from("budget_transactions").delete().eq("user_id", userId),
      supabase.from("business_cards").delete().eq("user_id", userId),
      supabase.from("vehicles").delete().eq("user_id", userId),
      supabase.from("medical_contacts").delete().eq("user_id", userId),
    ])

    deleteResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.log(`[v0] Failed to delete from table ${index}:`, result.reason)
      }
    })

    console.log("[v0] Deleting profile...")
    const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId)

    if (profileError) {
      console.error("[v0] Profile deletion error:", profileError)
    }

    console.log("[v0] Deleting auth user...")
    // Delete the user account from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("[v0] Auth user deletion error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    console.log("[v0] Account deletion successful")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Account deletion error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete account" },
      { status: 500 },
    )
  }
}
