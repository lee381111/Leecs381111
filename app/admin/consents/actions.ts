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

  if (!consents || consents.length === 0) {
    return []
  }

  const userIds = consents.map((c) => String(c.user_id))

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, email")
    .in("user_id", userIds)

  if (profilesError) {
    console.error("[v0] Failed to load profiles:", profilesError.message)
  }

  const emailMap = new Map()

  profiles?.forEach((p) => {
    if (p.user_id && p.email) {
      // profiles.user_id(TEXT)를 소문자로 변환하여 매핑
      emailMap.set(p.user_id.toLowerCase(), p.email)
    }
  })

  const result = consents.map((consent) => {
    const userId = String(consent.user_id).toLowerCase()
    const email = emailMap.get(userId) || `User ${userId.substring(0, 8)}...`

    return {
      id: String(consent.id),
      user_id: String(consent.user_id),
      terms_version: consent.terms_version,
      privacy_version: consent.privacy_version,
      agreed_at: consent.agreed_at,
      user_agent: consent.user_agent,
      email,
    }
  })

  return result
}
