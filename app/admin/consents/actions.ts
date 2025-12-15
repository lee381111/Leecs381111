"use server"

import { createClient } from "@/lib/supabase/server"

export async function loadAllConsentsWithEmails() {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_consents_with_emails")

  if (error) {
    console.error("[v0] RPC error:", error)
    // Fallback: 기존 방식으로 시도
    return await fallbackLoadConsents(supabase)
  }

  if (!data) {
    return []
  }

  return data.map((row: any) => ({
    id: String(row.id),
    user_id: String(row.user_id),
    terms_version: row.terms_version,
    privacy_version: row.privacy_version,
    agreed_at: row.agreed_at,
    user_agent: row.user_agent,
    email: row.email || `User ${String(row.user_id).substring(0, 8)}...`,
  }))
}

async function fallbackLoadConsents(supabase: any) {
  // 1. user_consents 모두 가져오기
  const { data: consents, error: consentsError } = await supabase
    .from("user_consents")
    .select("id, user_id, terms_version, privacy_version, agreed_at, user_agent")
    .order("agreed_at", { ascending: false })

  if (consentsError || !consents) {
    return []
  }

  // 2. profiles 모두 가져오기
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("user_id, email")

  if (profilesError || !profiles) {
    return consents.map((c: any) => ({
      id: String(c.id),
      user_id: String(c.user_id),
      terms_version: c.terms_version,
      privacy_version: c.privacy_version,
      agreed_at: c.agreed_at,
      user_agent: c.user_agent,
      email: `User ${String(c.user_id).substring(0, 8)}...`,
    }))
  }

  // 3. user_id를 정확히 비교하여 매칭 (대소문자 구분 없이, 공백 제거)
  const profileMap = new Map<string, string>()
  profiles.forEach((p: any) => {
    const normalizedId = String(p.user_id).trim().toLowerCase()
    profileMap.set(normalizedId, p.email)
  })

  return consents.map((consent: any) => {
    const normalizedConsentId = String(consent.user_id).trim().toLowerCase()
    const email = profileMap.get(normalizedConsentId)

    return {
      id: String(consent.id),
      user_id: String(consent.user_id),
      terms_version: consent.terms_version,
      privacy_version: consent.privacy_version,
      agreed_at: consent.agreed_at,
      user_agent: consent.user_agent,
      email: email || `User ${String(consent.user_id).substring(0, 8)}...`,
    }
  })
}
