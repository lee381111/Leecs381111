"use server"

import { createClient } from "@/lib/supabase/client"

export async function loadAllConsentsWithEmails() {
  const supabase = createClient()

  console.log("[v0] Starting to load all user consents...")

  const { data: consents, error: consentsError } = await supabase
    .from("user_consents")
    .select("*")
    .order("agreed_at", { ascending: false })

  console.log("[v0] user_consents query result:", {
    count: consents?.length || 0,
    error: consentsError,
  })

  if (consentsError) {
    console.error("[v0] Failed to load consents:", consentsError.message)
    return []
  }

  if (!consents || consents.length === 0) {
    console.log("[v0] No consents found in database")
    return []
  }

  const userIds = consents.map((c) => c.user_id)

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, email")
    .in("user_id", userIds)

  if (profilesError) {
    console.error("[v0] Failed to load profiles:", profilesError.message)
  }

  const emailMap = new Map(profiles?.map((p) => [p.user_id, p.email]) || [])

  console.log("[v0] Found", emailMap.size, "profiles with emails")

  const result = consents.map((consent) => ({
    ...consent,
    email: emailMap.get(consent.user_id) || consent.user_id.substring(0, 13) + "...",
  }))

  console.log("[v0] Returning", result.length, "consent records")

  return result
}
