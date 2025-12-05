"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Search, Trash2, Edit2, Save, Tag, Eye, Share2, FileText } from "lucide-react"
import { saveNotes, loadNotes } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import { getTranslation } from "@/lib/i18n"
import type { Note, Language, Attachment } from "@/lib/types"
import { MediaTools } from "@/components/media-tools"
import { Spinner } from "@/components/ui/spinner"

interface NotesSectionProps {
  onBack: () => void
  language: Language
}

export function NotesSection({ onBack, language }: NotesSectionProps) {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [isAdding, setIsAdding] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({ title: "", content: "", tags: "" })
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null)
  const [viewingAttachment, setViewingAttachment] = useState<{ url: string; name: string } | null>(null)
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())
  const [isOrganizing, setIsOrganizing] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)

  const t = (key: string) => getTranslation(language, key)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const data = await loadNotes(user.id)
      setNotes(data)
    } catch (err) {
      console.error("[v0] Error loading notes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert(t("title_required"))
      return
    }

    if (!user?.id) {
      alert(language === "ko" ? "로그인이 필요합니다" : "Login required")
      return
    }

    try {
      setSaving(true)

      const note: Note = {
        id: editingNote?.id || crypto.randomUUID(),
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        attachments: attachments.map((att) => ({
          ...att,
          url: att.url || att.data,
          data: att.data || att.url,
        })),
        createdAt: editingNote?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user_id: user?.id,
      }

      console.log("[v0] Saving note with", note.attachments?.length || 0, "attachments")

      const updated = editingNote ? notes.map((n) => (n.id === editingNote.id ? note : n)) : [note, ...notes]

      setNotes(updated)

      // Save to database
      await saveNotes(updated, user.id)

      setFormData({ title: "", content: "", tags: "" })
      setAttachments([])
      setIsAdding(false)
      setEditingNote(null)

      alert(
        language === "ko"
          ? `저장 완료! (첨부파일 ${note.attachments?.length || 0}개)`
          : `Saved! (${note.attachments?.length || 0} attachments)`,
      )
    } catch (err: any) {
      console.error("[v0] Error saving note:", err)
      alert(
        language === "ko"
          ? `저장 실패: ${err?.message || "알 수 없는 오류"}. 인터넷 연결을 확인해주세요.`
          : `Save failed: ${err?.message || "Unknown error"}. Please check your internet connection.`,
      )
      // Revert UI change on error
      loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) {
      alert(language === "ko" ? "로그인이 필요합니다" : "Login required")
      return
    }

    if (!confirm(language === "ko" ? "정말 삭제하시겠습니까?" : "Are you sure you want to delete?")) {
      return
    }

    try {
      const updated = notes.filter((n) => n.id !== id)
      setNotes(updated)
      await saveNotes(updated, user.id)
      alert(language === "ko" ? "삭제되었습니다" : "Deleted")
    } catch (err) {
      console.error("[v0] Delete failed:", err)
      alert(language === "ko" ? "삭제 실패" : "Delete failed")
      loadData() // Reload on error
    }
  }

  const handleEdit = (note: Note) => {
    console.log("[v0] Editing note with attachments:", note.attachments?.length || 0)
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
    })
    const loadedAttachments = (note.attachments || []).map((att) => ({
      ...att,
      url: att.url || att.data,
      data: att.data || att.url,
      type: att.type || "image",
      name: att.name || "attachment",
    }))
    console.log("[v0] Loaded attachments for editing:", loadedAttachments.length)
    setAttachments(loadedAttachments)
    setIsAdding(true)
  }

  const handleOrganizeMeeting = async () => {
    if (!formData.content.trim()) {
      alert(t("content_required_for_organize"))
      return
    }

    const confirmed = confirm(t("confirm_organize_meeting"))
    if (!confirmed) return

    try {
      setIsOrganizing(true)
      console.log("[v0] Organizing meeting minutes...")

      const response = await fetch("/api/organize-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.content,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to organize meeting")
      }

      const { organizedContent } = await response.json()

      setFormData({
        ...formData,
        content: organizedContent,
      })

      alert(t("meeting_organized_success"))
    } catch (error) {
      console.error("[v0] Error organizing meeting:", error)
      alert(t("meeting_organize_failed"))
    } finally {
      setIsOrganizing(false)
    }
  }

  const handleSummarizeNote = async () => {
    if (!formData.content.trim()) {
      alert(t("content_required_for_summary"))
      return
    }

    try {
      setIsSummarizing(true)
      console.log("[v0] Summarizing note...")

      const response = await fetch("/api/summarize-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.content,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to summarize note")
      }

      const { summary } = await response.json()

      setFormData({
        ...formData,
        content: summary,
      })

      alert(t("note_summarized_success"))
    } catch (error) {
      console.error("[v0] Error summarizing note:", error)
      alert(t("note_summary_failed"))
    } finally {
      setIsSummarizing(false)
    }
  }

  const searchImageOnBing = (imageUrl: string) => {
    const bingSearchUrl = `https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIHMP&sbisrc=UrlPaste&q=imgurl:${encodeURIComponent(imageUrl)}`
    window.open(bingSearchUrl, "_blank")
  }

  const handleTextFromSpeech = (text: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content ? `${prev.content}\n${text}` : text,
    }))
    console.log("[v0] Added text from speech:", text.length, "characters")
  }

  const handleShare = async (note: Note) => {
    const shareText = `${note.title}\n\n${note.content}\n\n${note.tags.length > 0 ? `#${note.tags.join(" #")}` : ""}`
    const shareData = {
      title: note.title,
      text: shareText,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        console.log("[v0] Note shared successfully")
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("[v0] Share failed:", err)
          fallbackCopyToClipboard(shareText)
        }
      }
    } else {
      console.log("[v0] Web Share API not supported, using clipboard fallback")
      fallbackCopyToClipboard(shareText)
    }
  }

  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(language === "ko" ? "클립보드에 복사되었습니다!" : "Copied to clipboard!")
      })
      .catch((err) => {
        console.error("[v0] Clipboard copy failed:", err)
        alert(language === "ko" ? "복사 실패" : "Copy failed")
      })
  }

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags))).sort()

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || note.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 mx-auto" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (isAdding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setIsAdding(false)
            setEditingNote(null)
            setFormData({ title: "", content: "", tags: "" })
            setAttachments([])
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("title")}
        </Button>
        <div className="space-y-4">
          <Input
            placeholder={t("title_label")}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            placeholder={t("content")}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
          />

          <Button
            onClick={handleOrganizeMeeting}
            disabled={isOrganizing || !formData.content.trim()}
            variant="outline"
            className="w-full bg-transparent"
          >
            {isOrganizing ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                {t("organizing_meeting")}
              </>
            ) : (
              <>
                <Tag className="mr-2 h-4 w-4" />
                {t("organize_meeting_minutes")}
              </>
            )}
          </Button>

          <Button
            onClick={handleSummarizeNote}
            disabled={isSummarizing || !formData.content.trim()}
            variant="outline"
            className="w-full bg-transparent"
          >
            {isSummarizing ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                {t("summarizing_note")}
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                {t("summarize_note")}
              </>
            )}
          </Button>

          <Input
            placeholder={t("tags_placeholder")}
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
          <MediaTools
            language={language}
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            onTextFromSpeech={handleTextFromSpeech}
          />

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">
                {language === "ko" ? "첨부된 파일" : "Attached Files"} ({attachments.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {attachments.map((file, idx) => {
                  const isImage =
                    file.type?.startsWith("image/") ||
                    file.type === "image" ||
                    file.type === "drawing" ||
                    file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                  const mediaUrl = file.url || file.data

                  return (
                    <div key={idx} className="relative border rounded overflow-hidden bg-card dark:bg-card">
                      {isImage && (
                        <img
                          src={mediaUrl || "/placeholder.svg"}
                          alt={file.name || `첨부 ${idx + 1}`}
                          className="w-full h-24 object-cover cursor-pointer hover:opacity-80 transition"
                          onClick={() => setViewingAttachment({ url: mediaUrl, name: file.name || `첨부 ${idx + 1}` })}
                        />
                      )}
                      {!isImage && (
                        <div className="flex items-center justify-center h-24 bg-gray-200">
                          <p className="text-xs text-gray-600 truncate px-2">{file.name || "파일"}</p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const newAttachments = attachments.filter((_, i) => i !== idx)
                          console.log("[v0] Removing attachment, remaining:", newAttachments.length)
                          setAttachments(newAttachments)
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <Button onClick={handleSave} disabled={saving} className="w-full bg-green-600 hover:bg-green-700" size="lg">
            <Save className="mr-2 h-4 w-4" />
            {saving ? (language === "ko" ? "저장 중..." : "Saving...") : editingNote ? t("edit") : t("save")}
          </Button>
        </div>

        {viewingAttachment && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setViewingAttachment(null)}
          >
            <div className="relative max-w-4xl max-h-screen">
              <img
                src={viewingAttachment.url || "/placeholder.svg"}
                alt={viewingAttachment.name}
                className="max-w-full max-h-screen object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                onClick={() => setViewingAttachment(null)}
              >
                <Tag className="h-6 w-6 rotate-45" />
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("title")}
        </Button>
        <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> {t("add")} {t("notes")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {allTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("filter_by_tag")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={selectedTag === "" ? "default" : "outline"} size="sm" onClick={() => setSelectedTag("")}>
              {t("all")}
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Card
            className="w-full max-w-md p-6 space-y-4 bg-white dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{language === "ko" ? "이미지 옵션" : "Image Options"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedImage(null)}>
                <Tag className="h-4 w-4 rotate-45" />
              </Button>
            </div>
            <img
              src={selectedImage.url || "/placeholder.svg"}
              alt={selectedImage.name}
              className="w-full rounded border"
            />
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  window.open(selectedImage.url, "_blank")
                  setSelectedImage(null)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                {language === "ko" ? "새 창에서 보기" : "Open in new tab"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  searchImageOnBing(selectedImage.url)
                  setSelectedImage(null)
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                {language === "ko" ? "Bing으로 이미지 검색" : "Search with Bing"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="grid gap-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold flex-1">{note.title}</h3>
                <div className="flex gap-2 ml-2">
                  <Button variant="ghost" size="icon" onClick={() => handleShare(note)}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(note)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="w-full">
                <p className="text-sm text-muted-foreground">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {note.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-primary/10 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {note.attachments && note.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">
                      {language === "ko" ? "첨부파일" : "Attachments"} ({note.attachments.length}개)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {note.attachments.map((file: any, idx: number) => {
                        const isImage =
                          file.type?.startsWith("image/") ||
                          file.type === "image" ||
                          file.type === "drawing" ||
                          file.name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
                        const isVideo =
                          file.type?.startsWith("video/") ||
                          file.type === "video" ||
                          file.name?.match(/\.(mp4|webm|mov|avi)$/i)
                        const isAudio =
                          file.type?.startsWith("audio/") ||
                          file.type === "audio" ||
                          file.name?.match(/\.(mp3|wav|ogg|m4a)$/i)
                        const mediaUrl = file.url || file.data
                        const imageErrorKey = `${note.id}-${idx}`
                        const hasError = imageLoadErrors.has(imageErrorKey)

                        return (
                          <div key={idx} className="border rounded overflow-hidden bg-muted dark:bg-muted">
                            {isImage && !hasError && (
                              <img
                                src={mediaUrl || "/placeholder.svg"}
                                alt={file.name || `첨부파일 ${idx + 1}`}
                                className="w-full h-auto min-h-[128px] max-h-[300px] object-cover cursor-pointer hover:opacity-90"
                                onClick={() =>
                                  setSelectedImage({ url: mediaUrl, name: file.name || `첨부파일 ${idx + 1}` })
                                }
                                onError={(e) => {
                                  console.log("[v0] Image load failed for:", file.name || `attachment ${idx}`)
                                  setImageLoadErrors((prev) => new Set(prev).add(imageErrorKey))
                                }}
                              />
                            )}
                            {isImage && hasError && (
                              <div className="flex flex-col items-center justify-center h-32 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 p-2">
                                <p className="text-xs text-center">
                                  {language === "ko" ? "이미지를 불러올 수 없습니다" : "Cannot load image"}
                                </p>
                                <p className="text-xs text-center mt-1 truncate w-full">{file.name}</p>
                              </div>
                            )}
                            {isVideo && (
                              <div className="relative bg-black">
                                <video
                                  src={mediaUrl}
                                  controls
                                  controlsList="nodownload"
                                  preload="metadata"
                                  playsInline
                                  className="w-full h-auto min-h-[128px] max-h-[300px]"
                                  style={{ display: "block" }}
                                  onError={(e) => {
                                    console.log("[v0] Video load failed:", file.name || `video ${idx}`)
                                  }}
                                >
                                  {language === "ko" ? "영상을 재생할 수 없습니다" : "Cannot play video"}
                                </video>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                                  <p className="text-xs text-white truncate">
                                    {file.name || `${language === "ko" ? "동영상" : "Video"} ${idx + 1}`}
                                  </p>
                                </div>
                              </div>
                            )}
                            {isAudio && (
                              <div className="flex items-center justify-center h-20 bg-gray-100 dark:bg-gray-800 p-2">
                                <audio
                                  src={mediaUrl}
                                  controls
                                  preload="metadata"
                                  className="w-full"
                                  onError={(e) => {
                                    console.log("[v0] Audio load failed:", file.name || `audio ${idx}`)
                                  }}
                                />
                              </div>
                            )}
                            {!isImage && !isVideo && !isAudio && (
                              <div className="flex items-center justify-center h-20 bg-gray-200 dark:bg-gray-800 p-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400 text-center truncate">
                                  {file.name || `첨부파일 ${idx + 1}`}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery || selectedTag
              ? language === "ko"
                ? "검색 결과가 없습니다"
                : "No results found"
              : language === "ko"
                ? "노트가 없습니다. 새로 만들어보세요!"
                : "No notes. Create one!"}
          </div>
        )}
      </div>
    </div>
  )
}
