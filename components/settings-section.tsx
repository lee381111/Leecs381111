"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Download,
  Upload,
  BookOpen,
  CheckCircle2,
  FileJson,
  FileSpreadsheet,
  FileText,
  ChevronDown,
} from "lucide-react"
import { exportAllData, importAllData, loadAllAnnouncements, saveAnnouncement, deleteAnnouncement } from "@/lib/storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTranslation } from "@/lib/i18n"
import type { Language, Announcement } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { loadUserConsents } from "@/lib/storage"

type SettingsSectionProps = {
  user: any
  language: string
  onLogout: () => void
}

export default function SettingsSection({ user, language, onLogout }: SettingsSectionProps) {
  const [importing, setImporting] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPersonalInfo, setShowPersonalInfo] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [showAnnouncementPanel, setShowAnnouncementPanel] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [announcementForm, setAnnouncementForm] = useState({
    message: "",
    type: "info" as "info" | "warning" | "success",
    expiresAt: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [consentLogs, setConsentLogs] = useState<any[]>([])
  const [loadingConsents, setLoadingConsents] = useState(false)

  const handleExport = async () => {
    if (!user?.id) {
      const lang = language as Language
      const msg = getTranslation(lang, "not_logged_in")
      alert(msg)
      return
    }

    try {
      await exportAllData(user.id)
      const lang = language as Language
      const msg = getTranslation(lang, "backup_downloaded")
      alert(msg)
    } catch (err) {
      console.error("[v0] Export error:", err)
      const lang = language as Language
      const msg = getTranslation(lang, "backup_error")
      alert(msg)
    }
  }

  const handleExportCSV = async () => {
    if (!user?.id) {
      const lang = language as Language
      alert(getTranslation(lang, "login_required"))
      return
    }

    try {
      const {
        loadNotes,
        loadDiaries,
        loadSchedules,
        loadTravelRecords,
        loadHealthRecords,
        loadMedications,
        loadBudgetTransactions,
      } = await import("@/lib/storage")

      const [notes, diaries, schedules, travels, health, medications, budgetTransactions] = await Promise.all([
        loadNotes(user.id),
        loadDiaries(user.id),
        loadSchedules(user.id),
        loadTravelRecords(user.id),
        loadHealthRecords(user.id),
        loadMedications(user.id),
        loadBudgetTransactions(user.id),
      ])

      let csvContent = ""

      csvContent += "=== 노트 ===\n"
      csvContent += "제목,내용,작성일\n"
      notes.forEach((note: any) => {
        const title = `"${(note.title || "").replace(/"/g, '""')}"`
        const content = `"${(note.content || "").replace(/"/g, '""')}"`
        const date = note.createdAt?.split("T")[0] || ""
        csvContent += `${title},${content},${date}\n`
      })
      csvContent += "\n"

      csvContent += "=== 일기 ===\n"
      csvContent += "날짜,내용,기분,날씨\n"
      diaries.forEach((diary: any) => {
        const date = diary.date || ""
        const content = `"${(diary.content || "").replace(/"/g, '""')}"`
        const mood = diary.mood || ""
        const weather = diary.weather || ""
        csvContent += `${date},${content},${mood},${weather}\n`
      })
      csvContent += "\n"

      csvContent += "=== 가계부 ===\n"
      csvContent += "날짜,구분,카테고리,금액,설명\n"
      budgetTransactions.forEach((t: any) => {
        const date = t.date || ""
        const type = t.type === "income" ? "수입" : "지출"
        const category = t.category || ""
        const amount = t.amount || 0
        const description = `"${(t.description || "").replace(/"/g, '""')}"`
        csvContent += `${date},${type},${category},${amount},${description}\n`
      })

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `forest-note-export-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      const lang = language as Language
      alert(getTranslation(lang, "csv_downloaded"))
    } catch (err) {
      console.error("[v0] CSV export error:", err)
      const lang = language as Language
      alert(getTranslation(lang, "csv_export_failed"))
    }
  }

  const handleExportExcel = async () => {
    if (!user?.id) {
      const lang = language as Language
      alert(getTranslation(lang, "login_required"))
      return
    }

    try {
      const {
        loadNotes,
        loadDiaries,
        loadSchedules,
        loadTravelRecords,
        loadHealthRecords,
        loadMedications,
        loadBudgetTransactions,
      } = await import("@/lib/storage")

      const [notes, diaries, schedules, travels, health, medications, budgetTransactions] = await Promise.all([
        loadNotes(user.id),
        loadDiaries(user.id),
        loadSchedules(user.id),
        loadTravelRecords(user.id),
        loadHealthRecords(user.id),
        loadMedications(user.id),
        loadBudgetTransactions(user.id),
      ])

      let html = '<html><head><meta charset="utf-8"></head><body>'

      html += "<h2>노트</h2>"
      html += '<table border="1"><tr><th>제목</th><th>내용</th><th>작성일</th></tr>'
      notes.forEach((note: any) => {
        html += `<tr><td>${note.title || ""}</td><td>${note.content || ""}</td><td>${note.createdAt?.split("T")[0] || ""}</td></tr>`
      })
      html += "</table><br>"

      html += "<h2>일기</h2>"
      html += '<table border="1"><tr><th>날짜</th><th>내용</th><th>기분</th><th>날씨</th></tr>'
      diaries.forEach((diary: any) => {
        html += `<tr><td>${diary.date || ""}</td><td>${diary.content || ""}</td><td>${diary.mood || ""}</td><td>${diary.weather || ""}</td></tr>`
      })
      html += "</table><br>"

      html += "<h2>가계부</h2>"
      html += '<table border="1"><tr><th>날짜</th><th>구분</th><th>카테고리</th><th>금액</th><th>설명</th></tr>'
      budgetTransactions.forEach((t: any) => {
        const type = t.type === "income" ? "수입" : "지출"
        html += `<tr><td>${t.date || ""}</td><td>${type}</td><td>${t.category || ""}</td><td>${t.amount || 0}</td><td>${t.description || ""}</td></tr>`
      })
      html += "</table>"

      html += "</body></html>"

      const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `forest-note-export-${new Date().toISOString().split("T")[0]}.xls`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      const lang = language as Language
      alert(getTranslation(lang, "excel_downloaded"))
    } catch (err) {
      console.error("[v0] Excel export error:", err)
      const lang = language as Language
      alert(getTranslation(lang, "excel_export_failed"))
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!user?.id) {
      const lang = language as Language
      const msg = getTranslation(lang, "not_logged_in")
      alert(msg)
      return
    }

    setImporting(true)
    try {
      await importAllData(file, user.id)
      const lang = language as Language
      const msg = getTranslation(lang, "restore_success")
      alert(msg)
      window.location.reload()
    } catch (err) {
      console.error("[v0] Import error:", err)
      const lang = language as Language
      const msg = getTranslation(lang, "restore_error")
      alert(msg)
    } finally {
      setImporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      const lang = language as Language
      alert(getTranslation(lang, "not_logged_in"))
      return
    }

    const lang = language as Language
    const confirmPhrase = getTranslation(lang, "delete_account_confirm_phrase")

    if (deleteConfirmText !== confirmPhrase) {
      alert(getTranslation(lang, "delete_account_phrase_mismatch"))
      return
    }

    setIsDeleting(true)
    try {
      const supabase = createClient()

      await Promise.all([
        supabase.from("notes").delete().eq("user_id", user.id),
        supabase.from("diaries").delete().eq("user_id", user.id),
        supabase.from("schedules").delete().eq("user_id", user.id),
        supabase.from("todo_items").delete().eq("user_id", user.id),
        supabase.from("travel_records").delete().eq("user_id", user.id),
        supabase.from("health_records").delete().eq("user_id", user.id),
        supabase.from("medications").delete().eq("user_id", user.id),
        supabase.from("budget_transactions").delete().eq("user_id", user.id),
        supabase.from("business_cards").delete().eq("user_id", user.id),
        supabase.from("vehicles").delete().eq("user_id", user.id),
      ])

      const { error } = await supabase.auth.admin.deleteUser(user.id)

      if (error) throw error

      alert(getTranslation(lang, "account_deleted_success"))

      await supabase.auth.signOut()
      window.location.href = "/"
    } catch (err) {
      console.error("[v0] Account deletion error:", err)
      alert(getTranslation(lang, "account_deletion_failed"))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateEmail = async () => {
    if (!user?.id || !newEmail || !password) {
      const lang = language as Language
      alert(getTranslation(lang, "fill_all_fields"))
      return
    }

    setIsUpdating(true)
    try {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        email: newEmail,
        password: password,
      })

      if (error) throw error

      const lang = language as Language
      alert(getTranslation(lang, "email_updated_success"))
      setEditingEmail(false)
      setNewEmail("")
      setPassword("")
    } catch (err) {
      console.error("[v0] Email update error:", err)
      const lang = language as Language
      alert(getTranslation(lang, "email_update_error"))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEmailChange = async () => {
    if (!user?.id || !newEmail || !password) {
      const lang = language as Language
      alert(getTranslation(lang, "fill_all_fields"))
      return
    }

    setIsUpdating(true)
    try {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        email: newEmail,
        password: password,
      })

      if (error) throw error

      const lang = language as Language
      alert(getTranslation(lang, "email_updated_success"))
      setEditingEmail(false)
      setNewEmail("")
      setPassword("")
    } catch (err) {
      console.error("[v0] Email update error:", err)
      const lang = language as Language
      alert(getTranslation(lang, "email_update_error"))
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    console.log("[v0] Settings section mounted, user:", user?.id)
    if (user && showPersonalInfo) {
      console.log("[v0] Loading consent logs for user:", user.id)
      setLoadingConsents(true)
      loadUserConsents(user.id)
        .then((logs) => {
          console.log("[v0] Loaded consent logs:", logs)
          setConsentLogs(logs)
        })
        .catch((error) => {
          console.error("[v0] Error loading consent logs:", error)
          setConsentLogs([])
        })
        .finally(() => setLoadingConsents(false))
    }
  }, [user, showPersonalInfo])

  useEffect(() => {
    if (user && showAnnouncementPanel) {
      loadAllAnnouncements(user.id).then(setAnnouncements)
    }
  }, [user, showAnnouncementPanel])

  const handleSaveAnnouncement = async () => {
    if (!user || !announcementForm.message.trim()) return

    try {
      const announcement: Announcement = {
        id: editingAnnouncement?.id || crypto.randomUUID(),
        message: announcementForm.message,
        type: announcementForm.type,
        isActive: true,
        expiresAt: announcementForm.expiresAt || undefined,
        createdAt: editingAnnouncement?.createdAt || new Date().toISOString(),
        createdBy: user.id,
      }

      await saveAnnouncement(announcement, user.id)
      const updated = await loadAllAnnouncements(user.id)
      setAnnouncements(updated)
      setAnnouncementForm({ message: "", type: "info", expiresAt: "" })
      setEditingAnnouncement(null)
      alert(getTranslation(language, "save_success"))
    } catch (error) {
      console.error("[v0] Failed to save announcement:", error)
      alert(getTranslation(language, "save_failed"))
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm(getTranslation(language, "confirm_delete"))) return

    try {
      await deleteAnnouncement(id)
      const updated = await loadAllAnnouncements(user!.id)
      setAnnouncements(updated)
      alert(getTranslation(language, "delete_success"))
    } catch (error) {
      console.error("[v0] Failed to delete announcement:", error)
      alert(getTranslation(language, "delete_failed"))
    }
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setAnnouncementForm({
      message: announcement.message,
      type: announcement.type,
      expiresAt: announcement.expiresAt || "",
    })
  }

  const backupRestoreTitle = getTranslation(language, "backup_restore_title")
  const backupDescription = getTranslation(language, "backup_description")
  const downloadBackupText = getTranslation(language, "export_data")
  const restoreBackupText = importing
    ? getTranslation(language, "restoring")
    : getTranslation(language, "restore_backup")
  const userGuideTitle = getTranslation(language, "user_guide_title")
  const openGuideText = getTranslation(language, "open_guide")
  const connectionStatusTitle = getTranslation(language, "connection_status_title")
  const connectionStatusLabel = getTranslation(language, "connection_label")
  const connectionStatusText = user
    ? `${getTranslation(language, "logged_in")}: ${user.email}`
    : getTranslation(language, "not_logged_in")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <Button variant="ghost" onClick={onLogout}>
        <ArrowLeft className="mr-2 h-4 w-4" /> {getTranslation(language, "back_to_forest")}
      </Button>

      <Card className="p-6 space-y-4 bg-card">
        <h2 className="text-xl font-bold">{backupRestoreTitle}</h2>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{backupDescription}</p>

          <div className="flex flex-col gap-2">
            <div className="relative">
              <Button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="gap-2 w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Download className="h-4 w-4" />
                {downloadBackupText}
              </Button>

              {showExportMenu && (
                <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 border rounded-lg shadow-lg py-1 z-10 backdrop-blur-sm">
                  <button
                    onClick={() => {
                      handleExport()
                      setShowExportMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileJson className="h-4 w-4" />
                    <span>{getTranslation(language, "json_format")}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV()
                      setShowExportMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{getTranslation(language, "csv_format")}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportExcel()
                      setShowExportMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>{getTranslation(language, "excel_format")}</span>
                  </button>
                </div>
              )}
            </div>

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="gap-2 w-full bg-green-600 hover:bg-green-700"
            >
              <Upload className="h-4 w-4" />
              {restoreBackupText}
            </Button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4 bg-card border-2 hover:border-emerald-500/50 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{getTranslation(language, "personal_information")}</h2>
          <Button onClick={() => setShowPersonalInfo(!showPersonalInfo)} variant="outline" size="sm">
            {showPersonalInfo ? getTranslation(language, "hide") : getTranslation(language, "view")}
          </Button>
        </div>

        {showPersonalInfo && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{getTranslation(language, "account_information")}</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">{getTranslation(language, "email")}:</span> {user?.email || "-"}
                </p>
                <p>
                  <span className="font-medium">{getTranslation(language, "user_id")}:</span>{" "}
                  {user?.id?.slice(0, 8) || "-"}
                  ...
                </p>
                <p>
                  <span className="font-medium">{getTranslation(language, "account_created")}:</span>{" "}
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{getTranslation(language, "change_email")}</h3>
              {!editingEmail ? (
                <Button onClick={() => setEditingEmail(true)} variant="outline" size="sm">
                  {getTranslation(language, "update_email")}
                </Button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={getTranslation(language, "new_email")}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={getTranslation(language, "enter_password")}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleEmailChange} disabled={isUpdating} size="sm" className="flex-1">
                      {isUpdating ? getTranslation(language, "updating") : getTranslation(language, "save")}
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingEmail(false)
                        setNewEmail("")
                        setPassword("")
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {getTranslation(language, "cancel")}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{getTranslation(language, "data_management")}</h3>
              <p className="text-xs text-muted-foreground">{getTranslation(language, "data_management_description")}</p>
              <p className="text-xs text-muted-foreground">
                {getTranslation(language, "view_data")}: {getTranslation(language, "data_export_description")}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-semibold text-sm">{getTranslation(language, "consent_history")}</h3>
              <p className="text-xs text-muted-foreground">{getTranslation(language, "consent_history_description")}</p>

              {loadingConsents ? (
                <p className="text-sm text-muted-foreground">{getTranslation(language, "loading")}</p>
              ) : consentLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">{getTranslation(language, "no_consent_logs")}</p>
              ) : (
                <div className="space-y-2">
                  {consentLogs.map((log, index) => (
                    <div key={index} className="bg-muted p-3 rounded-lg text-sm space-y-1">
                      <p className="font-medium">
                        {getTranslation(language, "agreed_on")}: {new Date(log.agreed_at).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getTranslation(language, "terms_agreed")}: {log.terms_version}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getTranslation(language, "privacy_agreed")}: {log.privacy_version}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-4 bg-card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{userGuideTitle}</h2>
          <Button onClick={() => setShowGuide(true)} variant="outline" className="gap-2">
            <BookOpen className="mr-2 h-4 w-4" />
            {openGuideText}
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4 bg-card">
        <h2 className="text-xl font-bold">{connectionStatusTitle}</h2>

        <div className="space-y-2">
          <h3 className="font-semibold">{connectionStatusLabel}</h3>
          <p className="text-sm text-muted-foreground">{connectionStatusText}</p>
        </div>
      </Card>

      <Card className="p-6 space-y-4 bg-card">
        <h2 className="text-xl font-bold">{getTranslation(language, "customer_support")}</h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{getTranslation(language, "customer_support_description")}</p>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-semibold">{getTranslation(language, "support_email")}</p>
            <a href="mailto:lee381111@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
              lee381111@gmail.com
            </a>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4 bg-card">
        <h2 className="text-xl font-bold">{getTranslation(language, "legal_information")}</h2>
        <div className="space-y-2">
          <a href="/privacy-policy" className="block text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
            {getTranslation(language, "privacy_policy")}
          </a>
          <a href="/terms-of-service" className="block text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
            {getTranslation(language, "terms_of_service")}
          </a>
        </div>
      </Card>

      <Card className="p-6 space-y-2 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
        <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
          {getTranslation(language, "app_developer")}
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">{getTranslation(language, "developer_info")}</p>
      </Card>

      <Card className="p-6 space-y-4 bg-card border-red-200 dark:border-red-900">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">{getTranslation(language, "danger_zone")}</h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{getTranslation(language, "account_deletion_warning")}</p>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {getTranslation(language, "delete_account")}
          </Button>
        </div>
      </Card>

      <Card>
        <CardContent className="p-6">
          <button
            onClick={() => setShowAnnouncementPanel(!showAnnouncementPanel)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold">{getTranslation(language, "announcement_management")}</h3>
            <ChevronDown className={`h-5 w-5 transition-transform ${showAnnouncementPanel ? "rotate-180" : ""}`} />
          </button>

          {showAnnouncementPanel && (
            <div className="mt-4 space-y-4">
              <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium">
                  {editingAnnouncement
                    ? getTranslation(language, "edit_announcement")
                    : getTranslation(language, "new_announcement")}
                </h4>

                <div>
                  <label className="text-sm font-medium">{getTranslation(language, "announcement_message")}</label>
                  <textarea
                    value={announcementForm.message}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-md"
                    rows={3}
                    placeholder={getTranslation(language, "announcement_message_placeholder")}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">{getTranslation(language, "announcement_type")}</label>
                  <select
                    value={announcementForm.type}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value as any })}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="info">{getTranslation(language, "type_info")}</option>
                    <option value="warning">{getTranslation(language, "type_warning")}</option>
                    <option value="success">{getTranslation(language, "type_success")}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">{getTranslation(language, "expires_at")}</label>
                  <input
                    type="date"
                    value={announcementForm.expiresAt}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, expiresAt: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveAnnouncement} className="bg-green-600 hover:bg-green-700">
                    {editingAnnouncement ? getTranslation(language, "update") : getTranslation(language, "save")}
                  </Button>
                  {editingAnnouncement && (
                    <Button
                      onClick={() => {
                        setEditingAnnouncement(null)
                        setAnnouncementForm({ message: "", type: "info", expiresAt: "" })
                      }}
                      variant="outline"
                    >
                      {getTranslation(language, "cancel")}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">{getTranslation(language, "active_announcements")}</h4>
                {announcements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{getTranslation(language, "no_announcements")}</p>
                ) : (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm flex-1">{announcement.message}</p>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEditAnnouncement(announcement)}>
                            {getTranslation(language, "edit")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            {getTranslation(language, "delete")}
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{announcement.type}</span>
                        {announcement.expiresAt && (
                          <span>
                            • {getTranslation(language, "expires")}:{" "}
                            {new Date(announcement.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>{getTranslation(language, "user_guide")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                {getTranslation(language, "app_introduction")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "app_introduction_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "notes")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "notes_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "diaries")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "diaries_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "schedules")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "schedules_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "travel_records")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "travel_records_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "vehicle_records")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "vehicle_records_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "health_records")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "health_records_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "budget")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "budget_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "business_cards")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "business_cards_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "weather")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "weather_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "radio")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "radio_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(language, "data_backup")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(language, "data_backup_description")}</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">
              {getTranslation(language, "delete_account_title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                {getTranslation(language, "delete_account_warning_title")}
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                <li>{getTranslation(language, "delete_warning_1")}</li>
                <li>{getTranslation(language, "delete_warning_2")}</li>
                <li>{getTranslation(language, "delete_warning_3")}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {getTranslation(language, "delete_account_confirm_instruction")}
              </label>
              <p className="text-sm text-muted-foreground mb-2">
                "{getTranslation(language, "delete_account_confirm_phrase")}"
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-slate-800"
                placeholder={getTranslation(language, "delete_account_confirm_phrase")}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowDeleteDialog(false)
                  setDeleteConfirmText("")
                }}
                variant="outline"
                className="flex-1"
                disabled={isDeleting}
              >
                {getTranslation(language, "cancel")}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="flex-1"
                disabled={isDeleting || deleteConfirmText !== getTranslation(language, "delete_account_confirm_phrase")}
              >
                {isDeleting ? getTranslation(language, "deleting") : getTranslation(language, "delete_permanently")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
