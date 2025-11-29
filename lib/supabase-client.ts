"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseClient: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] ===== Supabase Connection Diagnostics =====")
  console.log("[v0] Supabase URL:", supabaseUrl || "❌ MISSING")
  console.log("[v0] Supabase Anon Key:", supabaseAnonKey ? "✓ Set" : "❌ MISSING")
  console.log("[v0] Full URL:", supabaseUrl)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] ❌ Missing Supabase environment variables!")
    console.error("[v0] This means the app cannot connect to the database.")
    throw new Error("Missing Supabase environment variables - check deployment settings")
  }

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  console.log("[v0] ✓ Supabase client created successfully")

  return supabaseClient
}
