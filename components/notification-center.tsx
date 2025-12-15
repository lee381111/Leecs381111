"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Language } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { loadSchedules, loadMedications, saveSchedules, saveMedications } from "@/lib/storage"
import { notificationManager } from "@/lib/notification-manager"

interface NotificationCenterProps {
  language: Language
}

export function NotificationCenter({ language }: NotificationCenterProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAlarm, setNewAlarm] = useState({
    title: "",
    date: "",
    time: "",
    alarmMinutesBefore: 30,
    type: "schedule" as "schedule" | "medication", // New field
  })

  useEffect(() => {
    if (!user) return

    // Request notification permission on mount
    notificationManager.requestPermission()

    // Restore any saved alarms
    notificationManager.restoreAlarms()

    loadUpcomingNotifications()

    // Refresh notifications every minute
    const interval = setInterval(loadUpcomingNotifications, 60000)

    const handleScheduleUpdate = () => {
      console.log("[v0] Schedule updated, refreshing notifications")
      loadUpcomingNotifications()
    }
    window.addEventListener("scheduleUpdate", handleScheduleUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener("scheduleUpdate", handleScheduleUpdate)
    }
  }, [user])

  const loadUpcomingNotifications = async () => {
    if (!user) return

    try {
      console.log("[v0] Loading upcoming notifications...")

      const isOnline = navigator.onLine

      let schedules: any[] = []
      let medications: any[] = []

      if (isOnline) {
        try {
          ;[schedules, medications] = await Promise.all([loadSchedules(user.id), loadMedications(user.id)])
        } catch (fetchError) {
          console.warn("[v0] Failed to fetch schedules/medications (offline?), using empty arrays")
          schedules = []
          medications = []
        }
      } else {
        console.log("[v0] Offline mode: Skipping notification load from database")
        // In offline mode, don't try to load from database
        // Notifications will be restored when connection is back
        setNotifications([])
        setUnreadCount(0)
        return
      }

      console.log("[v0] Loaded schedules for notifications:", schedules.length)

      const now = new Date()
      const upcoming: any[] = []

      // Check schedules
      schedules.forEach((schedule: any) => {
        console.log("[v0] Checking schedule:", {
          title: schedule.title,
          alarmEnabled: schedule.alarmEnabled,
          completed: schedule.completed,
          date: schedule.date,
          time: schedule.time,
        })

        if (schedule.alarmEnabled && !schedule.completed) {
          const eventDateTime = new Date(`${schedule.date}T${schedule.time}:00`)
          const alarmTime = new Date(eventDateTime.getTime() - (schedule.alarmMinutesBefore || 30) * 60 * 1000)

          console.log("[v0] Schedule alarm time:", {
            eventDateTime: eventDateTime.toISOString(),
            alarmTime: alarmTime.toISOString(),
            now: now.toISOString(),
            isAfterNow: alarmTime > now,
            hoursUntil: (alarmTime.getTime() - now.getTime()) / (1000 * 60 * 60),
          })

          // Show notifications for events within next 24 hours
          if (alarmTime > now && alarmTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
            console.log("[v0] Adding schedule to upcoming notifications:", schedule.title)
            upcoming.push({
              id: `schedule_${schedule.id}`,
              type: "schedule",
              title: schedule.title,
              time: alarmTime.toLocaleString(language === "ko" ? "ko-KR" : "en-US"),
              relatedId: schedule.id,
            })

            // Schedule the notification
            notificationManager.scheduleAlarm({
              id: `schedule_${schedule.id}`,
              title: language === "ko" ? "일정 알림" : "Schedule Reminder",
              message: schedule.title,
              scheduleTime: alarmTime,
              type: "schedule",
            })
          }
        }
      })

      // Check medications
      medications.forEach((medication: any) => {
        if (medication.alarmEnabled && medication.isActive) {
          medication.times.forEach((time: string) => {
            const [hours, minutes] = time.split(":").map(Number)
            const medicationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)

            if (medicationTime < now) {
              medicationTime.setDate(medicationTime.getDate() + 1)
            }

            if (medicationTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
              upcoming.push({
                id: `medication_${medication.id}_${time}`,
                type: "medication",
                title: `${medication.name} ${medication.dosage}`,
                time: medicationTime.toLocaleString(language === "ko" ? "ko-KR" : "en-US"),
                relatedId: medication.id,
              })

              // Schedule the notification
              notificationManager.scheduleAlarm({
                id: `medication_${medication.id}_${time}`,
                title: language === "ko" ? "복약 시간" : "Medication Time",
                message: `${medication.name} ${medication.dosage}`,
                scheduleTime: medicationTime,
                type: "health",
              })
            }
          })
        }
      })

      upcoming.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

      console.log("[v0] Total upcoming notifications:", upcoming.length)
      console.log(
        "[v0] Upcoming notifications:",
        upcoming.map((n) => ({ title: n.title, time: n.time })),
      )

      setNotifications(upcoming)
      setUnreadCount(upcoming.length)
    } catch (error) {
      console.error("[v0] Error loading notifications:", error)
      setNotifications([])
      setUnreadCount(0)
    }
  }

  const getText = (key: string) => {
    const translations: { [key: string]: { [lang in Language]: string } } = {
      notifications: { ko: "알림", en: "Notifications", zh: "通知", ja: "通知" },
      noNotifications: {
        ko: "예정된 알림이 없습니다",
        en: "No upcoming notifications",
        zh: "没有即将到来的通知",
        ja: "今後の通知はありません",
      },
      schedule: { ko: "일정", en: "Schedule", zh: "日程", ja: "スケジュール" },
      medication: { ko: "복약", en: "Medication", zh: "用药", ja: "服薬" },
      dismiss: { ko: "확인", en: "Dismiss", zh: "确认", ja: "確認" },
      addAlarm: { ko: "알람 추가", en: "Add Alarm", zh: "添加闹钟", ja: "アラーム追加" },
      alarmTitle: { ko: "알람 제목", en: "Alarm Title", zh: "闹钟标题", ja: "アラームタイトル" },
      date: { ko: "날짜", en: "Date", zh: "日期", ja: "日付" },
      time: { ko: "시간", en: "Time", zh: "时间", ja: "時間" },
      minutesBefore: { ko: "분 전 알림", en: "minutes before", zh: "分钟前提醒", ja: "分前通知" },
      save: { ko: "저장", en: "Save", zh: "保存", ja: "保存" },
      cancel: { ko: "취소", en: "Cancel", zh: "取消", ja: "キャンセル" },
      alarmCount: { ko: "개의 알람", en: "alarms", zh: "个闹钟", ja: "件のアラーム" },
      alarmType: { ko: "알람 종류", en: "Alarm Type", zh: "闹钟类型", ja: "アラームタイプ" },
    }
    return translations[key]?.[language] || key
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    setUnreadCount((prev) => Math.max(0, prev - 1))
    notificationManager.cancelAlarm(id)
  }

  const handleAddAlarm = async () => {
    if (!user || !newAlarm.title || !newAlarm.date || !newAlarm.time) return

    try {
      console.log("[v0] Adding new alarm:", newAlarm)

      if (newAlarm.type === "medication") {
        const medications = await loadMedications(user.id)
        const medicationsArray = Array.isArray(medications) ? medications : []

        const newMedication = {
          id: crypto.randomUUID(),
          userId: user.id,
          name: newAlarm.title,
          dosage: "",
          times: [newAlarm.time],
          startDate: newAlarm.date,
          endDate: "",
          alarmEnabled: true,
          isActive: true,
          notes: "",
          createdAt: new Date().toISOString(),
        }

        await saveMedications([...medicationsArray, newMedication], user.id)
      } else {
        const schedules = await loadSchedules(user.id)
        const schedulesArray = Array.isArray(schedules) ? schedules : []

        const newSchedule = {
          id: crypto.randomUUID(),
          userId: user.id,
          title: newAlarm.title,
          date: newAlarm.date,
          time: newAlarm.time,
          alarmEnabled: true,
          alarmMinutesBefore: newAlarm.alarmMinutesBefore,
          completed: false,
          description: "",
          createdAt: new Date().toISOString(),
        }

        await saveSchedules([...schedulesArray, newSchedule], user.id)
      }

      console.log("[v0] Alarm saved successfully, refreshing list...")

      setNewAlarm({ title: "", date: "", time: "", alarmMinutesBefore: 30, type: "schedule" })
      setShowAddForm(false)

      await new Promise((resolve) => setTimeout(resolve, 100))

      await loadUpcomingNotifications()

      window.dispatchEvent(new Event("scheduleUpdate"))
    } catch (error) {
      console.error("[v0] Error adding alarm:", error)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-green-100/95 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          onClick={() => setIsOpen(false)}
        >
          <Card
            className="bg-white text-gray-900 w-full max-w-md mx-4 max-h-[32rem] overflow-y-auto shadow-2xl border-2 border-emerald-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-emerald-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-semibold flex items-center gap-2 text-gray-900">
                <Bell className="h-5 w-5" />
                {getText("notifications")}
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  {unreadCount} {getText("alarmCount")}
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-gray-900 hover:bg-emerald-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-900 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showAddForm && (
              <div className="p-4 bg-emerald-50 border-b border-emerald-200 space-y-3">
                <h4 className="font-semibold text-sm text-gray-900">{getText("addAlarm")}</h4>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">{getText("alarmType")}</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={newAlarm.type === "schedule" ? "default" : "outline"}
                      className={`flex-1 ${newAlarm.type === "schedule" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                      size="sm"
                      onClick={() => setNewAlarm({ ...newAlarm, type: "schedule" })}
                    >
                      {getText("schedule")}
                    </Button>
                    <Button
                      type="button"
                      variant={newAlarm.type === "medication" ? "default" : "outline"}
                      className={`flex-1 ${newAlarm.type === "medication" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}`}
                      size="sm"
                      onClick={() => setNewAlarm({ ...newAlarm, type: "medication" })}
                    >
                      {getText("medication")}
                    </Button>
                  </div>
                </div>

                <Input
                  type="text"
                  placeholder={getText("alarmTitle")}
                  value={newAlarm.title}
                  onChange={(e) => setNewAlarm({ ...newAlarm, title: e.target.value })}
                  className="bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">{getText("date")}</label>
                    <Input
                      type="date"
                      value={newAlarm.date}
                      onChange={(e) => setNewAlarm({ ...newAlarm, date: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">{getText("time")}</label>
                    <Input
                      type="time"
                      value={newAlarm.time}
                      onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                </div>

                {newAlarm.type === "schedule" && (
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">{getText("minutesBefore")}</label>
                    <Input
                      type="number"
                      value={newAlarm.alarmMinutesBefore}
                      onChange={(e) =>
                        setNewAlarm({ ...newAlarm, alarmMinutesBefore: Number.parseInt(e.target.value) })
                      }
                      min="0"
                      className="bg-white"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddAlarm}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    size="sm"
                  >
                    {getText("save")}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddForm(false)
                      setNewAlarm({ title: "", date: "", time: "", alarmMinutesBefore: 30, type: "schedule" })
                    }}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    {getText("cancel")}
                  </Button>
                </div>
              </div>
            )}

            <div className="p-4 space-y-3">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{getText("noNotifications")}</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 bg-emerald-50 rounded-lg flex items-start justify-between gap-3 border border-emerald-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            notification.type === "schedule" ? "bg-blue-600 text-white" : "bg-rose-600 text-white"
                          }`}
                        >
                          {getText(notification.type)}
                        </span>
                      </div>
                      <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNotification(notification.id)}
                      className="text-gray-900 hover:bg-emerald-100"
                      title={getText("dismiss")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
