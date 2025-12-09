"use server"

import { createClient } from "@/lib/supabase/server"

export async function loadAllConsentsWithEmails() {
  const supabase = await createClient()

  const { data: consents, error: consentsError } = await supabase
    .from("user_consents")
    .select("*")
    .order("agreed_at", { ascending: false })

  if (consentsError) {
    console.error("[v0] Failed to load consents:", consentsError)
    return []
  }

  if (!consents || consents.length === 0) {
    return []
  }

  const {
    data: { users },
    error: usersError,
  } = await supabase.auth.admin.listUsers()

  if (usersError) {
    console.error("[v0] Failed to load users:", usersError)
    // Return consents without emails if auth fails
    return consents.map((consent) => ({
      ...consent,
      email: consent.user_id.substring(0, 13) + "...",
    }))
  }

  const emailMap = new Map(users.map((user) => [user.id, user.email || "No email"]))

  return consents.map((consent) => ({
    ...consent,
    email: emailMap.get(consent.user_id) || consent.user_id.substring(0, 13) + "...",
  }))
}
