"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getTranslation, type Language } from "@/lib/i18n"

export default function TermsOfServicePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>("ko")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  const t = (key: string) => getTranslation(language, key as any)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
        </Button>

        <Card className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">{t("terms_of_service")}</h1>
          <p className="text-sm text-muted-foreground text-center">{t("terms_last_updated")}</p>

          {/* 1. 서비스 정의 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("terms_section1_title")}</h2>
            <p className="text-muted-foreground">{t("terms_section1_desc")}</p>
          </section>

          {/* 2. 회원가입 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("terms_section2_title")}</h2>
            <p className="text-muted-foreground">{t("terms_section2_desc")}</p>
          </section>

          {/* 3. 서비스 제공 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("terms_section3_title")}</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>{t("terms_service1")}</li>
              <li>{t("terms_service2")}</li>
              <li>{t("terms_service3")}</li>
              <li>{t("terms_service4")}</li>
              <li>{t("terms_service5")}</li>
            </ul>
          </section>

          {/* 4. 사용자의 의무 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("terms_section4_title")}</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>{t("terms_obligation1")}</li>
              <li>{t("terms_obligation2")}</li>
              <li>{t("terms_obligation3")}</li>
            </ul>
          </section>

          {/* 5. 서비스 변경 및 공지 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("terms_section5_title")}</h2>
            <p className="text-muted-foreground">{t("terms_section5_desc")}</p>
          </section>

          {/* 고객 지원 - 설정 섹션 참조 안내 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("customer_support")}</h2>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-muted-foreground">{t("support_email")}: lee381111@gmail.com</p>
              <p className="text-sm text-muted-foreground">{t("customer_support_description")}</p>
            </div>
          </section>
        </Card>
      </div>
    </div>
  )
}
