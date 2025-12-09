"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const router = useRouter()
  const { login, loginWithPi, isPiMode } = useAuth()

  useEffect(() => {
    if (isPiMode) {
      const piUserId = localStorage.getItem("pi_user_id")
      if (piUserId) {
        router.push("/")
      }
    }
  }, [isPiMode, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setError(null)

    try {
      await login(email, password)

      await new Promise((resolve) => setTimeout(resolve, 500))

      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePiLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await loginWithPi()
      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Pi 로그인 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  if (isPiMode) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{showEmailLogin ? "이메일 로그인" : "Pi Network 로그인"}</CardTitle>
                <CardDescription>
                  {showEmailLogin ? "이메일과 비밀번호를 입력하여 로그인하세요" : "Pi 지갑으로 안전하게 로그인하세요"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showEmailLogin ? (
                  <div className="flex flex-col gap-4">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button
                      onClick={handlePiLogin}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "로그인 중..." : "🥧 Pi로 로그인"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Pi Network 앱 내에서 자동으로 로그인됩니다
                    </p>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">또는</span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setShowEmailLogin(true)} className="w-full">
                      이메일로 로그인
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleEmailLogin}>
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
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">비밀번호</Label>
                          <Link href="/auth/reset-password" className="text-sm text-emerald-600 hover:underline">
                            비밀번호를 잊으셨나요?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {error && <p className="text-sm text-red-500">{error}</p>}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "로그인 중..." : "로그인"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setShowEmailLogin(false)} className="w-full">
                        Pi 로그인으로 돌아가기
                      </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                      계정이 없으신가요?{" "}
                      <Link href="/auth/sign-up" className="underline underline-offset-4">
                        회원가입
                      </Link>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">로그인</CardTitle>
              <CardDescription>이메일과 비밀번호를 입력하여 로그인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailLogin}>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">비밀번호</Label>
                      <Link href="/auth/reset-password" className="text-sm text-emerald-600 hover:underline">
                        비밀번호를 잊으셨나요?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "로그인 중..." : "로그인"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  계정이 없으신가요?{" "}
                  <Link href="/auth/sign-up" className="underline underline-offset-4">
                    회원가입
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
