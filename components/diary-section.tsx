"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Trash2,
  Paperclip,
  Mic,
  Lock,
  Unlock,
  X,
  ImageIcon,
  Pencil,
  PenTool,
  ArrowUpDown,
  Loader2,
} from "lucide-react"
import type { DiaryEntry } from "./personal-organizer-app"
import { useLanguage } from "@/lib/language-context"
import { AttachmentList } from "./attachment-list"
import { HandwritingCanvas } from "./handwriting-canvas"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { saveDiary, updateDiary, deleteDiary } from "@/app/actions/diary-actions"

type UploadedFile = {
  name: string
  url: string
  type: string
}

type DiarySectionProps = {
  diaries: DiaryEntry[]
  setDiaries: (diaries: DiaryEntry[]) => void
  userId?: string
}

const weatherEmojis = ["☀️", "⛅", "☁️", "🌧️", "⛈️", "🌨️", "🌫️"]
const moodEmojis = ["😊", "😃", "😢", "😡", "😴", "🤔", "😍", "😰", "🤗", "😎"]

export function DiarySection({ diaries, setDiaries, userId }: DiarySectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null)
  const [unlockedDiaries, setUnlockedDiaries] = useState<Set<string>>(new Set())
  const [passwordInput, setPasswordInput] = useState("")
  const [newDiary, setNewDiary] = useState({
    content: "",
    weatherEmoji: "☀️",
    moodEmoji: "😊",
    isLocked: true,
    password: "",
  })
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<UploadedFile[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isHandwritingOpen, setIsHandwritingOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoadedData, setHasLoadedData] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    if (!userId || hasLoadedData) return

    const fetchDiaries = async () => {
      setIsLoading(true)
      try {
        console.log("[v0] Fetching diaries for user:", userId)
        const { data, error } = await supabase
          .from("diaries")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .limit(50) // Limit to 50 most recent diaries for faster loading

        if (error) {
          console.error("[v0] Error fetching diaries:", error)
          throw error
        }

        if (data) {
          console.log("[v0] Fetched diaries:", data.length)
          const formattedDiaries = data.map((d: any) => ({
            ...d,
            date: new Date(d.date),
          }))
          setDiaries(formattedDiaries)
          setHasLoadedData(true)
        }
      } catch (error) {
        console.error("[v0] Error fetching diaries:", error)
        toast({
          title: "오류",
          description: "일기를 불러오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiaries()
  }, [userId, hasLoadedData])

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachedFiles([...attachedFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      const messages = {
        ko: "음성 인식이 지원되지 않는 브라우저입니다.",
        en: "Speech recognition is not supported in this browser.",
        zh: "此浏览器不支持语音识别。",
        ja: "このブラウザは音声認識をサポートしていません。",
      }
      toast({
        title: "오류",
        description: messages[language],
        variant: "destructive",
      })
      return
    }

    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    const langCodes = { ko: "ko-KR", en: "en-US", zh: "zh-CN", ja: "ja-JP" }
    recognition.lang = langCodes[language]

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setNewDiary({ ...newDiary, content: newDiary.content + " " + transcript })
    }

    recognition.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const convertFilesToDataUrls = async (files: File[]): Promise<UploadedFile[]> => {
    const results: UploadedFile[] = []

    for (const file of files) {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        results.push({
          name: file.name,
          url: dataUrl,
          type: file.type,
        })
      } catch (error) {
        console.error("[v0] Failed to process file:", file.name, error)
        toast({
          title: "파일 처리 실패",
          description: `${file.name} 처리 중 오류가 발생했습니다.`,
          variant: "destructive",
        })
      }
    }

    return results
  }

  const handleAddDiary = async () => {
    if (!userId) {
      console.error("[v0] No userId provided")
      toast({
        title: "오류",
        description: "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!newDiary.content.trim()) {
      toast({
        title: "오류",
        description: "일기 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (newDiary.isLocked && !newDiary.password) {
      toast({
        title: "오류",
        description: "비밀번호를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    console.log("[v0] Starting diary save process...")

    try {
      // Process files if any
      let uploadedFiles: UploadedFile[] = []
      if (attachedFiles.length > 0) {
        console.log("[v0] Processing", attachedFiles.length, "attached files...")
        toast({
          title: "파일 처리 중",
          description: `${attachedFiles.length}개의 파일을 처리하고 있습니다...`,
        })
        uploadedFiles = await convertFilesToDataUrls(attachedFiles)
        console.log("[v0] Processed files:", uploadedFiles.length)
      }

      // Save using server action
      const result = await saveDiary({
        content: newDiary.content,
        weather_emoji: newDiary.weatherEmoji,
        mood_emoji: newDiary.moodEmoji,
        password: newDiary.isLocked ? newDiary.password : null,
        user_id: userId,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : null,
      })

      if (!result.success) {
        console.error("[v0] Server action failed:", result.error)
        toast({
          title: "저장 실패",
          description: result.error || "알 수 없는 오류",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Diary saved successfully:", result.data.id)
      // Add to local state
      const diary: DiaryEntry = {
        ...result.data,
        date: new Date(result.data.date),
        weatherEmoji: result.data.weather_emoji,
        moodEmoji: result.data.mood_emoji,
        isLocked: !!result.data.password,
        attachments: result.data.attachments,
      }
      setDiaries([diary, ...diaries])
      setNewDiary({ content: "", weatherEmoji: "☀️", moodEmoji: "😊", isLocked: true, password: "" })
      setAttachedFiles([])
      setIsAdding(false)

      toast({
        title: "성공",
        description: "일기가 저장되었습니다.",
      })
    } catch (error) {
      console.error("[v0] Error adding diary:", error)
      const errorMsg = error instanceof Error ? error.message : "알 수 없는 오류"
      toast({
        title: "오류",
        description: `일기 저장 중 오류가 발생했습니다: ${errorMsg}`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      console.log("[v0] Diary save process completed")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteDiary(id)

      if (!result.success) {
        console.error("[v0] Server action failed:", result.error)
        toast({
          title: "오류",
          description: result.error || "삭제 실패",
          variant: "destructive",
        })
        return
      }

      setDiaries(diaries.filter((d) => d.id !== id))
      if (selectedDiary?.id === id) {
        setSelectedDiary(null)
      }

      toast({
        title: "성공",
        description: "일기가 삭제되었습니다.",
      })
    } catch (error) {
      console.error("[v0] Error deleting diary:", error)
      toast({
        title: "오류",
        description: "일기 삭제에 실패했습니다",
        variant: "destructive",
      })
    }
  }

  const handleUnlock = (diary: DiaryEntry) => {
    if (passwordInput === diary.password) {
      setUnlockedDiaries(new Set([...unlockedDiaries, diary.id]))
      setSelectedDiary(diary)
      setPasswordInput("")
    } else {
      const messages = {
        ko: "비밀번호가 틀렸습니다",
        en: "Incorrect password",
        zh: "密码错误",
        ja: "パスワードが間違っています",
      }
      toast({
        title: "오류",
        description: messages[language],
        variant: "destructive",
      })
    }
  }

  const handleLock = (diary: DiaryEntry) => {
    const newUnlockedDiaries = new Set(unlockedDiaries)
    newUnlockedDiaries.delete(diary.id)
    setUnlockedDiaries(newUnlockedDiaries)
    if (selectedDiary?.id === diary.id) {
      setSelectedDiary(null)
    }
  }

  const handleEdit = (diary: DiaryEntry) => {
    setEditingId(diary.id)
    setNewDiary({
      content: diary.content,
      weatherEmoji: diary.weatherEmoji,
      moodEmoji: diary.moodEmoji,
      isLocked: diary.isLocked,
      password: diary.password || "",
    })
    setExistingAttachments((diary.attachments as UploadedFile[]) || [])
    setAttachedFiles([])
    setIsAdding(true)
    setSelectedDiary(null)
  }

  const handleUpdate = async () => {
    if (!editingId || !newDiary.content || !userId) return

    setIsSaving(true)

    try {
      let uploadedFiles: UploadedFile[] = [...existingAttachments]
      if (attachedFiles.length > 0) {
        toast({
          title: "파일 처리 중",
          description: "첨부파일을 처리하고 있습니다...",
        })
        const newFiles = await convertFilesToDataUrls(attachedFiles)
        uploadedFiles = [...existingAttachments, ...newFiles]
      }

      const result = await updateDiary(editingId, {
        content: newDiary.content,
        weather_emoji: newDiary.weatherEmoji,
        mood_emoji: newDiary.moodEmoji,
        password: newDiary.isLocked ? newDiary.password : null,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : null,
      })

      if (!result.success) {
        console.error("[v0] Server action failed:", result.error)
        toast({
          title: "수정 실패",
          description: result.error || "알 수 없는 오류",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Diary updated successfully:", result.data.id)
      const updatedDiary: DiaryEntry = {
        id: editingId,
        date: diaries.find((d) => d.id === editingId)?.date || new Date(),
        content: newDiary.content,
        weatherEmoji: newDiary.weatherEmoji,
        moodEmoji: newDiary.moodEmoji,
        isLocked: !!newDiary.password,
        password: newDiary.password,
        user_id: userId || null,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      }

      setDiaries(diaries.map((d) => (d.id === editingId ? updatedDiary : d)))
      setNewDiary({ content: "", weatherEmoji: "☀️", moodEmoji: "😊", isLocked: true, password: "" })
      setAttachedFiles([])
      setExistingAttachments([])
      setEditingId(null)
      setIsAdding(false)

      toast({
        title: "성공",
        description: "일기가 수정되었습니다.",
      })
    } catch (error) {
      console.error("[v0] Error updating diary:", error)
      const errorMsg = error instanceof Error ? error.message : "알 수 없는 오류"
      toast({
        title: "오류",
        description: `일기 수정 중 오류가 발생했습니다: ${errorMsg}`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setNewDiary({ content: "", weatherEmoji: "☀️", moodEmoji: "😊", isLocked: true, password: "" })
    setAttachedFiles([])
    setExistingAttachments([])
  }

  const handleHandwritingSave = async (imageBlob: Blob) => {
    const file = new File([imageBlob], `handwriting-${Date.now()}.png`, { type: "image/png" })
    setAttachedFiles([...attachedFiles, file])
  }

  const handleRemoveExistingAttachment = (index: number) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index))
  }

  const isDiaryUnlocked = (diary: DiaryEntry) => {
    return !diary.isLocked || unlockedDiaries.has(diary.id)
  }

  const sortedDiaries = [...diaries].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.date.getTime() - a.date.getTime()
    } else {
      return a.date.getTime() - b.date.getTime()
    }
  })

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("diaryTitle")}</h2>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("addDiary")}
        </Button>
      </div>

      {isAdding && (
        <div className="mb-6 space-y-4 rounded-lg border bg-muted/50 p-4">
          <h3 className="font-medium">{editingId ? t("editDiary") : t("addDiary")}</h3>
          <div className="space-y-2">
            <Label>{t("selectWeather")}</Label>
            <div className="flex flex-wrap gap-2">
              {weatherEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant={newDiary.weatherEmoji === emoji ? "default" : "outline"}
                  size="sm"
                  className="text-2xl"
                  onClick={() => setNewDiary({ ...newDiary, weatherEmoji: emoji })}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("selectMood")}</Label>
            <div className="flex flex-wrap gap-2">
              {moodEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant={newDiary.moodEmoji === emoji ? "default" : "outline"}
                  size="sm"
                  className="text-2xl"
                  onClick={() => setNewDiary({ ...newDiary, moodEmoji: emoji })}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diary-content">{t("diaryContent")}</Label>
            <Textarea
              id="diary-content"
              value={newDiary.content}
              onChange={(e) => setNewDiary({ ...newDiary, content: e.target.value })}
              placeholder={t("diaryContent")}
              rows={6}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="lock-diary"
              checked={newDiary.isLocked}
              onCheckedChange={(checked) => setNewDiary({ ...newDiary, isLocked: checked })}
            />
            <Label htmlFor="lock-diary">{t("passwordLock")}</Label>
          </div>
          {newDiary.isLocked && (
            <div className="space-y-2">
              <Label htmlFor="diary-password">{t("password")}</Label>
              <Input
                id="diary-password"
                type="password"
                value={newDiary.password}
                onChange={(e) => setNewDiary({ ...newDiary, password: e.target.value })}
                placeholder={t("password")}
              />
            </div>
          )}
          {existingAttachments.length > 0 && (
            <div className="space-y-2">
              <Label>{t("existingAttachments")}</Label>
              <div className="flex flex-wrap gap-2">
                {existingAttachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => handleRemoveExistingAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>{t("attachedFiles")}</Label>
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => handleRemoveFile(index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileAttach}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
              <Paperclip className="mr-2 h-4 w-4" />
              {t("attachFile")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsHandwritingOpen(true)} disabled={isSaving}>
              <PenTool className="mr-2 h-4 w-4" />
              {t("handwriting")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceInput}
              disabled={isSaving}
              className={isRecording ? "bg-red-500 text-white hover:bg-red-600" : ""}
            >
              <Mic className="mr-2 h-4 w-4" />
              {isRecording ? t("recording") : t("voiceInput")}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={editingId ? handleUpdate : handleAddDiary} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? t("edit") : t("save")}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{t("diaryList")}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="text-xs">{sortOrder === "newest" ? t("sortNewest") : t("sortOldest")}</span>
          </Button>
        </div>
        {sortedDiaries.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("noDiaries")}</p>
        ) : (
          sortedDiaries.map((diary) => (
            <div key={diary.id}>
              {/* Diary entry card */}
              <div
                className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                  selectedDiary?.id === diary.id ? "border-primary bg-muted/50" : ""
                }`}
                onClick={() => {
                  setSelectedDiary(selectedDiary?.id === diary.id ? null : diary)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{diary.weatherEmoji}</span>
                      <span className="text-xl">{diary.moodEmoji}</span>
                      {diary.isLocked && !unlockedDiaries.has(diary.id) && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                      {diary.isLocked && unlockedDiaries.has(diary.id) && <Unlock className="h-3 w-3 text-green-600" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{diary.date.toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(diary)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(diary.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {selectedDiary?.id === diary.id && (
                <div className="mt-2 rounded-lg border bg-muted/30 p-4">
                  {isDiaryUnlocked(selectedDiary) ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{selectedDiary.weatherEmoji}</span>
                          <span className="text-3xl">{selectedDiary.moodEmoji}</span>
                        </div>
                        {selectedDiary.isLocked && (
                          <Button variant="outline" size="sm" onClick={() => handleLock(selectedDiary)}>
                            <Lock className="mr-2 h-4 w-4" />
                            {t("lock")}
                          </Button>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{selectedDiary.content}</p>
                      {selectedDiary.attachments && selectedDiary.attachments.length > 0 && (
                        <div className="space-y-2">
                          <Label>{t("attachedFiles")}</Label>
                          <AttachmentList attachments={selectedDiary.attachments as UploadedFile[]} />
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {t("created")}: {selectedDiary.date.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        <h3 className="font-semibold">{t("locked")}</h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unlock-password">{t("password")}</Label>
                        <Input
                          id="unlock-password"
                          type="password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder={t("password")}
                        />
                      </div>
                      <Button onClick={() => handleUnlock(selectedDiary)}>{t("unlock")}</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <HandwritingCanvas
        isOpen={isHandwritingOpen}
        onClose={() => setIsHandwritingOpen(false)}
        onSave={handleHandwritingSave}
      />
    </div>
  )
}
