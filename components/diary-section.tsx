"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Edit, Trash2, Lock, Unlock, X, Sparkles } from "lucide-react"
import { saveDiaries, loadDiaries } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import type { DiaryEntry, Attachment } from "@/lib/types"
import { MediaTools } from "@/components/media-tools"
import { Spinner } from "@/components/ui/spinner"
import { getTranslation } from "@/lib/i18n"

interface DiarySectionProps {
  onBack: () => void
  language: string
}

const moods = ["😊 좋음", "😐 보통", "😢 나쁨", "😍 최고", "😤 화남"]
const weathers = ["☀️ 맑음", "☁️ 흐림", "🌧️ 비", "⛈️ 폭우", "❄️ 눈"]

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function DiarySection({ onBack, language }: DiarySectionProps) {
  const { user } = useAuth()
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    content: "",
    mood: moods[0],
    weather: weathers[0],
    attachments: [] as Attachment[],
  })
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null)

  const [isLocked, setIsLocked] = useState(true)
  const [password, setPassword] = useState("")
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")

  const [emotionAnalysis, setEmotionAnalysis] = useState<{
    emotion: string
    score: number
    mainEmotions: string[]
    advice: string
  } | null>(null)
  const [analyzingEmotion, setAnalyzingEmotion] = useState(false)

  const t = (key: string) => getTranslation(language, key)

  useEffect(() => {
    const savedPasswordHash = localStorage.getItem("diary_password_hash")
    if (!savedPasswordHash) {
      setIsSettingPassword(true)
      setIsLocked(false)
    } else {
      setIsLocked(true)
    }
  }, [])

  useEffect(() => {
    if (!isLocked) {
      loadData()
    }
  }, [user, isLocked])

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const data = await loadDiaries(user.id)
      console.log("[v0] Loaded diaries:", data.length, "items")
      data.forEach((d, i) => {
        console.log(`[v0] Diary ${i}: ${d.attachments?.length || 0} attachments`)
      })
      setDiaries(data)
    } finally {
      setLoading(false)
    }
  }

  const handleSetPassword = async () => {
    if (!password || password.length < 4) {
      alert(t("password_too_short") || "비밀번호는 최소 4자 이상이어야 합니다")
      return
    }
    if (password !== confirmPassword) {
      alert(t("password_mismatch") || "비밀번호가 일치하지 않습니다")
      return
    }

    const hash = await hashPassword(password)
    localStorage.setItem("diary_password_hash", hash)
    setIsSettingPassword(false)
    setIsLocked(false)
    setPassword("")
    setConfirmPassword("")
    alert(t("password_set") || "일기 비밀번호가 설정되었습니다")
  }

  const handleUnlock = async () => {
    if (!password) {
      alert(t("enter_password") || "비밀번호를 입력하세요")
      return
    }

    const savedHash = localStorage.getItem("diary_password_hash")
    const inputHash = await hashPassword(password)

    if (inputHash === savedHash) {
      setIsLocked(false)
      setPassword("")
      alert(t("unlocked") || "잠금이 해제되었습니다")
    } else {
      alert(t("wrong_password") || "비밀번호가 틀렸습니다")
      setPassword("")
    }
  }

  const handleChangePassword = async () => {
    const savedHash = localStorage.getItem("diary_password_hash")
    const currentHash = await hashPassword(password)

    if (currentHash !== savedHash) {
      alert(t("wrong_password") || "현재 비밀번호가 틀렸습니다")
      return
    }

    if (!confirmPassword || confirmPassword.length < 4) {
      alert(t("password_too_short") || "새 비밀번호는 최소 4자 이상이어야 합니다")
      return
    }

    const newHash = await hashPassword(confirmPassword)
    localStorage.setItem("diary_password_hash", newHash)
    alert(t("password_changed") || "비밀번호가 변경되었습니다")
    setPassword("")
    setConfirmPassword("")
  }

  const handleRemovePassword = async () => {
    const savedHash = localStorage.getItem("diary_password_hash")
    const inputHash = await hashPassword(password)

    if (inputHash !== savedHash) {
      alert(t("wrong_password") || "비밀번호가 틀렸습니다")
      return
    }

    if (confirm(t("confirm_remove_password") || "정말 비밀번호를 제거하시겠습니까?")) {
      localStorage.removeItem("diary_password_hash")
      setIsLocked(false)
      setPassword("")
      alert(t("password_removed") || "비밀번호가 제거되었습니다")
    }
  }

  const handleEdit = (diary: DiaryEntry) => {
    console.log("[v0] Editing diary, attachments:", diary.attachments?.length || 0)
    setEditingId(diary.id)
    const loadedAttachments = (diary.attachments || []).map((att) => ({
      type: att.type || "image",
      name: att.name || "attachment",
      url: att.url || att.data || "",
      data: att.data || att.url || "",
    }))
    console.log("[v0] Loaded attachments for editing:", loadedAttachments.length)
    setFormData({
      date: diary.date,
      content: diary.content,
      mood: diary.mood,
      weather: diary.weather,
      attachments: loadedAttachments,
    })
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!confirm(t("confirmDelete") || "정말 삭제하시겠습니까?")) return

    try {
      const updated = diaries.filter((d) => d.id !== id)
      setDiaries(updated)
      await saveDiaries(updated, user.id)
      alert(t("deleteSuccess") || "삭제되었습니다!")
    } catch (error) {
      console.error("[v0] Error deleting diary:", error)
      alert("삭제 실패: " + error)
    }
  }

  const handleSave = async (attachments: Attachment[]) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!formData.content.trim()) {
      alert("내용을 입력해주세요")
      return
    }

    try {
      setSaving(true)
      console.log("[v0] Saving diary with", attachments.length, "attachments")

      let updated: DiaryEntry[]
      if (editingId) {
        updated = diaries.map((d) =>
          d.id === editingId
            ? {
                ...d,
                date: formData.date,
                content: formData.content,
                mood: formData.mood,
                weather: formData.weather,
                attachments,
              }
            : d,
        )
      } else {
        const diary: DiaryEntry = {
          id: crypto.randomUUID(),
          date: formData.date,
          content: formData.content,
          mood: formData.mood,
          weather: formData.weather,
          attachments,
          createdAt: new Date().toISOString(),
          user_id: user.id,
        }
        updated = [diary, ...diaries]
      }

      setDiaries(updated)
      await saveDiaries(updated, user.id)

      console.log("[v0] Diary saved successfully with", attachments.length, "attachments")
      alert(`일기가 저장되었습니다! (첨부파일 ${attachments.length}개)`)

      setFormData({
        date: new Date().toISOString().split("T")[0],
        content: "",
        mood: moods[0],
        weather: weathers[0],
        attachments: [],
      })
      setEditingId(null)
      setIsAdding(false)
    } catch (error) {
      console.error("[v0] Error saving diary:", error)
      alert("저장 실패: " + error)
      loadData() // Reload on error
    } finally {
      setSaving(false)
    }
  }

  const handleAttachmentsChange = (attachments: Attachment[]) => {
    setFormData({ ...formData, attachments })
    console.log("[v0] Diary attachments updated:", attachments.length)
  }

  const handleTranscriptReceived = (text: string) => {
    setFormData({ ...formData, content: formData.content + text })
  }

  const handleAnalyzeEmotion = async () => {
    if (!formData.content || formData.content.trim().length < 20) {
      alert(t("diary_too_short_for_analysis"))
      return
    }

    try {
      setAnalyzingEmotion(true)
      const response = await fetch("/api/analyze-diary-emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.content,
          language,
        }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const analysis = await response.json()
      setEmotionAnalysis(analysis)
    } catch (error) {
      console.error("[v0] Emotion analysis error:", error)
      alert(t("emotion_analysis_failed"))
    } finally {
      setAnalyzingEmotion(false)
    }
  }

  if (isSettingPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <Lock className="h-12 w-12 mx-auto text-green-600" />
            <h2 className="text-2xl font-bold">{t("set_diary_password") || "일기 비밀번호 설정"}</h2>
            <p className="text-sm text-muted-foreground">
              {t("password_description") || "일기를 보호하기 위한 비밀번호를 설정하세요"}
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t("new_password") || "비밀번호"}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password_placeholder") || "최소 4자 이상"}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("confirm_password") || "비밀번호 확인"}</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("confirm_password_placeholder") || "비밀번호 재입력"}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSetPassword} className="flex-1 bg-green-600 hover:bg-green-700">
                {t("set_password") || "설정"}
              </Button>
              <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                {t("skip") || "건너뛰기"}
              </Button>
            </div>
          </div>
          <MediaTools
            language={language}
            attachments={formData.attachments || []}
            onAttachmentsChange={handleAttachmentsChange}
            onSave={(attachments) => handleSave(attachments)}
            saving={saving}
            onTextFromSpeech={handleTranscriptReceived}
          />
          {formData.content && formData.content.trim().length >= 20 && (
            <Button
              onClick={handleAnalyzeEmotion}
              disabled={analyzingEmotion}
              variant="outline"
              className="w-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 bg-transparent"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {analyzingEmotion ? t("analyzing_emotion") : t("analyze_emotion")}
            </Button>
          )}
          {emotionAnalysis && (
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                {t("emotion_analysis_result")}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">{t("emotion_positive")}:</span>{" "}
                  {emotionAnalysis.emotion === "긍정적" || emotionAnalysis.emotion === "positive"
                    ? t("emotion_positive")
                    : emotionAnalysis.emotion === "부정적" || emotionAnalysis.emotion === "negative"
                      ? t("emotion_negative")
                      : t("emotion_neutral")}
                </p>
                <p>
                  <span className="font-medium">{t("emotion_score")}:</span> {emotionAnalysis.score}/10
                </p>
                <p>
                  <span className="font-medium">{t("main_emotions")}:</span> {emotionAnalysis.mainEmotions.join(", ")}
                </p>
                <div className="mt-3 p-3 bg-white/50 dark:bg-slate-900/50 rounded">
                  <p className="font-medium mb-1">{t("ai_advice")}:</p>
                  <p className="text-muted-foreground">{emotionAnalysis.advice}</p>
                </div>
              </div>
            </Card>
          )}
        </Card>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <Lock className="h-12 w-12 mx-auto text-green-600" />
            <h2 className="text-2xl font-bold">{t("locked_diary") || "잠긴 일기"}</h2>
            <p className="text-sm text-muted-foreground">
              {t("enter_password_to_unlock") || "비밀번호를 입력하여 일기를 확인하세요"}
            </p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password") || "비밀번호"}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleUnlock()
              }}
            />
            <div className="flex gap-2">
              <Button onClick={handleUnlock} className="flex-1 bg-green-600 hover:bg-green-700">
                <Unlock className="mr-2 h-4 w-4" /> {t("unlock") || "잠금 해제"}
              </Button>
              <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                {t("cancel") || "취소"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

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
            setEditingId(null)
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("cancel")}
        </Button>
        <div className="space-y-4">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select value={formData.mood} onValueChange={(mood) => setFormData({ ...formData, mood })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-xl z-50">
                {moods.map((m) => (
                  <SelectItem
                    key={m}
                    value={m}
                    className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formData.weather} onValueChange={(weather) => setFormData({ ...formData, weather })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-xl z-50">
                {weathers.map((w) => (
                  <SelectItem
                    key={w}
                    value={w}
                    className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder={
              language === "ko"
                ? "오늘 하루는 어땠나요?"
                : language === "en"
                  ? "How was your day?"
                  : language === "zh"
                    ? "今天过得怎么样?"
                    : "今日はどうでしたか?"
            }
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
          />
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">첨부파일:</p>
              {formData.attachments.map((file, idx) => (
                <div key={idx} className="text-sm text-muted-foreground">
                  {file.name}
                </div>
              ))}
            </div>
          )}
          <MediaTools
            language={language}
            attachments={formData.attachments || []}
            onAttachmentsChange={handleAttachmentsChange}
            onSave={(attachments) => handleSave(attachments)}
            saving={saving}
            onTextFromSpeech={handleTranscriptReceived}
          />
          {formData.content && formData.content.trim().length >= 20 && (
            <Button
              onClick={handleAnalyzeEmotion}
              disabled={analyzingEmotion}
              variant="outline"
              className="w-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 bg-transparent"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {analyzingEmotion ? t("analyzing_emotion") : t("analyze_emotion")}
            </Button>
          )}
          {emotionAnalysis && (
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                {t("emotion_analysis_result")}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">{t("emotion_positive")}:</span>{" "}
                  {emotionAnalysis.emotion === "긍정적" || emotionAnalysis.emotion === "positive"
                    ? t("emotion_positive")
                    : emotionAnalysis.emotion === "부정적" || emotionAnalysis.emotion === "negative"
                      ? t("emotion_negative")
                      : t("emotion_neutral")}
                </p>
                <p>
                  <span className="font-medium">{t("emotion_score")}:</span> {emotionAnalysis.score}/10
                </p>
                <p>
                  <span className="font-medium">{t("main_emotions")}:</span> {emotionAnalysis.mainEmotions.join(", ")}
                </p>
                <div className="mt-3 p-3 bg-white/50 dark:bg-slate-900/50 rounded">
                  <p className="font-medium mb-1">{t("ai_advice")}:</p>
                  <p className="text-muted-foreground">{emotionAnalysis.advice}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("title")}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsLocked(true)}
            title={t("lock_diary") || "일기 잠그기"}
          >
            <Lock className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsAdding(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> {t("add")} {t("diary")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {diaries.map((diary) => (
          <Card key={diary.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm text-muted-foreground">{diary.date}</div>
              <div className="flex gap-2 items-center">
                <span>{diary.mood}</span>
                <span>{diary.weather}</span>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(diary)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(diary.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            <p className="whitespace-pre-wrap">{diary.content}</p>
            {diary.attachments && diary.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">첨부파일 ({diary.attachments.length}개)</p>
                <div className="grid grid-cols-2 gap-2">
                  {diary.attachments.map((file: any, idx: number) => {
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

                    return (
                      <div key={idx} className="border rounded overflow-hidden bg-muted dark:bg-muted">
                        {isImage && (
                          <img
                            src={mediaUrl || "/placeholder.svg"}
                            alt={file.name || `첨부 ${idx + 1}`}
                            className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition"
                            onClick={() => setSelectedImage({ url: mediaUrl, name: file.name || `첨부 ${idx + 1}` })}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                            }}
                          />
                        )}
                        {isVideo && <video src={mediaUrl} controls playsInline className="w-full h-32 bg-black" />}
                        {isAudio && (
                          <div className="flex items-center justify-center h-20 bg-gray-100">
                            <audio src={mediaUrl} controls className="w-full px-2" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-screen">
            <img
              src={selectedImage.url || "/placeholder.svg"}
              alt={selectedImage.name}
              className="max-w-full max-h-screen object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
