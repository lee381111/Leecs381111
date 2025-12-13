import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Create Supabase admin client with service role key
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Delete all user data
    await Promise.all([
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
      supabase.from("profiles").delete().eq("id", userId),
    ])

    // Delete the user account from auth
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
      console.error("Error deleting user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Account deletion error:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
