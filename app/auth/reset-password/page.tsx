"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<"ko" | "en" | "zh" | "ja">("ko")

  const t = {
    ko: {
      resetPassword: "비밀번호 재설정",
      resetDescription: "가입 시 사용한 이메일을 입력하세요",
      email: "이메일",
      emailPlaceholder: "example@email.com",
      sendResetLink: "재설정 링크 보내기",
      sending: "전송 중...",
      successMessage: "비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.",
      errorMessage: "오류가 발생했습니다. 이메일을 확인하고 다시 시도해주세요.",
      backToLogin: "로그인으로 돌아가기",
      instructions: "재설정 링크를 받으면 이메일의 링크를 클릭하여 새 비밀번호를 설정할 수 있습니다.",
    },
    en: {
      resetPassword: "Reset Password",
      resetDescription: "Enter the email you used to sign up",
      email: "Email",
      emailPlaceholder: "example@email.com",
      sendResetLink: "Send Reset Link",
      sending: "Sending...",
      successMessage: "Password reset link has been sent to your email. Please check your inbox.",
      errorMessage: "An error occurred. Please check your email and try again.",
      backToLogin: "Back to Login",
      instructions: "Once you receive the reset link, click it to set a new password.",
    },
    zh: {
      resetPassword: "重置密码",
      resetDescription: "输入您注册时使用的电子邮件",
      email: "电子邮件",
      emailPlaceholder: "example@email.com",
      sendResetLink: "发送重置链接",
      sending: "发送中...",
      successMessage: "密码重置链接已发送到您的电子邮件。请检查您的收件箱。",
      errorMessage: "发生错误。请检查您的电子邮件并重试。",
      backToLogin: "返回登录",
      instructions: "收到重置链接后，请点击链接设置新密码。",
    },
    ja: {
      resetPassword: "パスワードリセット",
      resetDescription: "登録時に使用したメールアドレスを入力してください",
      email: "メール",
      emailPlaceholder: "example@email.com",
      sendResetLink: "リセットリンクを送信",
      sending: "送信中...",
      successMessage: "パスワードリセットリンクがメールで送信されました。受信トレイをご確認ください。",
      errorMessage: "エラーが発生しました。メールアドレスを確認して再試行してください。",
      backToLogin: "ログインに戻る",
      instructions: "リセットリンクを受け取ったら、クリックして新しいパスワードを設定できます。",
    },
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      setSuccess(true)
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
              <CardTitle className="text-2xl">{t[language].resetPassword}</CardTitle>
              <CardDescription>{t[language].resetDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-800">{t[language].successMessage}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{t[language].instructions}</p>
                  <Link href="/auth/login">
                    <Button className="w-full bg-transparent" variant="outline">
                      {t[language].backToLogin}
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t[language].email}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t[language].emailPlaceholder}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                      {isLoading ? t[language].sending : t[language].sendResetLink}
                    </Button>

                    <Link href="/auth/login" className="text-center">
                      <Button variant="ghost" className="w-full" type="button">
                        {t[language].backToLogin}
                      </Button>
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
