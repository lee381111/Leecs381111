"use client"

import type React from "react"
import type { ScheduleEvent } from "./personal-organizer-app"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Paperclip, Mic, Bell, X, ImageIcon, Pencil, PenTool, ArrowUpDown, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { HandwritingCanvas } from "./handwriting-canvas"
import { createClient } from "@/lib/supabase/client"

type UploadedFile = {
  name: string
  url: string
  type: string
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const downloadAllSchedulesICS = (schedules: ScheduleEvent[]) => {
  if (schedules.length === 0) {
    alert("내보낼 일정이 없습니다")
    return
  }

  const formatDate = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":")
    const d = new Date(date)
    d.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const events = schedules.map((schedule) => {
    return [
      "BEGIN:VEVENT",
      `DTSTART:${formatDate(schedule.date, schedule.time)}`,
      `DTEND:${formatDate(schedule.date, schedule.time)}`,
      `SUMMARY:${schedule.title}`,
      `UID:${schedule.id}@personal-organizer`,
      "END:VEVENT",
    ].join("\r\n")
  })

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Personal Organizer//Schedule Export//EN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([icsContent], { type: "text/calendar" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `schedules-${new Date().toISOString().split("T")[0]}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

const downloadICS = (schedule: ScheduleEvent) => {
  const formatDate = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":")
    const d = new Date(date)
    d.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${formatDate(schedule.date, schedule.time)}`,
    `DTEND:${formatDate(schedule.date, schedule.time)}`,
    `SUMMARY:${schedule.title}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([icsContent], { type: "text/calendar" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${schedule.title}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

type ScheduleSectionProps = {
  scheduleEvents: ScheduleEvent[]
  setScheduleEvents: (scheduleEvents: ScheduleEvent[]) => void
  selectedDate?: Date
  userId?: string
}

export function ScheduleSection({ scheduleEvents, setScheduleEvents, selectedDate, userId }: ScheduleSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    date: selectedDate || new Date(),
    time: "",
    alarm: "",
  })
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<UploadedFile[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const [isHandwritingOpen, setIsHandwritingOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    const fetchSchedules = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("schedules")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: false })

        if (error) throw error

        if (data) {
          const formattedSchedules = data.map((s: any) => ({
            id: s.id,
            title: s.title,
            date: new Date(s.date),
            time: s.time,
            description: s.description,
            alarm: s.alarm || undefined,
            completed: s.completed || false,
            attachments: s.attachments || [],
            user_id: s.user_id,
          }))
          setScheduleEvents(formattedSchedules)
        }
      } catch (error) {
        console.error("[v0] Error fetching schedules:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchedules()
  }, [userId])

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const oversizedFiles = newFiles.filter((file) => file.size > MAX_FILE_SIZE)

      if (oversizedFiles.length > 0) {
        const fileList = oversizedFiles.map((f) => `${f.name} (${(f.size / (1024 * 1024)).toFixed(1)}MB)`).join(", ")
        alert(`다음 파일이 너무 큽니다 (최대 50MB):\n${fileList}`)
        return
      }

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
      alert(messages[language])
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
      setNewSchedule({ ...newSchedule, title: newSchedule.title + " " + transcript })
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

  const handleHandwritingSave = async (imageBlob: Blob) => {
    const file = new File([imageBlob], `handwriting-${Date.now()}.png`, { type: "image/png" })
    setAttachedFiles([...attachedFiles, file])
  }

  const handleAddSchedule = async () => {
    if (newSchedule.title && newSchedule.time) {
      try {
        const { data, error } = await supabase
          .from("schedules")
          .insert({
            title: newSchedule.title,
            date: newSchedule.date.toISOString(),
            time: newSchedule.time,
            description: newSchedule.alarm || null,
            user_id: userId,
          })
          .select()
          .single()

        if (error) throw error

        const schedule: ScheduleEvent = {
          id: data.id,
          title: data.title,
          date: new Date(data.date),
          time: data.time,
          description: data.description,
          alarm: data.alarm || undefined,
          completed: data.completed || false,
          attachments: data.attachments || [],
          user_id: data.user_id,
        }
        setScheduleEvents([...scheduleEvents, schedule])
        setNewSchedule({ title: "", date: selectedDate || new Date(), time: "", alarm: "" })
        setAttachedFiles([])
        setIsAdding(false)
      } catch (error) {
        console.error("[v0] Error adding schedule:", error)
        alert("일정 추가에 실패했습니다")
      }
    }
  }

  const handleUpdate = async () => {
    if (!editingId || !newSchedule.title || !newSchedule.time) return

    try {
      const { error } = await supabase
        .from("schedules")
        .update({
          title: newSchedule.title,
          date: newSchedule.date.toISOString(),
          time: newSchedule.time,
          description: newSchedule.alarm || null,
        })
        .eq("id", editingId)

      if (error) throw error

      const updatedSchedule: ScheduleEvent = {
        id: editingId,
        title: newSchedule.title,
        date: newSchedule.date,
        time: newSchedule.time,
        description: newSchedule.alarm || undefined,
        user_id: userId,
      }

      setScheduleEvents(scheduleEvents.map((s) => (s.id === editingId ? updatedSchedule : s)))
      setNewSchedule({ title: "", date: selectedDate || new Date(), time: "", alarm: "" })
      setAttachedFiles([])
      setExistingAttachments([])
      setEditingId(null)
      setIsAdding(false)
    } catch (error) {
      console.error("[v0] Error updating schedule:", error)
      alert("일정 수정에 실패했습니다")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("schedules").delete().eq("id", id)

      if (error) throw error

      setScheduleEvents(scheduleEvents.filter((s) => s.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting schedule:", error)
      alert("일정 삭제에 실패했습니다")
    }
  }

  const handleCancelAlarm = async (id: string) => {
    try {
      const { error } = await supabase.from("schedules").update({ alarm: null }).eq("id", id)

      if (error) throw error

      setScheduleEvents(scheduleEvents.map((s) => (s.id === id ? { ...s, alarm: undefined } : s)))
    } catch (error) {
      console.error("[v0] Error canceling alarm:", error)
    }
  }

  const handleToggleComplete = async (id: string) => {
    const schedule = scheduleEvents.find((s) => s.id === id)
    if (!schedule) return

    const newCompletedState = !schedule.completed

    try {
      const { error } = await supabase.from("schedules").update({ completed: newCompletedState }).eq("id", id)

      if (error) throw error

      setScheduleEvents(scheduleEvents.map((s) => (s.id === id ? { ...s, completed: newCompletedState } : s)))
    } catch (error) {
      console.error("[v0] Error toggling complete:", error)
    }
  }

  const handleEdit = (schedule: ScheduleEvent) => {
    setEditingId(schedule.id)
    setNewSchedule({
      title: schedule.title,
      date: schedule.date,
      time: schedule.time,
      alarm: schedule.alarm || "",
    })
    setExistingAttachments((schedule.attachments as UploadedFile[]) || [])
    setAttachedFiles([])
    setIsAdding(true)
  }

  const handleAddToCalendar = (schedule: ScheduleEvent) => {
    downloadICS(schedule)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setNewSchedule({ title: "", date: selectedDate || new Date(), time: "", alarm: "" })
    setAttachedFiles([])
    setExistingAttachments([])
  }

  const handleRemoveExistingAttachment = (index: number) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index))
  }

  const filteredSchedules = selectedDate
    ? scheduleEvents.filter(
        (s) =>
          s.date.getDate() === selectedDate.getDate() &&
          s.date.getMonth() === selectedDate.getMonth() &&
          s.date.getFullYear() === selectedDate.getFullYear(),
      )
    : scheduleEvents

  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.date.getTime() - a.date.getTime()
    } else {
      return a.date.getTime() - b.date.getTime()
    }
  })

  const getLangCode = () => {
    const langCodes = { ko: "ko-KR", en: "en-US", zh: "zh-CN", ja: "ja-JP" }
    return langCodes[language]
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("scheduleTitle")}</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => downloadAllSchedulesICS(scheduleEvents)}
            size="sm"
            variant="outline"
            title="캘린더로 내보내기"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {language === "ko"
              ? "캘린더 동기화"
              : language === "en"
                ? "Sync Calendar"
                : language === "zh"
                  ? "同기历"
                  : "カレンダー同期"}
          </Button>
          <Button onClick={() => setIsAdding(!isAdding)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t("addSchedule")}
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-6 space-y-4 rounded-lg border bg-muted/50 p-4">
          <h3 className="font-medium">{editingId ? "일정 수정" : t("addSchedule")}</h3>
          <div className="space-y-2">
            <Label htmlFor="title">{t("noteTitle")}</Label>
            <Input
              id="title"
              value={newSchedule.title}
              onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
              placeholder={t("scheduleInputPlaceholder")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="time">{t("time")}</Label>
              <Input
                id="time"
                type="time"
                lang={getLangCode()}
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alarm">{t("alarm")}</Label>
              <Input
                id="alarm"
                type="time"
                lang={getLangCode()}
                value={newSchedule.alarm}
                onChange={(e) => setNewSchedule({ ...newSchedule, alarm: e.target.value })}
              />
            </div>
          </div>
          {existingAttachments.length > 0 && (
            <div className="space-y-2">
              <Label>기존 첨부파일</Label>
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
              <Label>{t("attachFile")}</Label>
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
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="mr-2 h-4 w-4" />
              {t("attachFile")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsHandwritingOpen(true)}>
              <PenTool className="mr-2 h-4 w-4" />
              {t("handwriting")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceInput}
              className={isRecording ? "bg-red-500 text-white hover:bg-red-600" : ""}
            >
              <Mic className="mr-2 h-4 w-4" />
              {isRecording ? t("recording") : t("voiceInput")}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {language === "ko"
              ? "파일당 최대 50MB까지 업로드 가능합니다"
              : language === "en"
                ? "Maximum 50MB per file"
                : language === "zh"
                  ? "每个文件最大50MB"
                  : "ファイルあたり最大50MB"}
          </p>
          <div className="flex gap-2">
            <Button onClick={editingId ? handleUpdate : handleAddSchedule}>{editingId ? "수정" : t("save")}</Button>
            <Button variant="outline" onClick={handleCancel}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">
            {language === "ko"
              ? "일정 목록"
              : language === "en"
                ? "Schedule List"
                : language === "zh"
                  ? "日程列表"
                  : "スケジュール一覧"}
          </h3>
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
        {sortedSchedules.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {language === "ko"
              ? "일정이 없습니다"
              : language === "en"
                ? "No schedules"
                : language === "zh"
                  ? "没有日程"
                  : "スケジュールがありません"}
          </p>
        ) : (
          sortedSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`flex flex-col gap-3 rounded-lg border p-4 ${
                schedule.completed ? "bg-muted/50 opacity-60" : "bg-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox checked={schedule.completed} onCheckedChange={() => handleToggleComplete(schedule.id)} />
                <div className="flex-1">
                  <h3 className={`font-medium ${schedule.completed ? "line-through" : ""}`}>{schedule.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span>
                      {t("time")}: {schedule.time}
                    </span>
                    {schedule.alarm && (
                      <span className="flex items-center gap-2 text-orange-600 font-medium">
                        <Bell className="h-3 w-3" />
                        {t("alarm")}: {schedule.alarm}
                        <button
                          onClick={() => handleCancelAlarm(schedule.id)}
                          className="ml-1 hover:bg-orange-100 rounded p-0.5 transition-colors"
                          title={t("cancelAlarm")}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddToCalendar(schedule)}
                  title={t("addToCalendar")}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(schedule)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {schedule.attachments && schedule.attachments.length > 0 && <div className="ml-9"></div>}
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
