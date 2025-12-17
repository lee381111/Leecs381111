"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TermsOfServiceDialog({
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
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{getTranslation(language, "terms_of_service")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">{getTranslation(language, "terms_last_updated")}</p>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "terms_section1_title")}</h3>
              <p>{getTranslation(language, "terms_section1_desc")}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "terms_section2_title")}</h3>
              <p>{getTranslation(language, "terms_section2_desc")}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "terms_section3_title")}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{getTranslation(language, "terms_service1")}</li>
                <li>{getTranslation(language, "terms_service2")}</li>
                <li>{getTranslation(language, "terms_service3")}</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800 space-y-2">
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                {getTranslation(language, "terms_disclaimer_title")}
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-2 text-red-700 dark:text-red-300">
                <li>{getTranslation(language, "terms_disclaimer1")}</li>
                <li>{getTranslation(language, "terms_disclaimer2")}</li>
                <li>{getTranslation(language, "terms_disclaimer3")}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "terms_section4_title")}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{getTranslation(language, "terms_obligation1")}</li>
                <li>{getTranslation(language, "terms_obligation2")}</li>
                <li>{getTranslation(language, "terms_obligation3")}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "terms_section5_title")}</h3>
              <p>{getTranslation(language, "terms_section5_desc")}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{getTranslation(language, "terms_section6_title")}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{getTranslation(language, "terms_termination1")}</li>
                <li>{getTranslation(language, "terms_termination2")}</li>
                <li>{getTranslation(language, "terms_termination3")}</li>
                <li>{getTranslation(language, "terms_termination4")}</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
