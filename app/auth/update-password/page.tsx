"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<"ko" | "en" | "zh" | "ja">("ko")
  const router = useRouter()

  const t = {
    ko: {
      updatePassword: "새 비밀번호 설정",
      updateDescription: "새로운 비밀번호를 입력하세요",
      newPassword: "새 비밀번호",
      confirmPassword: "비밀번호 확인",
      passwordMismatch: "비밀번호가 일치하지 않습니다",
      passwordTooShort: "비밀번호는 최소 6자 이상이어야 합니다",
      updateButton: "비밀번호 변경",
      updating: "변경 중...",
      successMessage: "비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.",
      errorMessage: "비밀번호 변경 중 오류가 발생했습니다",
    },
    en: {
      updatePassword: "Set New Password",
      updateDescription: "Enter your new password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      passwordMismatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters",
      updateButton: "Update Password",
      updating: "Updating...",
      successMessage: "Password updated successfully. Redirecting to login...",
      errorMessage: "An error occurred while updating password",
    },
    zh: {
      updatePassword: "设置新密码",
      updateDescription: "输入您的新密码",
      newPassword: "新密码",
      confirmPassword: "确认密码",
      passwordMismatch: "密码不匹配",
      passwordTooShort: "密码必须至少6个字符",
      updateButton: "更新密码",
      updating: "更新中...",
      successMessage: "密码更新成功。正在重定向到登录...",
      errorMessage: "更新密码时发生错误",
    },
    ja: {
      updatePassword: "新しいパスワードを設定",
      updateDescription: "新しいパスワードを入力してください",
      newPassword: "新しいパスワード",
      confirmPassword: "パスワード確認",
      passwordMismatch: "パスワードが一致しません",
      passwordTooShort: "パスワードは最低6文字必要です",
      updateButton: "パスワードを更新",
      updating: "更新中...",
      successMessage: "パスワードが正常に更新されました。ログインにリダイレクトしています...",
      errorMessage: "パスワードの更新中にエラーが発生しました",
    },
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError(t[language].passwordMismatch)
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError(t[language].passwordTooShort)
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      alert(t[language].successMessage)
      router.push("/auth/login")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t[language].errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t[language].updatePassword}</CardTitle>
              <CardDescription>{t[language].updateDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t[language].newPassword}</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">{t[language].confirmPassword}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                    {isLoading ? t[language].updating : t[language].updateButton}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
