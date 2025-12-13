"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Language } from "@/lib/types"

interface LoginFormProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function LoginForm({ language, onLanguageChange }: LoginFormProps) {
  const { login, signUp } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isRegister) {
        await signUp(email, password)
      } else {
        await login(email, password)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getTranslation = (key: string) => {
    const translations: Record<string, Record<Language, string>> = {
      login: { ko: "로그인", en: "Login", zh: "登录", ja: "ログイン" },
      email: { ko: "이메일", en: "Email", zh: "电子邮件", ja: "メール" },
      password: { ko: "비밀번호", en: "Password", zh: "密码", ja: "パスワード" },
      loginButton: { ko: "로그인", en: "Login", zh: "登录", ja: "ログイン" },
      signUpButton: { ko: "회원가입", en: "Sign Up", zh: "注册", ja: "登録" },
      noAccount: {
        ko: "계정이 없으신가요?",
        en: "Don't have an account?",
        zh: "还没有账户？",
        ja: "アカウントをお持ちではありませんか？",
      },
      haveAccount: {
        ko: "이미 계정이 있으신가요?",
        en: "Already have an account?",
        zh: "已有账户？",
        ja: "すでにアカウントをお持ちですか？",
      },
      forgotPassword: {
        ko: "비밀번호를 잊으셨나요?",
        en: "Forgot password?",
        zh: "忘记密码？",
        ja: "パスワードをお忘れですか？",
      },
      freeStorage: {
        ko: "개인당 500MB 무료 저장소 제공",
        en: "500MB free storage per user",
        zh: "每个用户提供500MB免费存储空间",
        ja: "1ユーザーあたり500MB無料ストレージ提供",
      },
    }
    return translations[key]?.[language] || key
  }

  return (
    <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur">
      <h2 className="text-2xl font-bold text-center mb-6 text-emerald-700">
        {isRegister ? getTranslation("signUpButton") : getTranslation("login")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{getTranslation("email")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{getTranslation("password")}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {!isRegister && (
          <div className="text-center">
            <a href="/auth/reset-password" className="text-sm text-blue-600 hover:underline">
              {getTranslation("forgotPassword")}
            </a>
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "..." : isRegister ? getTranslation("signUpButton") : getTranslation("loginButton")}
        </Button>
        <p className="text-center text-sm">
          {isRegister ? getTranslation("haveAccount") : getTranslation("noAccount")}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setError("")
            }}
            className="text-blue-600 hover:underline"
            disabled={loading}
          >
            {isRegister ? getTranslation("loginButton") : getTranslation("signUpButton")}
          </button>
        </p>
        <p className="text-center text-xs text-gray-600 mt-4">{getTranslation("freeStorage")}</p>
      </form>
    </Card>
  )
}
