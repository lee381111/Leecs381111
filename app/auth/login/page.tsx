"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { signIn, isAuthenticated } from "@/lib/auth/client"
import { isMasterSessionValid } from "@/lib/auth/master-password"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isMasterSessionValid()) {
      router.push("/auth/master-password")
      return
    }

    if (isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { user, error: signInError } = await signIn(email, password)

    if (signInError) {
      setError(signInError)
      setIsLoading(false)
      return
    }

    if (user) {
      sessionStorage.setItem("logged_in_this_session", "true")
      window.location.href = "/"
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>이메일과 비밀번호를 입력하여 로그인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                계정이 없으신가요?{" "}
                <Link href="/auth/sign-up" className="underline underline-offset-4 font-medium">
                  회원가입
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
