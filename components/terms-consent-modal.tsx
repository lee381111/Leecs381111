"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/i18n"
import { saveUserConsent } from "@/lib/storage"
import { AlertCircle } from "lucide-react"

interface TermsConsentModalProps {
  userId: string
  userEmail: string
  onConsent: () => void
  onDecline: () => void
}

export function TermsConsentModal({ userId, userEmail, onConsent, onDecline }: TermsConsentModalProps) {
  const { language } = useLanguage()
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAgree = async () => {
    if (!agreeTerms || !agreePrivacy) {
      return
    }

    setIsSubmitting(true)
    try {
      await saveUserConsent(
        userId,
        "v1.0_2025-12",
        "v1.0_2025-12",
        undefined,
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      )
      onConsent()
    } catch (error) {
      console.error("[v0] Failed to save consent:", error)
      alert(getTranslation(language, "error_occurred"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            {language === "ko"
              ? "약관 동의 필요"
              : language === "en"
                ? "Terms Consent Required"
                : language === "zh"
                  ? "需要同意条款"
                  : "利用規約への同意が必要"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {language === "ko"
              ? "서비스 이용을 위해 약관 동의가 필요합니다. 동의하지 않으면 로그아웃됩니다."
              : language === "en"
                ? "Terms consent is required to use the service. You will be logged out if you decline."
                : language === "zh"
                  ? "使用服务需要同意条款。如果您拒绝，您将被注销。"
                  : "サービスを利用するには利用規約への同意が必要です。拒否するとログアウトされます。"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-4 py-4">
            <Card className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                    {language === "ko"
                      ? "(필수) 이용약관에 동의합니다"
                      : language === "en"
                        ? "(Required) I agree to the Terms of Service"
                        : language === "zh"
                          ? "(必需) 我同意服务条款"
                          : "(必須) 利用規約に同意します"}
                  </label>
                  <a
                    href={`/terms-of-service?lang=${language}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline ml-1"
                  >
                    {language === "ko"
                      ? "전문보기"
                      : language === "en"
                        ? "View full text"
                        : language === "zh"
                          ? "查看全文"
                          : "全文を見る"}
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={agreePrivacy}
                  onCheckedChange={(checked) => setAgreePrivacy(checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                    {language === "ko"
                      ? "(필수) 개인정보처리방침에 동의합니다"
                      : language === "en"
                        ? "(Required) I agree to the Privacy Policy"
                        : language === "zh"
                          ? "(必需) 我同意隐私政策"
                          : "(必須) 個人情報保護方針に同意します"}
                  </label>
                  <a
                    href={`/privacy-policy?lang=${language}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline ml-1"
                  >
                    {language === "ko"
                      ? "전문보기"
                      : language === "en"
                        ? "View full text"
                        : language === "zh"
                          ? "查看全文"
                          : "全文を見る"}
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex gap-3 p-6 pt-0 border-t">
          <Button variant="outline" onClick={onDecline} disabled={isSubmitting} className="flex-1 bg-transparent">
            {language === "ko"
              ? "동의하지 않음 (로그아웃)"
              : language === "en"
                ? "Decline (Logout)"
                : language === "zh"
                  ? "不同意（注销）"
                  : "同意しない（ログアウト）"}
          </Button>
          <Button
            onClick={handleAgree}
            disabled={!agreeTerms || !agreePrivacy || isSubmitting}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting
              ? language === "ko"
                ? "처리 중..."
                : language === "en"
                  ? "Processing..."
                  : language === "zh"
                    ? "处理中..."
                    : "処理中..."
              : language === "ko"
                ? "동의하고 계속하기"
                : language === "en"
                  ? "Agree and Continue"
                  : language === "zh"
                    ? "同意并继续"
                    : "同意して続ける"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
