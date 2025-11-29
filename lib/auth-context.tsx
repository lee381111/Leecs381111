"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "./supabase-client"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    console.log("[v0] AuthProvider: Checking session")
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("[v0] Error getting session:", error)
      }
      console.log("[v0] Session user:", session?.user?.email || "No user")
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[v0] Auth state changed:", event, session?.user?.email || "No user")
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    console.log("[v0] Signing in:", email)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error("[v0] Sign in error:", error)
      throw error
    }
    console.log("[v0] Sign in successful")
  }

  const signUp = async (email: string, password: string) => {
    console.log("[v0] Signing up:", email)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
      },
    })
    if (error) {
      console.error("[v0] Sign up error:", error)
      throw error
    }
    console.log("[v0] Sign up successful - check email for confirmation")
  }

  const signOut = async () => {
    console.log("[v0] Signing out")
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("[v0] Sign out error:", error)
      throw error
    }
    console.log("[v0] Sign out successful")
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
