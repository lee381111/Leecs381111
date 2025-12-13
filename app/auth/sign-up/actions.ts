"use server"

import { createClient } from "@supabase/supabase-js"

export async function createUserProfile(userId: string, email: string) {
  console.log("[v0] createUserProfile called with userId:", userId, "email:", email)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  console.log("[v0] Attempting to insert profile...")
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      user_id: userId,
      email: email,
      auth_type: "email",
      storage_quota: 524288000,
      storage_used: 0,
      language: "ko",
      theme: "light",
    })
    .select()

  if (error) {
    console.error("[v0] Failed to create profile:", error)
    throw new Error(`Failed to create user profile: ${error.message}`)
  }

  console.log("[v0] Profile created successfully:", data)
  return { success: true }
}
