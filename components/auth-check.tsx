"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth/client"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      const isAuthPage = pathname?.startsWith("/auth")

      setIsChecking(false)

      if (!authenticated && !isAuthPage) {
        // Not authenticated and not on auth page - redirect to login
        router.push("/auth/login")
      } else if (authenticated && isAuthPage) {
        // Authenticated but on auth page - redirect to home
        router.push("/")
      }
    }

    checkAuth()
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
