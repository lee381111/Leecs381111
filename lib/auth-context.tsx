"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "./supabase/client"
import type { User } from "@supabase/supabase-js"
import { isPiEnvironment, initPiSDK, authenticateWithPi, type PiUser } from "./pi-utils"
import { initializeUserStorageQuota } from "./storage-quota"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithPi: () => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<void>
  loading: boolean
  isPiMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPiMode, setIsPiMode] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const piMode = isPiEnvironment()
    setIsPiMode(piMode)

    if (piMode) {
      initPiSDK()
      // Check for existing Pi session in localStorage
      const piUserId = localStorage.getItem("pi_user_id")
      if (piUserId) {
        // Load Pi user session
        loadPiUserSession(piUserId)
      }
    }

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => {
        try {
          subscription.unsubscribe()
        } catch (error) {
          // Silently ignore unsubscribe errors
        }
      }
    } catch (error) {
      // Silently ignore auth state change errors - app will work without auth
      return () => {}
    }
  }, [supabase])

  const loadPiUserSession = async (piUserId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", piUserId).single()

      if (!error && data) {
        // Create a mock User object for Pi authentication
        setUser({
          id: piUserId,
          email: data.email || `${data.pi_username}@pi.network`,
          user_metadata: { display_name: data.name },
        } as User)
      }
    } catch (error) {
      console.error("[v0] Failed to load Pi user session:", error)
    }
  }

  const loginWithPi = async (): Promise<void> => {
    try {
      setLoading(true)
      const piUser: PiUser = await authenticateWithPi()

      // Store Pi session
      localStorage.setItem("pi_access_token", piUser.accessToken)
      localStorage.setItem("pi_user_id", piUser.uid)

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", piUser.uid)
        .single()

      // Create or update user profile in Supabase
      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: piUser.uid,
          email: `${piUser.username}@pi.network`,
          name: piUser.username,
          pi_username: piUser.username,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )

      if (error) throw error

      if (!existingProfile) {
        await initializeUserStorageQuota(piUser.uid, "pi", piUser.username)
      }

      // Set user in context
      setUser({
        id: piUser.uid,
        email: `${piUser.username}@pi.network`,
        user_metadata: { display_name: piUser.username },
      } as User)
    } catch (error) {
      console.error("[v0] Pi login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const register = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
      },
    })
    if (error) throw error

    if (data.user) {
      await initializeUserStorageQuota(data.user.id, "email")
    }
  }

  const logout = async (): Promise<void> => {
    if (isPiMode) {
      localStorage.removeItem("pi_access_token")
      localStorage.removeItem("pi_user_id")
      setUser(null)
    } else {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithPi, logout, register, loading, isPiMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
