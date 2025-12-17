"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PrivacyPolicyDialog({
  open,
  onOpenChange,
  language,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  language: Language
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle>{getTranslation(language, "privacy_policy")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">{getTranslation(language, "privacy_last_updated")}</p>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "privacy_section1_title")}</h3>
              <p className="mb-2">{getTranslation(language, "privacy_section1_intro")}</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{getTranslation(language, "privacy_purpose1")}</li>
                <li>{getTranslation(language, "privacy_purpose2")}</li>
                <li>{getTranslation(language, "privacy_purpose3")}</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {getTranslation(language, "privacy_sensitive_warning")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "privacy_section2_title")}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{getTranslation(language, "privacy_collected1")}</li>
                <li>{getTranslation(language, "privacy_collected2")}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "privacy_section3_title")}</h3>
              <p className="mb-2">{getTranslation(language, "privacy_storage_desc")}</p>
              <p>{getTranslation(language, "privacy_supabase_desc")}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "privacy_section4_title")}</h3>
              <p>{getTranslation(language, "privacy_retention_desc")}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "privacy_section5_title")}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{getTranslation(language, "privacy_right1")}</li>
                <li>{getTranslation(language, "privacy_right2")}</li>
                <li>{getTranslation(language, "privacy_right3")}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "privacy_section7_title")}</h3>
              <p className="mb-2">{getTranslation(language, "privacy_termination_desc")}</p>
              <p>{getTranslation(language, "privacy_data_deletion")}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
