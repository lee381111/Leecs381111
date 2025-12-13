"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { PasswordProtection } from "./password-protection"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isPublicRoute = pathname?.startsWith("/shared/")

  if (isPublicRoute) {
    return <>{children}</>
  }

  return <PasswordProtection>{children}</PasswordProtection>
}
