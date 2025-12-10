"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function EmailVerificationContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const lang = (searchParams.get("lang") || "ko") as "ko" | "en" | "zh" | "ja"

  const t = {
    ko: {
      title: "이메일 확인이 필요합니다",
      description: "회원가입이 거의 완료되었습니다!",
      message: "다음 이메일로 인증 링크를 보내드렸습니다:",
      instructions: "이메일을 확인하시고 인증 링크를 클릭하여 계정을 활성화해주세요.",
      spam: "이메일이 보이지 않으면 스팸함을 확인해주세요.",
      backToHome: "홈으로 돌아가기",
    },
    en: {
      title: "Email Verification Required",
      description: "You're almost there!",
      message: "We've sent a verification link to:",
      instructions: "Please check your email and click the verification link to activate your account.",
      spam: "If you don't see the email, please check your spam folder.",
      backToHome: "Back to Home",
    },
    zh: {
      title: "需要验证电子邮件",
      description: "您快完成了！",
      message: "我们已向以下地址发送了验证链接：",
      instructions: "请检查您的电子邮件并点击验证链接以激活您的帐户。",
      spam: "如果您没有看到电子邮件，请检查您的垃圾邮件文件夹。",
      backToHome: "返回主页",
    },
    ja: {
      title: "メール確認が必要です",
      description: "もう少しで完了です！",
      message: "以下のメールアドレスに確認リンクを送信しました：",
      instructions: "メールを確認して、確認リンクをクリックしてアカウントを有効化してください。",
      spam: "メールが見つからない場合は、迷惑メールフォルダを確認してください。",
      backToHome: "ホームに戻る",
    },
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Mail className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl">{t[lang].title}</CardTitle>
            <CardDescription>{t[lang].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t[lang].message}</p>
              <p className="text-base font-semibold text-emerald-600">{email}</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
              <p className="text-sm">{t[lang].instructions}</p>
              <p className="text-xs text-muted-foreground">{t[lang].spam}</p>
            </div>

            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/">{t[lang].backToHome}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationContent />
    </Suspense>
  )
}
