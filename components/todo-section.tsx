"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit,
  Mic,
  MicOff,
  Calendar,
  Bell,
  Repeat,
  Filter,
} from "lucide-react"
import { saveTodoItems, loadTodoItems, deleteTodoItem } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import type { TodoItem, Attachment } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"
import { getTranslation } from "@/lib/i18n"
import { notificationManager } from "@/lib/notification-manager"

interface TodoSectionProps {
  onBack: () => void
  language: string
}

export function TodoSection({ onBack, language }: TodoSectionProps) {
  const { user } = useAuth()
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const [formData, setFormData] = useState<{
    title: string
    description: string
    priority: "low" | "medium" | "high"
    dueDate: string
    repeatType: "none" | "daily" | "weekly" | "monthly"
    alarmEnabled: boolean
    alarmTime: string
  }>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    repeatType: "none",
    alarmEnabled: false,
    alarmTime: "",
  })

  const t = (key: string) => getTranslation(language as any, key)

  useEffect(() => {
    notificationManager.requestPermission()
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      const items = await loadTodoItems()
      setTodos(items)

      items.forEach((todo) => {
        if (todo.alarmEnabled && todo.alarmTime && !todo.completed) {
          const [datePart, timePart] = todo.alarmTime.split("T")
          if (datePart && timePart) {
            const [year, month, day] = datePart.split("-").map(Number)
            const [hours, minutes] = timePart.split(":").map(Number)
            const alarmDateTime = new Date(year, month - 1, day, hours, minutes)

            console.log("[v0] Restoring todo alarm:", {
              id: `todo_${todo.id}`,
              title: todo.title,
              alarmTime: todo.alarmTime,
              alarmDateTime: alarmDateTime.toISOString(),
              now: new Date().toISOString(),
              isFuture: alarmDateTime.getTime() > Date.now(),
            })

            if (!isNaN(alarmDateTime.getTime()) && alarmDateTime.getTime() > Date.now()) {
              notificationManager.scheduleAlarm({
                id: `todo_${todo.id}`,
                title: t("todo_alarm_notification") || "할일 알림",
                message: todo.title,
                scheduleTime: alarmDateTime,
                type: "schedule",
              })
            }
          }
        }
      })
    } catch (error) {
      console.error("[v0] Failed to load todos:", error)
    } finally {
      setLoading(false)
    }
  }

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(t("speech_recognition_not_supported"))
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        alert(t("mic_permission_required"))
      }
    }
  }

  const handleSave = async (attachments: Attachment[]) => {
    if (!user?.id) {
      alert(t("login_required") || "로그인이 필요합니다")
      return
    }

    if (!formData.title.trim()) {
      alert(t("todo_title_required") || "할 일을 입력해주세요")
      return
    }

    if (formData.alarmEnabled && formData.alarmTime) {
      // Parse the datetime-local input (YYYY-MM-DDTHH:mm)
      const [datePart, timePart] = formData.alarmTime.split("T")
      if (!datePart || !timePart) {
        alert(t("invalid_alarm_time") || "알람 시간이 올바르지 않습니다")
        return
      }
    }

    setSaving(true)
    try {
      let updatedTodos: TodoItem[]

      const processedAlarmTime = formData.alarmTime || undefined

      if (editingId) {
        updatedTodos = todos.map((todo) =>
          todo.id === editingId
            ? {
                ...todo,
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate || undefined,
                repeatType: formData.repeatType,
                alarmEnabled: formData.alarmEnabled,
                alarmTime: processedAlarmTime,
              }
            : todo,
        )

        notificationManager.cancelAlarm(`todo_${editingId}`)

        if (formData.alarmEnabled && processedAlarmTime) {
          // Parse datetime-local format properly (YYYY-MM-DDTHH:mm)
          const [datePart, timePart] = processedAlarmTime.split("T")
          const [year, month, day] = datePart.split("-").map(Number)
          const [hours, minutes] = timePart.split(":").map(Number)

          // Create date using local timezone
          const alarmDateTime = new Date(year, month - 1, day, hours, minutes)

          console.log("[v0] Todo alarm scheduled:", {
            id: `todo_${editingId}`,
            alarmTime: processedAlarmTime,
            alarmDateTime: alarmDateTime.toISOString(),
            now: new Date().toISOString(),
            isFuture: alarmDateTime.getTime() > Date.now(),
          })

          if (!isNaN(alarmDateTime.getTime()) && alarmDateTime.getTime() > Date.now()) {
            notificationManager.scheduleAlarm({
              id: `todo_${editingId}`,
              title: t("todo_alarm_notification") || "할일 알림",
              message: formData.title,
              scheduleTime: alarmDateTime,
              type: "schedule",
            })
          }
        }
      } else {
        const newTodo: TodoItem = {
          id: crypto.randomUUID(),
          title: formData.title,
          description: formData.description || "",
          completed: false,
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
          repeatType: formData.repeatType,
          alarmEnabled: formData.alarmEnabled,
          alarmTime: processedAlarmTime,
          createdAt: new Date().toISOString(),
          user_id: user.id,
        }

        updatedTodos = [...todos, newTodo]

        if (formData.alarmEnabled && processedAlarmTime) {
          // Parse datetime-local format properly (YYYY-MM-DDTHH:mm)
          const [datePart, timePart] = processedAlarmTime.split("T")
          const [year, month, day] = datePart.split("-").map(Number)
          const [hours, minutes] = timePart.split(":").map(Number)

          // Create date using local timezone
          const alarmDateTime = new Date(year, month - 1, day, hours, minutes)

          console.log("[v0] New todo alarm scheduled:", {
            id: `todo_${newTodo.id}`,
            alarmTime: processedAlarmTime,
            alarmDateTime: alarmDateTime.toISOString(),
            now: new Date().toISOString(),
            isFuture: alarmDateTime.getTime() > Date.now(),
          })

          if (!isNaN(alarmDateTime.getTime()) && alarmDateTime.getTime() > Date.now()) {
            notificationManager.scheduleAlarm({
              id: `todo_${newTodo.id}`,
              title: t("todo_alarm_notification") || "할일 알림",
              message: formData.title,
              scheduleTime: alarmDateTime,
              type: "schedule",
            })
          }
        }
      }

      await saveTodoItems(updatedTodos)
      setTodos(updatedTodos)
      setIsAdding(false)
      setEditingId(null)
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        repeatType: "none",
        alarmEnabled: false,
        alarmTime: "",
      })
    } catch (error) {
      console.error("[v0] To-Do 저장 에러:", error)
      alert(t("save_failed") || "저장에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleComplete = async (id: string) => {
    if (!user?.id) return

    try {
      const todo = todos.find((t) => t.id === id)
      if (!todo) return

      const updated = await saveTodoItems([
        {
          ...todo,
          completed: !todo.completed,
        },
      ])

      if (!todo.completed) {
        notificationManager.cancelAlarm(`todo_${id}`)
      }

      await loadData()
    } catch (error) {
      console.error("[v0] Failed to toggle todo:", error)
    }
  }

  const handleEdit = (todo: TodoItem) => {
    setEditingId(todo.id)

    let formattedDueDate = ""
    if (todo.dueDate) {
      try {
        const dateStr = todo.dueDate
        // If it's already in datetime-local format, use it directly
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
          formattedDueDate = dateStr.slice(0, 16)
        }
      } catch (e) {
        console.error("[v0] Error parsing dueDate:", e)
      }
    }

    let formattedAlarmTime = ""
    if (todo.alarmTime) {
      try {
        const timeStr = todo.alarmTime
        // If it's already in datetime-local format, use it directly
        if (timeStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
          formattedAlarmTime = timeStr.slice(0, 16)
        }
      } catch (e) {
        console.error("[v0] Error parsing alarmTime:", e)
      }
    }

    setFormData({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      dueDate: formattedDueDate,
      repeatType: todo.repeatType,
      alarmEnabled: todo.alarmEnabled,
      alarmTime: formattedAlarmTime,
    })
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return

    if (!confirm(t("confirm_delete") || "정말 삭제하시겠습니까?")) return

    try {
      notificationManager.cancelAlarm(`todo_${id}`)

      await deleteTodoItem(id)
      await loadData()
    } catch (error) {
      console.error("[v0] Failed to delete todo:", error)
      alert(t("delete_failed"))
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-700 border-blue-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    high: "bg-red-100 text-red-700 border-red-300",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            {t("todo_list")}
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-white/80 backdrop-blur">
            <div className="text-sm text-gray-600">{t("total_todos")}</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.total}</div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur">
            <div className="text-sm text-gray-600">{t("completed_todos")}</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur">
            <div className="text-sm text-gray-600">{t("pending_todos")}</div>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t("filter_all")}
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
            className="flex items-center gap-2"
          >
            <Circle className="h-4 w-4" />
            {t("filter_active")}
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t("filter_completed")}
          </Button>
        </div>

        {/* Add Todo Button */}
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full mb-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t("add_todo")}
          </Button>
        )}

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="p-6 mb-6 bg-white/90 backdrop-blur">
            <h3 className="text-lg font-semibold mb-4">{editingId ? t("edit") : t("add_todo")}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t("todo_title")}</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t("todo_title")}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={startVoiceInput}
                    className={isListening ? "bg-red-100" : ""}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                {isListening && <p className="text-sm text-red-600 mt-2">{t("voice_input_active")}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("todo_description")}</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t("todo_description")}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("todo_priority")}</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="low">{t("priority_low")}</option>
                  <option value="medium">{t("priority_medium")}</option>
                  <option value="high">{t("priority_high")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("todo_due_date")}
                </label>
                <Input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  {t("todo_repeat")}
                </label>
                <select
                  value={formData.repeatType}
                  onChange={(e) => setFormData({ ...formData, repeatType: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="none">{t("repeat_none")}</option>
                  <option value="daily">{t("repeat_daily")}</option>
                  <option value="weekly">{t("repeat_weekly")}</option>
                  <option value="monthly">{t("repeat_monthly")}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="alarm"
                  checked={formData.alarmEnabled}
                  onChange={(e) => setFormData({ ...formData, alarmEnabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="alarm" className="text-sm font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  {t("todo_alarm")}
                </label>
              </div>

              {formData.alarmEnabled && (
                <div>
                  <Input
                    type="datetime-local"
                    value={formData.alarmTime}
                    onChange={(e) => setFormData({ ...formData, alarmTime: e.target.value })}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => handleSave([])} disabled={saving} className="flex-1">
                  {saving ? <Spinner /> : t("save")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setEditingId(null)
                    setFormData({
                      title: "",
                      description: "",
                      priority: "medium",
                      dueDate: "",
                      repeatType: "none",
                      alarmEnabled: false,
                      alarmTime: "",
                    })
                  }}
                >
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Todo List */}
        {filteredTodos.length === 0 ? (
          <Card className="p-8 text-center bg-white/80 backdrop-blur">
            <p className="text-gray-500">{t("no_todos_message")}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <Card
                key={todo.id}
                className={`p-4 bg-white/90 backdrop-blur transition-all ${todo.completed ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <button onClick={() => handleToggleComplete(todo.id)} className="mt-1 flex-shrink-0">
                    {todo.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-medium ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {todo.title}
                      </h3>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(todo)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(todo.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    {todo.description && <p className="text-sm text-gray-600 mt-1">{todo.description}</p>}

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[todo.priority]}`}>
                        {t(`priority_${todo.priority}`)}
                      </span>

                      {todo.repeatType !== "none" && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-300 flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          {t(`repeat_${todo.repeatType}`)}
                        </span>
                      )}

                      {todo.alarmEnabled && (
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-300 flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          {t("todo_alarm")}
                        </span>
                      )}

                      {todo.dueDate && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
