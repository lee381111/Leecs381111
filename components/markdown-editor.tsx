"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/language-context"
import ReactMarkdown from "react-markdown"

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="edit">{t("edit")}</TabsTrigger>
        <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
      </TabsList>
      <TabsContent value="edit">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={10}
          className="font-mono"
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-[200px] rounded-md border bg-muted/30 p-4">
          <ReactMarkdown
            className="prose prose-sm dark:prose-invert max-w-none"
            components={{
              input: ({ node, ...props }) => <input {...props} type="checkbox" className="mr-2" disabled={false} />,
            }}
          >
            {value || t("noteContent")}
          </ReactMarkdown>
        </div>
      </TabsContent>
    </Tabs>
  )
}
