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
  Repeat,
  Filter,
} from "lucide-react"
import { saveTodoItems, loadTodoItems } from "@/lib/storage"
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
  }>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    repeatType: "none",
  })

  const t = (key: string) => getTranslation(language as any, key)

  const handleToggleComplete = (id: string) => {
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  useEffect(() => {
    loadData()
  }, [user])

  useEffect(() => {
    const checkAndUpdateRepeatTodos = async () => {
      if (!user?.id) return

      const today = new Date().toISOString().split("T")[0]
      let updated = false

      const updatedTodos = todos.map((todo) => {
        // Skip if not repeating, no due date, or not completed
        if (todo.repeatType === "none" || !todo.dueDate || !todo.completed) {
          return todo
        }

        const dueDate = new Date(todo.dueDate)
        const todayDate = new Date(today)

        // Check if due date has passed and todo is completed
        if (dueDate < todayDate) {
          const newDueDate = new Date(dueDate)

          switch (todo.repeatType) {
            case "daily":
              newDueDate.setDate(newDueDate.getDate() + 1)
              break
            case "weekly":
              newDueDate.setDate(newDueDate.getDate() + 7)
              break
            case "monthly":
              newDueDate.setMonth(newDueDate.getMonth() + 1)
              break
          }

          updated = true
          return {
            ...todo,
            dueDate: newDueDate.toISOString().split("T")[0],
            completed: false, // Reset completion status for next occurrence
          }
        }

        return todo
      })

      if (updated) {
        await saveTodoItems(updatedTodos, user.id)
        setTodos(updatedTodos)
      }
    }

    // Check immediately and then every hour
    checkAndUpdateRepeatTodos()
    const interval = setInterval(checkAndUpdateRepeatTodos, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [todos, user])

  const loadData = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const data = await loadTodoItems(user.id)
      setTodos(data)
    } catch (error) {
      console.error("Error loading todos:", error)
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
    if (!formData.title.trim() || !user?.id) return

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
          createdAt: new Date().toISOString(),
        }
        updatedTodos = [newTodo, ...todos]
      }

      await saveTodoItems(updatedTodos, user.id)
      setTodos(updatedTodos)
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        repeatType: "none",
      })
      setEditingId(null)
    } catch (error) {
      console.error("Error saving todo:", error)
      alert(t("save_failed"))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (todo: TodoItem) => {
    setIsAdding(true) // Added setIsAdding(true) to show the form when editing
    setEditingId(todo.id)
    setFormData({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      dueDate: todo.dueDate || "",
      repeatType: todo.repeatType || "none",
    })
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    if (!confirm(t("confirm_delete"))) return

    const updatedTodos = todos.filter((todo) => todo.id !== id)
    await saveTodoItems(updatedTodos, user.id)
    setTodos(updatedTodos)
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
            className={`flex items-center gap-2 ${
              filter === "all"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
            }`}
          >
            <Filter className="h-4 w-4" />
            {t("filter_all")}
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
            className={`flex items-center gap-2 ${
              filter === "active"
                ? "bg-orange-600 hover:bg-orange-700"
                : "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
            }`}
          >
            <Circle className="h-4 w-4" />
            {t("filter_active")}
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
            className={`flex items-center gap-2 ${
              filter === "completed"
                ? "bg-blue-600 hover:bg-blue-700"
                : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            }`}
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
                <label htmlFor="dueDate" className="text-sm font-medium block mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("todo_due_date")}
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="repeat" className="text-sm font-medium block mb-2 flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  {t("todo_repeat")}
                </label>
                <select
                  id="repeat"
                  value={formData.repeatType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      repeatType: e.target.value as "none" | "daily" | "weekly" | "monthly",
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="none">{t("repeat_none")}</option>
                  <option value="daily">{t("repeat_daily")}</option>
                  <option value="weekly">{t("repeat_weekly")}</option>
                  <option value="monthly">{t("repeat_monthly")}</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700">
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
                    })
                  }}
                  className="flex-1"
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
