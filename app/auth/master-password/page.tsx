"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { verifyMasterPassword, isMasterSessionValid } from "@/lib/auth/master-password"

export default function MasterPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If already verified, redirect to login
    if (isMasterSessionValid()) {
      router.push("/auth/login")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = verifyMasterPassword(password)

    if (result.success) {
      // Redirect to login page
      window.location.href = "/auth/login"
    } else {
      setError(result.error || "마스터 비밀번호 확인에 실패했습니다.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">앱 잠금 해제</h1>
            <p className="text-gray-600 dark:text-gray-400">마스터 비밀번호를 입력하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">마스터 비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="마스터 비밀번호 입력"
                required
                disabled={isLoading}
                className="h-12"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? "확인 중..." : "잠금 해제"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>이 앱은 2단계 보안으로 보호됩니다</p>
            <p className="mt-1">1단계: 마스터 비밀번호 → 2단계: 개인 계정 로그인</p>
          </div>
        </div>
      </div>
    </div>
  )
}
