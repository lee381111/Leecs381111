"use server"

import { createClient } from "@/lib/supabase/server"

export async function createUserProfile(userId: string, email: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("profiles").insert({
    id: userId,
    user_id: userId,
    email: email,
    auth_type: "email",
    storage_quota: 524288000,
    storage_used: 0,
    language: "ko",
    theme: "light",
  })

  if (error) {
    console.error("[v0] Failed to create profile:", error)
    throw new Error("Failed to create user profile")
  }

  return { success: true }
}
