import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

function parseCookies() {
  return document.cookie.split(";").reduce((acc: Record<string, string>, cookie) => {
    const [name, value] = cookie.trim().split("=")
    if (name && value) acc[name] = decodeURIComponent(value)
    return acc
  }, {})
}

function serializeCookieOptions(options: any = {}) {
  const parts = []
  if (options.maxAge) parts.push(`max-age=${options.maxAge}`)
  if (options.path) parts.push(`path=${options.path}`)
  if (options.domain) parts.push(`domain=${options.domain}`)
  if (options.sameSite) parts.push(`samesite=${options.sameSite}`)
  if (options.secure) parts.push("secure")
  if (options.httpOnly) parts.push("httponly")
  return parts.join("; ")
}

export function createClient() {
  if (supabaseClient) return supabaseClient

  supabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        if (typeof document === "undefined") return []
        const cookies = parseCookies()
        return Object.entries(cookies).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookiesToSet) {
        if (typeof document === "undefined") return
        cookiesToSet.forEach(({ name, value, options }) => {
          const serialized = serializeCookieOptions(options)
          document.cookie = `${name}=${encodeURIComponent(value)}; ${serialized}`
        })
      },
    },
  })

  return supabaseClient
}
