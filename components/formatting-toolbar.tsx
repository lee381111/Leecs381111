"use client"

import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Code,
  Strikethrough,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type FormattingToolbarProps = {
  onFormat: (format: string) => void
}

export function FormattingToolbar({ onFormat }: FormattingToolbarProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-wrap gap-1 rounded-md border bg-muted/50 p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("bold")}
        title={t("bold") || "Bold"}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("italic")}
        title={t("italic") || "Italic"}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("strikethrough")}
        title={t("strikethrough") || "Strikethrough"}
        className="h-8 w-8 p-0"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <div className="mx-1 w-px bg-border" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("h1")}
        title={t("heading1") || "Heading 1"}
        className="h-8 w-8 p-0"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("h2")}
        title={t("heading2") || "Heading 2"}
        className="h-8 w-8 p-0"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("h3")}
        title={t("heading3") || "Heading 3"}
        className="h-8 w-8 p-0"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <div className="mx-1 w-px bg-border" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("bulletList")}
        title={t("bulletList") || "Bullet List"}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("numberedList")}
        title={t("numberedList") || "Numbered List"}
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("checklist")}
        title={t("checklist") || "Checklist"}
        className="h-8 w-8 p-0"
      >
        <CheckSquare className="h-4 w-4" />
      </Button>
      <div className="mx-1 w-px bg-border" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("code")}
        title={t("code") || "Code"}
        className="h-8 w-8 p-0"
      >
        <Code className="h-4 w-4" />
      </Button>
    </div>
  )
}
