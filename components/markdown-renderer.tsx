"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import type { JSX } from "react/jsx-runtime"

type MarkdownRendererProps = {
  content: string
  onChecklistChange?: (newContent: string) => void
  editable?: boolean
}

export function MarkdownRenderer({ content, onChecklistChange, editable = false }: MarkdownRendererProps) {
  const [renderedContent, setRenderedContent] = useState<JSX.Element[]>([])

  useEffect(() => {
    const lines = content.split("\n")
    const elements: JSX.Element[] = []
    let listItems: string[] = []
    let listType: "ul" | "ol" | null = null
    let listStartNumber = 1

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const ListTag = listType
        elements.push(
          <ListTag key={`list-${elements.length}`} className="my-2 ml-6 list-inside" start={listStartNumber}>
            {listItems.map((item, idx) => (
              <li key={idx} className="my-1">
                {parseInlineFormatting(item)}
              </li>
            ))}
          </ListTag>,
        )
        listItems = []
        listType = null
        listStartNumber = 1
      }
    }

    lines.forEach((line, index) => {
      // Checklist items
      if (line.match(/^- \[([ x])\] /)) {
        flushList()
        const checked = line.includes("[x]")
        const text = line.replace(/^- \[([ x])\] /, "")
        const lineIndex = index

        elements.push(
          <div key={`check-${index}`} className="my-2 flex items-start gap-2">
            <Checkbox
              checked={checked}
              onCheckedChange={(newChecked) => {
                if (editable && onChecklistChange) {
                  const newLines = content.split("\n")
                  newLines[lineIndex] = `- [${newChecked ? "x" : " "}] ${text}`
                  onChecklistChange(newLines.join("\n"))
                }
              }}
              disabled={!editable}
              className="mt-0.5"
            />
            <span className={checked ? "text-muted-foreground line-through" : ""}>{parseInlineFormatting(text)}</span>
          </div>,
        )
      }
      // Headings
      else if (line.startsWith("# ")) {
        flushList()
        elements.push(
          <h1 key={`h1-${index}`} className="mb-2 mt-4 text-2xl font-bold">
            {parseInlineFormatting(line.substring(2))}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        flushList()
        elements.push(
          <h2 key={`h2-${index}`} className="mb-2 mt-3 text-xl font-bold">
            {parseInlineFormatting(line.substring(3))}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        flushList()
        elements.push(
          <h3 key={`h3-${index}`} className="mb-2 mt-2 text-lg font-bold">
            {parseInlineFormatting(line.substring(4))}
          </h3>,
        )
      }
      // Bullet list
      else if (line.match(/^- /)) {
        if (listType !== "ul") {
          flushList()
          listType = "ul"
        }
        listItems.push(line.substring(2))
      }
      // Numbered list
      else if (line.match(/^\d+\. /)) {
        const match = line.match(/^(\d+)\. /)
        if (listType !== "ol") {
          flushList()
          listType = "ol"
          listStartNumber = match ? Number.parseInt(match[1]) : 1
        }
        listItems.push(line.replace(/^\d+\. /, ""))
      }
      // Code block
      else if (line.startsWith("```")) {
        flushList()
        elements.push(
          <code key={`code-${index}`} className="my-2 block rounded bg-muted p-2 font-mono text-sm">
            {line.substring(3)}
          </code>,
        )
      }
      // Regular paragraph
      else if (line.trim()) {
        flushList()
        elements.push(
          <p key={`p-${index}`} className="my-1">
            {parseInlineFormatting(line)}
          </p>,
        )
      }
      // Empty line
      else {
        flushList()
        elements.push(<br key={`br-${index}`} />)
      }
    })

    flushList()
    setRenderedContent(elements)
  }, [content, editable, onChecklistChange])

  const parseInlineFormatting = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    let key = 0

    // Bold: **text** or __text__
    const boldRegex = /(\*\*|__)(.*?)\1/g
    // Italic: *text* or _text_
    const italicRegex = /(\*|_)(.*?)\1/g
    // Strikethrough: ~~text~~
    const strikeRegex = /~~(.*?)~~/g
    // Inline code: `code`
    const codeRegex = /`([^`]+)`/g

    const allMatches: Array<{ index: number; length: number; type: string; content: string }> = []

    let match
    while ((match = boldRegex.exec(text)) !== null) {
      allMatches.push({ index: match.index, length: match[0].length, type: "bold", content: match[2] })
    }
    while ((match = italicRegex.exec(text)) !== null) {
      if (!text.substring(match.index, match.index + match[0].length).match(/\*\*|__/)) {
        allMatches.push({ index: match.index, length: match[0].length, type: "italic", content: match[2] })
      }
    }
    while ((match = strikeRegex.exec(text)) !== null) {
      allMatches.push({ index: match.index, length: match[0].length, type: "strike", content: match[1] })
    }
    while ((match = codeRegex.exec(text)) !== null) {
      allMatches.push({ index: match.index, length: match[0].length, type: "code", content: match[1] })
    }

    allMatches.sort((a, b) => a.index - b.index)

    allMatches.forEach((m) => {
      if (m.index > currentIndex) {
        parts.push(text.substring(currentIndex, m.index))
      }

      switch (m.type) {
        case "bold":
          parts.push(
            <strong key={`bold-${key++}`} className="font-bold">
              {m.content}
            </strong>,
          )
          break
        case "italic":
          parts.push(
            <em key={`italic-${key++}`} className="italic">
              {m.content}
            </em>,
          )
          break
        case "strike":
          parts.push(
            <span key={`strike-${key++}`} className="line-through">
              {m.content}
            </span>,
          )
          break
        case "code":
          parts.push(
            <code key={`code-${key++}`} className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
              {m.content}
            </code>,
          )
          break
      }

      currentIndex = m.index + m.length
    })

    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex))
    }

    return parts.length > 0 ? parts : text
  }

  return <div className="prose prose-sm dark:prose-invert max-w-none">{renderedContent}</div>
}
