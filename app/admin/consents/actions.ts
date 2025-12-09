"use server"

import { createClient } from "@/lib/supabase/server"

export async function loadAllConsentsWithEmails() {
  const supabase = await createClient()

  console.log("[v0] Starting to load all user consents...")

  const { data: consents, error: consentsError } = await supabase
    .from("user_consents")
    .select("*")
    .order("agreed_at", { ascending: false })

  console.log("[v0] user_consents query result:", {
    count: consents?.length || 0,
    error: consentsError,
    data: consents,
  })

  if (consentsError) {
    console.error("[v0] Failed to load consents:", consentsError)
    return []
  }

  if (!consents || consents.length === 0) {
    console.log("[v0] No consents found in database")
    return []
  }

  console.log("[v0] Found", consents.length, "consent records, now loading user emails...")

  const {
    data: { users },
    error: usersError,
  } = await supabase.auth.admin.listUsers()

  console.log("[v0] auth.admin.listUsers result:", {
    userCount: users?.length || 0,
    error: usersError,
  })

  if (usersError) {
    console.error("[v0] Failed to load users:", usersError)
    // Return consents without emails if auth fails
    return consents.map((consent) => ({
      ...consent,
      email: consent.user_id.substring(0, 13) + "...",
    }))
  }

  const emailMap = new Map(users.map((user) => [user.id, user.email || "No email"]))

  console.log("[v0] Email map created with", emailMap.size, "entries")

  const result = consents.map((consent) => ({
    ...consent,
    email: emailMap.get(consent.user_id) || consent.user_id.substring(0, 13) + "...",
  }))

  console.log("[v0] Final result:", result)

  return result
}
