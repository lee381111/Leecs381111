"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Download, Edit, Trash2, Calendar } from "lucide-react"
import { saveSchedules, loadSchedules } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import type { ScheduleEvent, Attachment } from "@/lib/types"
import { MediaTools } from "@/components/media-tools"
import { Spinner } from "@/components/ui/spinner"
import { getTranslation } from "@/lib/i18n"
import { notificationManager } from "@/lib/notification-manager"

interface ScheduleSectionProps {
  onBack: () => void
  language: string
}

export function ScheduleSection({ onBack, language }: ScheduleSectionProps) {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isBatchAdding, setIsBatchAdding] = useState(false)
  const [isOptimizingTravel, setIsOptimizingTravel] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [travelOptimizeData, setTravelOptimizeData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    style: "",
  })
  const [optimizedItinerary, setOptimizedItinerary] = useState<any>(null)
  // </CHANGE>
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    title: string
    date: string
    time: string
    category: string
    description: string
    attachments: Attachment[]
    alarmEnabled: boolean
    alarmMinutesBefore: number
  }>({
    title: "",
    date: "",
    time: "",
    category: "meeting",
    description: "",
    attachments: [],
    alarmEnabled: false,
    alarmMinutesBefore: 30,
  })
  const [batchEvents, setBatchEvents] = useState<
    Array<{
      name: string
      date: string
      category: string
      alarmMinutesBefore: number
    }>
  >([{ name: "", date: "", category: "birthday", alarmMinutesBefore: 1440 }])

  const t = (key: string) => getTranslation(language as any, key)

  useEffect(() => {
    notificationManager.requestPermission()
    notificationManager.restoreAlarms()
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const data = await loadSchedules(user.id)
      setSchedules(data)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (schedule: ScheduleEvent) => {
    setEditingId(schedule.id)
    setFormData({
      title: schedule.title,
      date: schedule.date,
      time: schedule.time,
      category: schedule.category,
      description: schedule.description,
      attachments: schedule.attachments || [],
      alarmEnabled: schedule.alarmEnabled || false,
      alarmMinutesBefore: schedule.alarmMinutesBefore || 30,
    })
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!confirm(getTranslation(language as any, "confirmDelete") || "정말 삭제하시겠습니까?")) return

    try {
      const updated = schedules.filter((s) => s.id !== id)
      setSchedules(updated)
      await saveSchedules(updated, user.id)
      notificationManager.cancelAlarm(`schedule_${id}`)
      alert(getTranslation(language as any, "deleteSuccess") || "삭제되었습니다!")
    } catch (error) {
      console.error("[v0] Error deleting schedule:", error)
      alert("삭제 실패: " + error)
    }
  }

  const handleSave = async (attachments: Attachment[]) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!formData.title.trim()) {
      alert("제목을 입력해주세요")
      return
    }

    try {
      setSaving(true)
      console.log("[v0] Saving schedule with", attachments.length, "attachments")

      let updated: ScheduleEvent[]
      const scheduleId = editingId || window.crypto.randomUUID()

      if (editingId) {
        updated = schedules.map((s) => (s.id === editingId ? { ...s, ...formData, attachments } : s))
      } else {
        const schedule: ScheduleEvent = {
          id: scheduleId,
          title: formData.title,
          date: formData.date,
          time: formData.time,
          category: formData.category,
          description: formData.description,
          attachments,
          alarmEnabled: formData.alarmEnabled,
          alarmMinutesBefore: formData.alarmMinutesBefore,
          createdAt: new Date().toISOString(),
          user_id: user.id,
        }
        updated = [schedule, ...schedules]
      }

      setSchedules(updated)
      await saveSchedules(updated, user.id)

      if (formData.alarmEnabled && formData.date && formData.time) {
        const scheduleDateTime = new Date(`${formData.date}T${formData.time}`)
        const alarmTime = new Date(scheduleDateTime.getTime() - formData.alarmMinutesBefore * 60 * 1000)

        if (alarmTime.getTime() > Date.now()) {
          notificationManager.scheduleAlarm({
            id: `schedule_${scheduleId}`,
            title: `일정 알림: ${formData.title}`,
            message: `${formData.alarmMinutesBefore}분 후에 일정이 시작됩니다.`,
            scheduleTime: alarmTime,
            type: "schedule",
          })
        }
      } else {
        notificationManager.cancelAlarm(`schedule_${scheduleId}`)
      }

      console.log("[v0] Schedule saved successfully")
      window.dispatchEvent(new Event("storage"))
      alert("일정이 저장되었습니다! 메인 화면 캘린더에 표시됩니다.")

      setFormData({
        title: "",
        date: "",
        time: "",
        category: "meeting",
        description: "",
        attachments: [],
        alarmEnabled: false,
        alarmMinutesBefore: 30,
      })
      setEditingId(null)
      setIsAdding(false)
    } catch (error) {
      console.error("[v0] Error saving schedule:", error)
      alert("저장 실패: " + error)
    } finally {
      setSaving(false)
    }
  }

  const handleBatchSave = async () => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    const validEvents = batchEvents.filter((e) => e.name.trim() && e.date)

    if (validEvents.length === 0) {
      alert("최소 1개 이상의 일정을 입력해주세요")
      return
    }

    try {
      setSaving(true)

      const newSchedules: ScheduleEvent[] = validEvents.map((event) => {
        const scheduleId = window.crypto.randomUUID()
        const scheduleDateTime = new Date(`${event.date}T00:00`)
        const alarmTime = new Date(scheduleDateTime.getTime() - event.alarmMinutesBefore * 60 * 1000)

        if (alarmTime.getTime() > Date.now()) {
          notificationManager.scheduleAlarm({
            id: `schedule_${scheduleId}`,
            title: `${event.category}: ${event.name}`,
            message: getTranslation(language as any, "special_day_coming") || "곧 특별한 날입니다!",
            scheduleTime: alarmTime,
            type: "schedule",
          })
        }

        return {
          id: scheduleId,
          title: event.name,
          date: event.date,
          time: "00:00",
          category: event.category,
          description: "",
          attachments: [],
          alarmEnabled: true,
          alarmMinutesBefore: event.alarmMinutesBefore,
          isSpecialEvent: true, // Mark as special event
          createdAt: new Date().toISOString(),
          user_id: user.id,
        }
      })

      const updated = [...newSchedules, ...schedules]
      setSchedules(updated)
      await saveSchedules(updated, user.id)

      window.dispatchEvent(new Event("storage"))
      alert(`${validEvents.length}개의 일정이 등록되었습니다!`)

      setBatchEvents([{ name: "", date: "", category: "birthday", alarmMinutesBefore: 1440 }])
      setIsBatchAdding(false)
    } catch (error) {
      console.error("[v0] Error saving batch schedules:", error)
      alert("저장 실패: " + error)
    } finally {
      setSaving(false)
    }
  }

  const handleOptimizeTravel = async () => {
    if (!travelOptimizeData.destination.trim() || !travelOptimizeData.startDate || !travelOptimizeData.endDate) {
      alert(t("please_fill_required_fields"))
      return
    }

    setOptimizing(true)
    try {
      const response = await fetch("/api/optimize-travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...travelOptimizeData,
          language,
        }),
      })

      if (!response.ok) throw new Error("Failed to optimize travel")

      const { itinerary } = await response.json()
      setOptimizedItinerary(itinerary)
    } catch (error) {
      console.error("Travel optimization error:", error)
      alert(t("optimization_failed"))
    } finally {
      setOptimizing(false)
    }
  }

  const handleApplyItinerary = () => {
    if (!optimizedItinerary || !optimizedItinerary.dailyPlan) return

    const newSchedules = optimizedItinerary.dailyPlan.map((day: any) => ({
      id: crypto.randomUUID(),
      title: day.title,
      date: day.date,
      time: "09:00",
      category: "vacation",
      description: day.activities.join("\n"),
      attachments: [],
      alarmEnabled: true,
      alarmMinutesBefore: 1440,
      isSpecialEvent: true,
    }))

    setSchedules([...schedules, ...newSchedules])
    saveSchedules([...schedules, ...newSchedules], user!.id)
    setOptimizedItinerary(null)
    setIsOptimizingTravel(false)
    alert(t("itinerary_applied"))
  }
  // </CHANGE>

  const exportToCalendar = (schedule: ScheduleEvent) => {
    console.log("[v0] Export button clicked for:", schedule.title)

    if (!confirm("📅 이 일정을 캘린더 파일로 다운로드하시겠습니까?")) {
      console.log("[v0] ICS export cancelled by user")
      return
    }

    try {
      const startDate = new Date(`${schedule.date}T${schedule.time || "00:00"}`)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
      }

      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Forest Note App//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:${schedule.id}@forestnote.app`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:${schedule.title}`,
        `DESCRIPTION:${(schedule.description || "").replace(/\n/g, "\\n")}`,
        `CATEGORIES:${schedule.category}`,
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n")

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${schedule.title.replace(/[^a-z0-9가-힣]/gi, "_")}.ics`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      alert(
        "✅ 일정 다운로드 완료!\n\n다운로드한 .ics 파일을:\n1. 다운로드 폴더에서 찾아 캘린더 앱으로 열기\n2. 또는 캘린더 앱에서 '가져오기' 선택",
      )
    } catch (error) {
      console.error("[v0] Export error:", error)
      alert("❌ 다운로드 실패\n\n오류: " + error)
    }
  }

  const handleAttachmentsChange = (attachments: Attachment[]) => {
    setFormData({ ...formData, attachments })
    console.log("[v0] Schedule attachments updated:", attachments.length)
  }

  const handleTranscriptReceived = (text: string) => {
    setFormData({ ...formData, description: formData.description + text })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-12 w-12" />
        <p className="text-muted-foreground mt-4">{t("loading")}</p>
      </div>
    )
  }

  if (isOptimizingTravel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setIsOptimizingTravel(false)
            setOptimizedItinerary(null)
            setTravelOptimizeData({
              destination: "",
              startDate: "",
              endDate: "",
              budget: "",
              style: "",
            })
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("cancel")}
        </Button>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <h2 className="text-2xl font-bold mb-2">🤖 {t("ai_travel_optimizer")}</h2>
          <p className="text-sm text-muted-foreground">{t("ai_travel_optimizer_description")}</p>
        </Card>

        {!optimizedItinerary ? (
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("destination_label")}</label>
              <Input
                placeholder={t("destination_placeholder")}
                value={travelOptimizeData.destination}
                onChange={(e) => setTravelOptimizeData({ ...travelOptimizeData, destination: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">{t("start_date_label")}</label>
                <input
                  type="date"
                  value={travelOptimizeData.startDate}
                  onChange={(e) => setTravelOptimizeData({ ...travelOptimizeData, startDate: e.target.value })}
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">{t("end_date_label")}</label>
                <input
                  type="date"
                  value={travelOptimizeData.endDate}
                  onChange={(e) => setTravelOptimizeData({ ...travelOptimizeData, endDate: e.target.value })}
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("budget_label")}</label>
              <Input
                type="number"
                placeholder={t("budget_placeholder")}
                value={travelOptimizeData.budget}
                onChange={(e) => setTravelOptimizeData({ ...travelOptimizeData, budget: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("travel_style_label")}</label>
              <select
                value={travelOptimizeData.style}
                onChange={(e) => setTravelOptimizeData({ ...travelOptimizeData, style: e.target.value })}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">{t("select_style")}</option>
                <option value={t("sightseeing")}>{t("sightseeing")}</option>
                <option value={t("relaxation")}>{t("relaxation")}</option>
                <option value={t("food_tour")}>{t("food_tour")}</option>
                <option value={t("adventure")}>{t("adventure")}</option>
                <option value={t("cultural")}>{t("cultural")}</option>
              </select>
            </div>

            <Button
              onClick={handleOptimizeTravel}
              disabled={optimizing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {optimizing ? <Spinner className="h-4 w-4 mr-2" /> : null}
              {optimizing ? t("optimizing") : t("generate_itinerary")}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-6 bg-green-50">
              <h3 className="font-semibold text-lg mb-2">{t("trip_summary")}</h3>
              <p>{optimizedItinerary.summary}</p>
            </Card>

            {optimizedItinerary.dailyPlan?.map((day: any, index: number) => (
              <Card key={index} className="p-6">
                <h3 className="font-bold text-lg mb-3">
                  {t("day")} {day.day}: {day.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{day.date}</p>
                <ul className="space-y-2">
                  {day.activities.map((activity: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}

            {optimizedItinerary.recommendations && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-3">{t("recommendations")}</h3>
                <div className="space-y-3">
                  {optimizedItinerary.recommendations.restaurants && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">🍽️ {t("recommended_restaurants")}</h4>
                      <ul className="space-y-1">
                        {optimizedItinerary.recommendations.restaurants.map((restaurant: string, idx: number) => (
                          <li key={idx} className="text-sm">
                            • {restaurant}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {optimizedItinerary.recommendations.attractions && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">🏛️ {t("recommended_attractions")}</h4>
                      <ul className="space-y-1">
                        {optimizedItinerary.recommendations.attractions.map((attraction: string, idx: number) => (
                          <li key={idx} className="text-sm">
                            • {attraction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {optimizedItinerary.recommendations.tips && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">💡 {t("travel_tips")}</h4>
                      <ul className="space-y-1">
                        {optimizedItinerary.recommendations.tips.map((tip: string, idx: number) => (
                          <li key={idx} className="text-sm">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {optimizedItinerary.budgetBreakdown && (
              <Card className="p-6 bg-yellow-50">
                <h3 className="font-bold text-lg mb-3">💰 {t("budget_breakdown")}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("accommodation")}</span>
                    <span className="font-semibold">
                      {optimizedItinerary.budgetBreakdown.accommodation?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("food")}</span>
                    <span className="font-semibold">{optimizedItinerary.budgetBreakdown.food?.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("transportation")}</span>
                    <span className="font-semibold">
                      {optimizedItinerary.budgetBreakdown.transportation?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("activities")}</span>
                    <span className="font-semibold">
                      {optimizedItinerary.budgetBreakdown.activities?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-yellow-300">
                    <span className="font-bold">{t("total")}</span>
                    <span className="font-bold text-lg">
                      {optimizedItinerary.budgetBreakdown.total?.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-3">
              <Button onClick={handleApplyItinerary} className="flex-1 bg-green-600 hover:bg-green-700">
                {t("apply_to_schedule")}
              </Button>
              <Button onClick={() => setOptimizedItinerary(null)} variant="outline" className="flex-1">
                {t("regenerate")}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }
  // </CHANGE>

  if (isBatchAdding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setIsBatchAdding(false)
            setBatchEvents([{ name: "", date: "", category: "birthday", alarmMinutesBefore: 1440 }])
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("cancel")}
        </Button>

        <Card className="p-4 bg-amber-50">
          <h2 className="text-xl font-bold mb-4">{t("special_days_batch_title")}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t("special_days_batch_description")}</p>
        </Card>

        <div className="space-y-4">
          {batchEvents.map((event, index) => (
            <Card key={index} className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  {t("schedule_number")} {index + 1}
                </h3>
                {batchEvents.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = batchEvents.filter((_, i) => i !== index)
                      setBatchEvents(updated)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              <Input
                placeholder={t("special_day_name_placeholder")}
                value={event.name}
                onChange={(e) => {
                  const updated = [...batchEvents]
                  updated[index].name = e.target.value
                  setBatchEvents(updated)
                }}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">{t("date")}</label>
                  <input
                    type="date"
                    value={event.date}
                    onChange={(e) => {
                      const updated = [...batchEvents]
                      updated[index].date = e.target.value
                      setBatchEvents(updated)
                    }}
                    className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">{t("category")}</label>
                  <select
                    value={event.category}
                    onChange={(e) => {
                      const updated = [...batchEvents]
                      updated[index].category = e.target.value
                      setBatchEvents(updated)
                    }}
                    className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
                  >
                    <option value="meeting">{t("meeting")}</option>
                    <option value="birthday">{t("birthday")}</option>
                    <option value="anniversary">{t("anniversary")}</option>
                    <option value="holiday">{t("holiday")}</option>
                    <option value="vacation">{t("vacation")}</option>
                    <option value="other">{t("other")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">{t("alarm")}</label>
                <select
                  value={event.alarmMinutesBefore}
                  onChange={(e) => {
                    const updated = [...batchEvents]
                    updated[index].alarmMinutesBefore = Number(e.target.value)
                    setBatchEvents(updated)
                  }}
                  className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
                >
                  <option value={5}>{t("5_min_before")}</option>
                  <option value={10}>{t("10_min_before")}</option>
                  <option value={15}>{t("15_min_before")}</option>
                  <option value={30}>{t("minutes_before_30")}</option>
                  <option value={60}>{t("hours_before_1")}</option>
                  <option value={180}>{t("hours_before_3")}</option>
                  <option value={1440}>{t("day_before_1")}</option>
                  <option value={4320}>{t("days_before_3")}</option>
                  <option value={10080}>{t("week_before_1")}</option>
                </select>
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setBatchEvents([...batchEvents, { name: "", date: "", category: "birthday", alarmMinutesBefore: 1440 }])
          }}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> {t("add_schedule")}
        </Button>

        <Button onClick={handleBatchSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Spinner className="h-4 w-4 mr-2" /> : null}
          {saving
            ? t("saving")
            : `${batchEvents.filter((e) => e.name.trim() && e.date).length} ${t("save_schedules_count")}`}
        </Button>
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
        <Input
          placeholder={t("title_label")}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">{t("category_label")}</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
            >
              <option value="meeting">{t("meeting")}</option>
              <option value="birthday">{t("birthday")}</option>
              <option value="anniversary">{t("anniversary")}</option>
              <option value="holiday">{t("holiday")}</option>
              <option value="vacation">{t("vacation")}</option>
              <option value="other">{t("other")}</option>
            </select>
          </div>
        </div>
        <Textarea
          placeholder={t("description_label")}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Card className="p-4 bg-amber-50">
          <h3 className="font-semibold mb-3">{t("alarm_settings")}</h3>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              checked={formData.alarmEnabled}
              onChange={(e) => setFormData({ ...formData, alarmEnabled: e.target.checked })}
              className="w-5 h-5"
            />
            <label className="text-sm">{t("enable_alarm_before_event")}</label>
          </div>
          {formData.alarmEnabled && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("alarm_time")}</label>
              <select
                value={formData.alarmMinutesBefore}
                onChange={(e) => setFormData({ ...formData, alarmMinutesBefore: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              >
                <option value={5}>{t("5_min_before")}</option>
                <option value={10}>{t("10_min_before")}</option>
                <option value={15}>{t("15_min_before")}</option>
                <option value={30}>{t("minutes_before_30")}</option>
                <option value={60}>{t("hours_before_1")}</option>
                <option value={180}>{t("hours_before_3")}</option>
                <option value={1440}>{t("day_before_1")}</option>
                <option value={4320}>{t("days_before_3")}</option>
                <option value={10080}>{t("week_before_1")}</option>
              </select>
            </div>
          )}
        </Card>
        {formData.attachments && formData.attachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("attachments_label")}:</p>
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
          <Button onClick={() => setIsOptimizingTravel(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            🤖 {t("ai_travel_optimizer")}
          </Button>
          {/* </CHANGE> */}
          <Button onClick={() => setIsBatchAdding(true)} className="bg-green-500 hover:bg-green-600 text-white">
            <Calendar className="mr-2 h-4 w-4" /> {t("special_days")}
          </Button>
          <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" /> {t("add")} {t("schedule")}
          </Button>
        </div>
      </div>

      {schedules.filter((s) => s.isSpecialEvent).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-700">{t("special_days")}</h2>
            <span className="text-sm text-muted-foreground">
              ({schedules.filter((s) => s.isSpecialEvent).length}개)
            </span>
          </div>
          <div className="grid gap-4">
            {schedules
              .filter((schedule) => schedule.isSpecialEvent)
              .map((schedule) => (
                <Card key={schedule.id} className="p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{schedule.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {schedule.date} {schedule.time} • {t(schedule.category) || schedule.category}
                      </p>
                      {schedule.alarmEnabled && (
                        <p className="text-xs text-amber-600 mt-1">
                          🔔 {t("alarm")} {schedule.alarmMinutesBefore}
                          {t("minutes_before")}
                        </p>
                      )}
                      <p className="mt-2">{schedule.description}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 relative z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          exportToCalendar(schedule)
                        }}
                        className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors flex items-center justify-center"
                        title={t("add_to_phone_calendar")}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleEdit(schedule)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
                        title={t("edit")}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(schedule.id)
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center"
                        title={t("delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {schedule.attachments && schedule.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">
                        {t("attachments_label")} ({schedule.attachments.length}개)
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {schedule.attachments.map((file: any, idx: number) => {
                          const isImage =
                            file.type?.startsWith("image/") ||
                            file.type === "image" ||
                            file.type === "drawing" ||
                            file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                          const isVideo =
                            file.type?.startsWith("video/") ||
                            file.type === "video" ||
                            file.name?.match(/\.(mp4|webm|mov)$/i)
                          const isAudio =
                            file.type?.startsWith("audio/") ||
                            file.type === "audio" ||
                            file.name?.match(/\.(mp3|wav|ogg)$/i)
                          const mediaUrl = file.url || file.data

                          if (isImage) {
                            return (
                              <div key={idx} className="relative border rounded overflow-hidden bg-gray-100">
                                <img
                                  src={mediaUrl || "/placeholder.svg"}
                                  alt={file.name || "첨부파일"}
                                  className="w-full h-24 object-cover cursor-pointer hover:opacity-90"
                                  onClick={() => window.open(mediaUrl, "_blank")}
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=96&width=96"
                                  }}
                                />
                              </div>
                            )
                          }
                          if (isVideo) {
                            return (
                              <div key={idx} className="border rounded overflow-hidden bg-black">
                                <video
                                  src={mediaUrl}
                                  controls
                                  className="w-full h-24 object-cover"
                                  preload="metadata"
                                />
                              </div>
                            )
                          }
                          if (isAudio) {
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-center h-24 bg-gray-100 border rounded p-2"
                              >
                                <audio src={mediaUrl} controls className="w-full" preload="metadata" />
                              </div>
                            )
                          }
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-center h-24 bg-gray-200 border rounded p-2"
                            >
                              <p className="text-xs text-center truncate">{file.name || "파일"}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        </div>
      )}

      {schedules.filter((s) => !s.isSpecialEvent).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{t("general_schedule")}</h2>
            <span className="text-sm text-muted-foreground">
              ({schedules.filter((s) => !s.isSpecialEvent).length}개)
            </span>
          </div>
          <div className="grid gap-4">
            {schedules
              .filter((schedule) => !schedule.isSpecialEvent)
              .map((schedule) => (
                <Card key={schedule.id} className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{schedule.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {schedule.date} {schedule.time} • {t(schedule.category) || schedule.category}
                      </p>
                      {schedule.alarmEnabled && (
                        <p className="text-xs text-amber-600 mt-1">
                          🔔 {t("alarm")} {schedule.alarmMinutesBefore}
                          {t("minutes_before")}
                        </p>
                      )}
                      <p className="mt-2">{schedule.description}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 relative z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          exportToCalendar(schedule)
                        }}
                        className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors flex items-center justify-center"
                        title={t("add_to_phone_calendar")}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleEdit(schedule)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
                        title={t("edit")}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(schedule.id)
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center"
                        title={t("delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {schedule.attachments && schedule.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">
                        {t("attachments_label")} ({schedule.attachments.length}개)
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {schedule.attachments.map((file: any, idx: number) => {
                          const isImage =
                            file.type?.startsWith("image/") ||
                            file.type === "image" ||
                            file.type === "drawing" ||
                            file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                          const isVideo =
                            file.type?.startsWith("video/") ||
                            file.type === "video" ||
                            file.name?.match(/\.(mp4|webm|mov)$/i)
                          const isAudio =
                            file.type?.startsWith("audio/") ||
                            file.type === "audio" ||
                            file.name?.match(/\.(mp3|wav|ogg)$/i)
                          const mediaUrl = file.url || file.data

                          if (isImage) {
                            return (
                              <div key={idx} className="relative border rounded overflow-hidden bg-gray-100">
                                <img
                                  src={mediaUrl || "/placeholder.svg"}
                                  alt={file.name || "첨부파일"}
                                  className="w-full h-24 object-cover cursor-pointer hover:opacity-90"
                                  onClick={() => window.open(mediaUrl, "_blank")}
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=96&width=96"
                                  }}
                                />
                              </div>
                            )
                          }
                          if (isVideo) {
                            return (
                              <div key={idx} className="border rounded overflow-hidden bg-black">
                                <video
                                  src={mediaUrl}
                                  controls
                                  className="w-full h-24 object-cover"
                                  preload="metadata"
                                />
                              </div>
                            )
                          }
                          if (isAudio) {
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-center h-24 bg-gray-100 border rounded p-2"
                              >
                                <audio src={mediaUrl} controls className="w-full" preload="metadata" />
                              </div>
                            )
                          }
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-center h-24 bg-gray-200 border rounded p-2"
                            >
                              <p className="text-xs text-center truncate">{file.name || "파일"}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
