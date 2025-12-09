"use server"

import { createClient } from "@/lib/supabase/server"

export async function loadAllConsentsWithEmails() {
  const supabase = await createClient()

  const { data: consents, error: consentsError } = await supabase
    .from("user_consents")
    .select("*")
    .order("agreed_at", { ascending: false })

  if (consentsError) {
    console.error("[v0] Failed to load consents:", consentsError.message)
    return []
  }

  console.log("[v0] Found consent records:", consents?.length || 0)

  if (!consents || consents.length === 0) {
    return []
  }

  const userIds = consents.map((c) => String(c.user_id))

  console.log("[v0] Looking up profiles for user_ids:", userIds)

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, email")
    .in("user_id", userIds)

  if (profilesError) {
    console.error("[v0] Failed to load profiles:", profilesError.message)
  }

  console.log("[v0] Found profiles:", profiles?.length || 0, profiles)

  const emailMap = new Map(profiles?.map((p) => [p.user_id, p.email]) || [])

  console.log("[v0] Email map:", Object.fromEntries(emailMap))

  const result = consents.map((consent) => {
    const userId = String(consent.user_id)
    const email = emailMap.get(userId) || userId.substring(0, 13) + "..."
    console.log("[v0] Mapping consent:", userId, "->", email)
    return {
      ...consent,
      email,
    }
  })

  console.log("[v0] Final result:", result.length, "consents with emails")

  return result
}
