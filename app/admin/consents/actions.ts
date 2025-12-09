"use server"

import { createClient } from "@/lib/supabase/server"

export async function loadAllConsentsWithEmails() {
  const supabase = await createClient()

  // 1. user_consents 모두 가져오기
  const { data: consents, error: consentsError } = await supabase
    .from("user_consents")
    .select("id, user_id, terms_version, privacy_version, agreed_at, user_agent")
    .order("agreed_at", { ascending: false })

  if (consentsError || !consents) {
    console.error("[v0] Failed to load consents:", consentsError?.message)
    return []
  }

  // 2. profiles 모두 가져오기
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("user_id, email")

  if (profilesError) {
    console.error("[v0] Failed to load profiles:", profilesError.message)
  }

  // 3. JavaScript에서 매칭
  const profileMap = new Map<string, string>()
  if (profiles) {
    profiles.forEach((p) => {
      // user_id를 소문자로 통일하여 매핑
      profileMap.set(p.user_id.toLowerCase(), p.email)
    })
  }

  // 4. 결과 생성
  const result = consents.map((consent) => {
    const userIdLower = String(consent.user_id).toLowerCase()
    const email = profileMap.get(userIdLower) || `User ${String(consent.user_id).substring(0, 8)}...`

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

  console.log("[v0] Consent records with emails:", result.length)
  console.log("[v0] Emails found:", result.map((r) => r.email).join(", "))

  return result
}
