"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "./supabase/client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 3

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        retryCount = 0 // Reset on success
      } catch (error) {
        console.error("Failed to get initial session:", error)
        retryCount++

        if (retryCount < maxRetries) {
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000)
          setTimeout(getInitialSession, backoffDelay)
        } else {
          setUser(null)
          setLoading(false)
        }
        return
      }
      setLoading(false)
    }

    getInitialSession()

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error("Failed to setup auth state listener:", error)
      setLoading(false)
    }
  }, [supabase])

  const login = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const register = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
      },
    })
    if (error) throw error
  }

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return <AuthContext.Provider value={{ user, login, logout, register, loading }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
