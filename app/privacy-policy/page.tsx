"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getTranslation, type Language } from "@/lib/i18n"

export default function PrivacyPolicyPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>("ko")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang) {
      setLanguage(savedLang)
    }

    // Listen for language changes
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("language") as Language
      if (newLang) {
        setLanguage(newLang)
      }
    }

    window.addEventListener("storage", handleLanguageChange)

    // Also listen for custom language change event
    window.addEventListener("languageChange", handleLanguageChange)

    return () => {
      window.removeEventListener("storage", handleLanguageChange)
      window.removeEventListener("languageChange", handleLanguageChange)
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
          <h1 className="text-3xl font-bold text-center">{t("privacy_policy")}</h1>
          <p className="text-sm text-muted-foreground text-center">{t("privacy_last_updated")}</p>

          {/* 1. 개인정보의 수집 및 이용 목적 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("privacy_section1_title")}</h2>
            <p className="text-muted-foreground">{t("privacy_section1_intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>{t("privacy_purpose1")}</li>
              <li>{t("privacy_purpose2")}</li>
              <li>{t("privacy_purpose3")}</li>
            </ul>
          </section>

          {/* 2. 수집하는 개인정보 항목 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("privacy_section2_title")}</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>{t("privacy_collected1")}</li>
              <li>{t("privacy_collected2")}</li>
            </ul>
          </section>

          {/* 3. 개인정보 저장 및 관리 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("privacy_section3_title")}</h2>
            <p className="text-muted-foreground">{t("privacy_storage_desc")}</p>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
              <p className="font-semibold text-blue-900 dark:text-blue-100">Supabase</p>
              <p className="text-sm text-muted-foreground">{t("privacy_supabase_desc")}</p>
            </div>
          </section>

          {/* 4. 개인정보의 보유 기간 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("privacy_section4_title")}</h2>
            <p className="text-muted-foreground">{t("privacy_retention_desc")}</p>
          </section>

          {/* 5. 사용자의 권리 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("privacy_section5_title")}</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>{t("privacy_right1")}</li>
              <li>{t("privacy_right2")}</li>
              <li>{t("privacy_right3")}</li>
            </ul>
          </section>

          {/* 6. 보호책임자 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("privacy_section6_title")}</h2>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold">{t("customer_support")}</p>
              <p className="text-muted-foreground">{t("support_email")}: lee381111@gmail.com</p>
            </div>
          </section>

          {/* 7. 서비스 종료 시 개인정보 처리 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("privacy_section7_title")}</h2>
            <p className="text-muted-foreground">{t("privacy_termination_desc")}</p>
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">{t("privacy_data_deletion")}</p>
            </div>
          </section>
        </Card>
      </div>
    </div>
  )
}
