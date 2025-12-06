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
import type { TodoItem } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"
import { getTranslation } from "@/lib/i18n"

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
    loadData()

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("[v0] Notification permission:", permission)
      })
    }
  }, [user, language])

  useEffect(() => {
    if (todos.length === 0) return

    const checkAlarms = () => {
      console.log("[v0] Checking alarms, todos count:", todos.length)
      const now = new Date()

      todos.forEach((todo) => {
        if (!todo.alarmEnabled || !todo.alarmTime || todo.completed) {
          return
        }

        const alarmTime = new Date(todo.alarmTime)

        if (isNaN(alarmTime.getTime())) {
          console.error("[v0] Invalid alarm time for todo:", todo.title, todo.alarmTime)
          return
        }

        const timeDiff = alarmTime.getTime() - now.getTime()

        console.log(
          "[v0] Todo:",
          todo.title,
          "alarm at:",
          alarmTime.toLocaleString(),
          "now:",
          now.toLocaleString(),
          "time diff (seconds):",
          Math.round(timeDiff / 1000),
        )

        if (timeDiff > -60000 && timeDiff <= 120000) {
          const alarmKey = `alarm_${todo.id}_${alarmTime.getTime()}`

          if (sessionStorage.getItem(alarmKey)) {
            return
          }

          console.log("[v0] Triggering alarm for:", todo.title)

          sessionStorage.setItem(alarmKey, "shown")

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(getTranslation(language as any, "todo_alarm_notification"), {
              body: todo.title,
              icon: "/favicon.ico",
              tag: todo.id,
              requireInteraction: true, // Keep notification until user interacts
            })
          } else {
            alert(`${getTranslation(language as any, "todo_alarm_notification")}: ${todo.title}`)
          }
        }
      })
    }

    checkAlarms()
    const interval = setInterval(checkAlarms, 15000)

    return () => clearInterval(interval)
  }, [todos, language]) // Added language to dependency array so alarm uses correct language

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const data = await loadTodoItems(user.id)
      setTodos(data)
    } catch (error) {
      console.error("[v0] To-Do 로드 에러:", error)
      // If table doesn't exist yet, just show empty list
      setTodos([])
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

  const handleSave = async () => {
    if (!user?.id) {
      alert(t("login_required") || "로그인이 필요합니다")
      return
    }

    if (!formData.title.trim()) {
      alert(t("todo_title_required") || "할 일을 입력해주세요")
      return
    }

    if (formData.alarmEnabled && formData.alarmTime) {
      const testDate = new Date(formData.alarmTime)
      if (isNaN(testDate.getTime())) {
        alert(t("invalid_alarm_time") || "알람 시간이 올바르지 않습니다")
        return
      }
      console.log("[v0] Saving alarm time:", formData.alarmTime, "as Date:", testDate.toLocaleString())
    }

    setSaving(true)
    try {
      let updatedTodos: TodoItem[]

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
                alarmTime: formData.alarmTime || undefined,
              }
            : todo,
        )
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
          alarmTime: formData.alarmTime || undefined,
          createdAt: new Date().toISOString(),
        }
        updatedTodos = [newTodo, ...todos]
      }

      await saveTodoItems(updatedTodos, user.id)
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
      const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))

      await saveTodoItems(updatedTodos, user.id)
      setTodos(updatedTodos)
    } catch (error) {
      console.error("[v0] To-Do 완료 상태 변경 에러:", error)
    }
  }

  const handleEdit = (todo: TodoItem) => {
    console.log("[v0] Editing todo:", todo)
    setEditingId(todo.id)

    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    let formattedDueDate = ""
    if (todo.dueDate) {
      try {
        const date = new Date(todo.dueDate)
        if (!isNaN(date.getTime())) {
          formattedDueDate = date.toISOString().slice(0, 16)
        }
      } catch (e) {
        console.error("[v0] Error parsing dueDate:", e)
      }
    }

    let formattedAlarmTime = ""
    if (todo.alarmTime) {
      try {
        const date = new Date(todo.alarmTime)
        if (!isNaN(date.getTime())) {
          formattedAlarmTime = date.toISOString().slice(0, 16)
        }
      } catch (e) {
        console.error("[v0] Error parsing alarmTime:", e)
      }
    }

    console.log("[v0] Formatted dueDate:", formattedDueDate, "alarmTime:", formattedAlarmTime)

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
      await deleteTodoItem(id, user.id)
      const updatedTodos = todos.filter((todo) => todo.id !== id)
      setTodos(updatedTodos)
    } catch (error) {
      console.error("[v0] To-Do 삭제 에러:", error)
      alert(t("delete_failed") || "삭제에 실패했습니다.")
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
                <Button onClick={handleSave} disabled={saving} className="flex-1">
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
