"use server"

import { createClient } from "@/lib/supabase/client"

export async function loadAllConsentsWithEmails() {
  const supabase = createClient()

  const { data: consents, error: consentsError } = await supabase
    .from("user_consents")
    .select("*")
    .order("agreed_at", { ascending: false })

  if (consentsError) {
    console.error("[v0] Failed to load consents:", consentsError.message)
    return []
  }

  if (!consents || consents.length === 0) {
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

  const emailMap = new Map(profiles?.map((p) => [String(p.user_id), p.email]) || [])

  const result = consents.map((consent) => ({
    ...consent,
    email: emailMap.get(String(consent.user_id)) || String(consent.user_id).substring(0, 13) + "...",
  }))

  return result
}
