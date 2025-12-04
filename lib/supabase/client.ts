import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = "https://coxqfhtmzqhxvfqclcvp.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNveHFmaHRtenFoeHZmcWNsY3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzNjM5MDUsImV4cCI6MjA0NTkzOTkwNX0.Z3oYKEfHwjL7o5zphCUuUFPqEi6Xy3HQqA_wfJSp-Bk"

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
        return cookie ? cookie.split("=")[1] : null
      },
      set(name: string, value: string, options: any) {
        document.cookie = `${name}=${value}; path=/; ${
          options.maxAge ? `max-age=${options.maxAge};` : ""
        } ${options.secure ? "secure;" : ""} ${options.sameSite ? `samesite=${options.sameSite};` : ""}`
      },
      remove(name: string, options: any) {
        document.cookie = `${name}=; path=/; max-age=0`
      },
    },
  })
}

export { createClient as createBrowserClient }
