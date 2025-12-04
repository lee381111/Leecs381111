import { createBrowserClient as createClient } from "@supabase/ssr"

const SUPABASE_URL = "https://coxqfhtmzqhxvfqclcvp.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNveHFmaHRtenFoeHZmcWNsY3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzNjM5MDUsImV4cCI6MjA0NTkzOTkwNX0.Z3oYKEfHwjL7o5zphCUuUFPqEi6Xy3HQqA_wfJSp-Bk"

export function createBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export { createBrowserClient as createClient }
