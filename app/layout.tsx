import type React from "react"
import { Analytics } from "@vercel/analytics/next"
// <CHANGE> Import AuthProvider to wrap the app
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

// ... existing code ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {/* <CHANGE> Wrap children with AuthProvider so useAuth can be used throughout the app */}
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
