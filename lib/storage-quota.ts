// Storage quota management for differentiated user tiers
import { createBrowserClient } from "@supabase/ssr"

const ADMIN_EMAIL = "lee381111@gmail.com"

// Storage quota constants (in bytes)
export const STORAGE_QUOTAS = {
  ADMIN: 1073741824, // 1000MB (1GB) for admin
  EMAIL_USER: 524288000, // 500MB for email users (free forever)
  PI_FREE: 52428800, // 50MB for Pi free users
  PI_PREMIUM: 524288000, // 500MB for Pi premium users
} as const

export type AuthType = "email" | "pi"

export interface StorageInfo {
  quota: number
  used: number
  remaining: number
  percentage: number
  isPremium: boolean
  authType: AuthType
}

async function isAdminUser(userId: string): Promise<boolean> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data: profile } = await supabase.from("profiles").select("email").eq("id", userId).single()

  return profile?.email === ADMIN_EMAIL
}

// Get user's storage information
export async function getUserStorageInfo(userId: string): Promise<StorageInfo | null> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("storage_quota, storage_used, is_premium, auth_type, email")
    .eq("id", userId)
    .single()

  if (error || !profile) {
    console.error("[v0] Error fetching storage info:", error)
    return null
  }

  const isAdmin = profile.email === ADMIN_EMAIL
  const quota = isAdmin ? STORAGE_QUOTAS.ADMIN : profile.storage_quota || STORAGE_QUOTAS.EMAIL_USER

  const used = profile.storage_used || 0
  const remaining = Math.max(0, quota - used)
  const percentage = quota > 0 ? (used / quota) * 100 : 0

  return {
    quota,
    used,
    remaining,
    percentage,
    isPremium: profile.is_premium || false,
    authType: (profile.auth_type as AuthType) || "email",
  }
}

// Check if user has enough storage space
export async function checkStorageAvailable(
  userId: string,
  additionalBytes: number,
): Promise<{ available: boolean; info: StorageInfo | null }> {
  const info = await getUserStorageInfo(userId)

  if (!info) {
    return { available: false, info: null }
  }

  const available = info.remaining >= additionalBytes
  return { available, info }
}

// Update storage usage after upload/delete
export async function updateStorageUsage(
  userId: string,
  bytesChange: number, // positive for upload, negative for delete
): Promise<boolean> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data: profile } = await supabase.from("profiles").select("storage_used").eq("id", userId).single()

  if (!profile) return false

  const newUsage = Math.max(0, (profile.storage_used || 0) + bytesChange)

  const { error } = await supabase.from("profiles").update({ storage_used: newUsage }).eq("id", userId)

  if (error) {
    console.error("[v0] Error updating storage usage:", error)
    return false
  }

  return true
}

// Initialize storage quota for new user
export async function initializeUserStorageQuota(
  userId: string,
  authType: AuthType,
  piUsername?: string,
): Promise<boolean> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const isAdmin = await isAdminUser(userId)

  // Determine initial quota based on auth type or admin status
  let quota: number
  if (isAdmin) {
    quota = STORAGE_QUOTAS.ADMIN // 1GB for admin
  } else {
    quota = authType === "email" ? STORAGE_QUOTAS.EMAIL_USER : STORAGE_QUOTAS.PI_FREE
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      storage_quota: quota,
      storage_used: 0,
      is_premium: false,
      auth_type: authType,
      pi_username: piUsername || null,
    })
    .eq("id", userId)

  if (error) {
    console.error("[v0] Error initializing storage quota:", error)
    return false
  }

  return true
}

// Upgrade Pi user to premium (called after successful Pi Payment)
export async function upgradeToPremium(userId: string, durationMonths = 1): Promise<boolean> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + durationMonths)

  const { error } = await supabase
    .from("profiles")
    .update({
      is_premium: true,
      storage_quota: STORAGE_QUOTAS.PI_PREMIUM,
      premium_expires_at: expiresAt.toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("[v0] Error upgrading to premium:", error)
    return false
  }

  return true
}

// Format bytes to human-readable size
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
