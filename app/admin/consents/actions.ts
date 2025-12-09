"use server"

import { createClient } from "@/lib/supabase/server"

export async function loadAllConsentsWithEmails() {
  const supabase = await createClient()

  const { data: consents, error } = await supabase
    .from("user_consents")
    .select(`
      id,
      user_id,
      terms_version,
      privacy_version,
      agreed_at,
      user_agent,
      profiles!inner(email)
    `)
    .order("agreed_at", { ascending: false })

  if (error) {
    console.error("[v0] Failed to load consents with emails:", error.message)
    return []
  }

  if (!consents || consents.length === 0) {
    return []
  }

  const result = consents.map((consent: any) => ({
    id: String(consent.id),
    user_id: String(consent.user_id),
    terms_version: consent.terms_version,
    privacy_version: consent.privacy_version,
    agreed_at: consent.agreed_at,
    user_agent: consent.user_agent,
    email: consent.profiles?.email || `User ${String(consent.user_id).substring(0, 8)}...`,
  }))

  return result
}
