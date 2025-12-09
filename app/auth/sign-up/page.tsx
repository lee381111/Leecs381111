"use client"

import type React from "react"
import { saveUserConsent } from "@/lib/storage"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<"ko" | "en" | "zh" | "ja">("ko")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const router = useRouter() // Declare the router variable

  const t = {
    ko: {
      signUp: "회원가입",
      createAccount: "새 계정을 만드세요",
      name: "이름",
      namePlaceholder: "홍길동",
      email: "이메일",
      emailPlaceholder: "example@email.com",
      password: "비밀번호",
      confirmPassword: "비밀번호 확인",
      passwordMismatch: "비밀번호가 일치하지 않습니다",
      signUpError: "회원가입 중 오류가 발생했습니다",
      creating: "계정 생성 중...",
      signUpButton: "회원가입",
      haveAccount: "이미 계정이 있으신가요?",
      login: "로그인",
      emailVerification: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
      agreeTerms: "이용약관에 동의합니다",
      agreePrivacy: "개인정보처리방침에 동의합니다",
      viewTerms: "전문보기",
      mustAgree: "이용약관과 개인정보처리방침에 동의해주세요",
      required: "(필수)",
    },
    en: {
      signUp: "Sign Up",
      createAccount: "Create a new account",
      name: "Name",
      namePlaceholder: "John Doe",
      email: "Email",
      emailPlaceholder: "example@email.com",
      password: "Password",
      confirmPassword: "Confirm Password",
      passwordMismatch: "Passwords do not match",
      signUpError: "An error occurred during sign up",
      creating: "Creating account...",
      signUpButton: "Sign Up",
      haveAccount: "Already have an account?",
      login: "Login",
      emailVerification: "Sign up complete. Please check your email.",
      agreeTerms: "I agree to the Terms of Service",
      agreePrivacy: "I agree to the Privacy Policy",
      viewTerms: "View Full Text",
      mustAgree: "Please agree to Terms of Service and Privacy Policy",
      required: "(Required)",
    },
    zh: {
      signUp: "注册",
      createAccount: "创建新帐户",
      name: "姓名",
      namePlaceholder: "张三",
      email: "电子邮件",
      emailPlaceholder: "example@email.com",
      password: "密码",
      confirmPassword: "确认密码",
      passwordMismatch: "密码不匹配",
      signUpError: "注册时发生错误",
      creating: "正在创建帐户...",
      signUpButton: "注册",
      haveAccount: "已有帐户？",
      login: "登录",
      emailVerification: "注册完成。请检查您的电子邮件。",
      agreeTerms: "我同意服务条款",
      agreePrivacy: "我同意隐私政策",
      viewTerms: "查看全文",
      mustAgree: "请同意服务条款和隐私政策",
      required: "(必需)",
    },
    ja: {
      signUp: "新規登録",
      createAccount: "新しいアカウントを作成",
      name: "名前",
      namePlaceholder: "山田太郎",
      email: "メール",
      emailPlaceholder: "example@email.com",
      password: "パスワード",
      confirmPassword: "パスワード確認",
      passwordMismatch: "パスワードが一致しません",
      signUpError: "登録中にエラーが発生しました",
      creating: "アカウント作成中...",
      signUpButton: "新規登録",
      haveAccount: "すでにアカウントをお持ちですか？",
      login: "ログイン",
      emailVerification: "登録完了。メールを確認してください。",
      agreeTerms: "利用規約に同意します",
      agreePrivacy: "プライバシーポリシーに同意します",
      viewTerms: "全文表示",
      mustAgree: "利用規約とプライバシーポリシーに同意してください",
      required: "(必須)",
    },
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!agreeTerms || !agreePrivacy) {
      setError(t[language].mustAgree)
      setIsLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setError(t[language].passwordMismatch)
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError(language === "ko" ? "비밀번호는 최소 6자 이상이어야 합니다" : "Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}`,
          data: {
            display_name: displayName,
          },
        },
      })
      if (error) throw error

      if (data.user) {
        try {
          const { error: profileError } = await supabase.from("profiles").upsert(
            {
              id: data.user.id,
              user_id: data.user.id,
              email: email,
              name: displayName,
              auth_type: "email",
              storage_quota: 524288000,
              storage_used: 0,
              language: language,
              theme: "light",
            },
            {
              onConflict: "id",
            },
          )

          if (profileError) {
            console.error("[v0] Failed to create profile:", profileError)
          } else {
            console.log("[v0] Profile created successfully for:", email)
          }
        } catch (profileError) {
          console.error("[v0] Profile creation error:", profileError)
        }

        try {
          console.log("[v0] Saving consent during sign up for user:", data.user.id)
          await saveUserConsent(data.user.id, "v1.0_2025-12", "v1.0_2025-12", undefined, navigator.userAgent)
          console.log("[v0] Sign up consent saved successfully")
        } catch (consentError) {
          console.error("[v0] Failed to save consent log:", consentError)
        }
      }

      alert(t[language].emailVerification)
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t[language].signUpError)
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
              <CardTitle className="text-2xl">{t[language].signUp}</CardTitle>
              <CardDescription>{t[language].createAccount}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="display-name">{t[language].name}</Label>
                    <Input
                      id="display-name"
                      type="text"
                      placeholder={t[language].namePlaceholder}
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
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
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t[language].password}</Label>
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
                    <Label htmlFor="repeat-password">{t[language].confirmPassword}</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      minLength={6}
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 border-t">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agree-terms"
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="agree-terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <span className="text-red-500">{t[language].required}</span> {t[language].agreeTerms}
                        </label>
                        <Link
                          href={`/terms-of-service?lang=${language}`}
                          target="_blank"
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          {t[language].viewTerms}
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agree-privacy"
                        checked={agreePrivacy}
                        onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="agree-privacy"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <span className="text-red-500">{t[language].required}</span> {t[language].agreePrivacy}
                        </label>
                        <Link
                          href={`/privacy-policy?lang=${language}`}
                          target="_blank"
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          {t[language].viewTerms}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading || !agreeTerms || !agreePrivacy}
                  >
                    {isLoading ? t[language].creating : t[language].signUpButton}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  {t[language].haveAccount}{" "}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    {t[language].login}
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
