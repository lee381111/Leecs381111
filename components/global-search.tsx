"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, BookOpen, Clock, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/language-context"

type SearchResult = {
  id: string
  type: "note" | "diary" | "schedule"
  title: string
  content: string
  date: string
  tags?: string[]
}

type GlobalSearchProps = {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSelectNote: (noteId: string) => void
  onSelectDiary: (diaryId: string) => void
  onSelectSchedule: (scheduleId: string) => void
}

export function GlobalSearch({
  isOpen,
  onClose,
  userId,
  onSelectNote,
  onSelectDiary,
  onSelectSchedule,
}: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { t, language } = useLanguage()

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim() && userId) {
        performSearch(searchQuery.trim())
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery, userId])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    const supabase = createClient()
    const searchResults: SearchResult[] = []

    try {
      // Search notes
      const { data: notesData } = await supabase
        .from("notes")
        .select("id, title, content, created_at, tags")
        .eq("user_id", userId)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(10)

      if (notesData) {
        notesData.forEach((note) => {
          searchResults.push({
            id: note.id,
            type: "note",
            title: note.title,
            content: note.content.substring(0, 100),
            date: new Date(note.created_at).toLocaleDateString(),
            tags: note.tags,
          })
        })
      }

      // Search diaries
      const { data: diariesData } = await supabase
        .from("diaries")
        .select("id, date, content")
        .eq("user_id", userId)
        .ilike("content", `%${query}%`)
        .limit(10)

      if (diariesData) {
        diariesData.forEach((diary) => {
          searchResults.push({
            id: diary.id,
            type: "diary",
            title: `일기 - ${new Date(diary.date).toLocaleDateString()}`,
            content: diary.content.substring(0, 100),
            date: new Date(diary.date).toLocaleDateString(),
          })
        })
      }

      // Search schedules
      const { data: schedulesData } = await supabase
        .from("schedules")
        .select("id, title, date, time")
        .eq("user_id", userId)
        .ilike("title", `%${query}%`)
        .limit(10)

      if (schedulesData) {
        schedulesData.forEach((schedule) => {
          searchResults.push({
            id: schedule.id,
            type: "schedule",
            title: schedule.title,
            content: `${schedule.time}`,
            date: new Date(schedule.date).toLocaleDateString(),
          })
        })
      }

      setResults(searchResults)
    } catch (error) {
      console.error("[v0] Global search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectResult = (result: SearchResult) => {
    switch (result.type) {
      case "note":
        onSelectNote(result.id)
        break
      case "diary":
        onSelectDiary(result.id)
        break
      case "schedule":
        onSelectSchedule(result.id)
        break
    }
    onClose()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileText className="h-4 w-4" />
      case "diary":
        return <BookOpen className="h-4 w-4" />
      case "schedule":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      note: { ko: "노트", en: "Note", zh: "笔记", ja: "ノート" },
      diary: { ko: "일기", en: "Diary", zh: "日记", ja: "日記" },
      schedule: { ko: "일정", en: "Schedule", zh: "日程", ja: "スケジュール" },
    }
    return labels[type as keyof typeof labels]?.[language] || type
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t("globalSearch") || "전체 검색"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchAllSections") || "노트, 일기, 일정 검색..."}
              className="pl-9"
              autoFocus
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isSearching && searchQuery && results.length === 0 && (
              <p className="text-center text-muted-foreground py-8">{t("noSearchResults") || "검색 결과가 없습니다"}</p>
            )}

            {!isSearching && results.length > 0 && (
              <div className="space-y-2">
                {results.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleSelectResult(result)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(result.type)}
                          <Badge variant="secondary" className="text-xs">
                            {getTypeLabel(result.type)}
                          </Badge>
                        </div>
                        <h4 className="font-semibold truncate">{result.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{result.content}</p>
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{result.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
