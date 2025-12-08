"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
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
  Shield,
  ExternalLink,
} from "lucide-react"
import { exportAllData, importAllData, loadAllAnnouncements, saveAnnouncement, deleteAnnouncement } from "@/lib/storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTranslation } from "@/lib/i18n"
import type { Language, Announcement } from "@/lib/types"
import { useRouter } from "next/navigation" // Added for admin page navigation
import { StorageQuotaCard } from "./storage-quota-card" // Import storage quota card

export function SettingsSection({ onBack, language }: { onBack: () => void; language: string }) {
  const { user } = useAuth()
  const router = useRouter() // Added router for navigation
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
  const [currentLanguage, setLanguage] = useState(language)

  const handleExport = async () => {
    if (!user?.id) {
      const lang = currentLanguage as Language
      const msg = getTranslation(lang, "not_logged_in")
      alert(msg)
      return
    }

    try {
      await exportAllData(user.id)
      const lang = currentLanguage as Language
      const msg = getTranslation(lang, "backup_downloaded")
      alert(msg)
    } catch (err) {
      console.error("[v0] Export error:", err)
      const lang = currentLanguage as Language
      const msg = getTranslation(lang, "backup_error")
      alert(msg)
    }
  }

  const handleExportCSV = async () => {
    if (!user?.id) {
      const lang = currentLanguage as Language
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

      const lang = currentLanguage as Language
      alert(getTranslation(lang, "csv_downloaded"))
    } catch (err) {
      console.error("[v0] CSV export error:", err)
      const lang = currentLanguage as Language
      alert(getTranslation(lang, "csv_export_failed"))
    }
  }

  const handleExportExcel = async () => {
    if (!user?.id) {
      const lang = currentLanguage as Language
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

      const lang = currentLanguage as Language
      alert(getTranslation(lang, "excel_downloaded"))
    } catch (err) {
      console.error("[v0] Excel export error:", err)
      const lang = currentLanguage as Language
      alert(getTranslation(lang, "excel_export_failed"))
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!user?.id) {
      const lang = currentLanguage as Language
      const msg = getTranslation(lang, "not_logged_in")
      alert(msg)
      return
    }

    setImporting(true)
    try {
      await importAllData(file, user.id)
      const lang = currentLanguage as Language
      const msg = getTranslation(lang, "restore_success")
      alert(msg)
      window.location.reload()
    } catch (err) {
      console.error("[v0] Import error:", err)
      const lang = currentLanguage as Language
      const msg = getTranslation(lang, "restore_error")
      alert(msg)
    } finally {
      setImporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      const lang = currentLanguage as Language
      alert(getTranslation(lang, "not_logged_in"))
      return
    }

    const lang = currentLanguage as Language
    const confirmPhrase = getTranslation(lang, "delete_account_confirm_phrase")

    if (deleteConfirmText !== confirmPhrase) {
      alert(getTranslation(lang, "delete_account_phrase_mismatch"))
      return
    }

    setIsDeleting(true)
    try {
      const { createClient } = await import("@/lib/supabase")
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
      const lang = currentLanguage as Language
      alert(getTranslation(lang, "account_deletion_failed"))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateEmail = async () => {
    if (!user?.id || !newEmail || !password) {
      const lang = currentLanguage as Language
      alert(getTranslation(lang, "fill_all_fields"))
      return
    }

    setIsUpdating(true)
    try {
      const { createClient } = await import("@/lib/supabase")
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        email: newEmail,
        password: password,
      })

      if (error) throw error

      const lang = currentLanguage as Language
      alert(getTranslation(lang, "email_updated_success"))
      setEditingEmail(false)
      setNewEmail("")
      setPassword("")
    } catch (err) {
      console.error("[v0] Email update error:", err)
      const lang = currentLanguage as Language
      alert(getTranslation(lang, "email_update_error"))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEmailChange = async () => {
    if (!user?.id || !newEmail || !password) {
      const lang = currentLanguage as Language
      alert(getTranslation(lang, "fill_all_fields"))
      return
    }

    setIsUpdating(true)
    try {
      const { createClient } = await import("@/lib/supabase")
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        email: newEmail,
        password: password,
      })

      if (error) throw error

      const lang = currentLanguage as Language
      alert(getTranslation(lang, "email_updated_success"))
      setEditingEmail(false)
      setNewEmail("")
      setPassword("")
    } catch (err) {
      console.error("[v0] Email update error:", err)
      const lang = currentLanguage as Language
      alert(getTranslation(lang, "email_update_error"))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: lang } }))
  }

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
      alert(getTranslation(currentLanguage, "save_success"))
    } catch (error) {
      console.error("[v0] Failed to save announcement:", error)
      alert(getTranslation(currentLanguage, "save_failed"))
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm(getTranslation(currentLanguage, "confirm_delete"))) return

    try {
      await deleteAnnouncement(id)
      const updated = await loadAllAnnouncements(user!.id)
      setAnnouncements(updated)
      alert(getTranslation(currentLanguage, "delete_success"))
    } catch (error) {
      console.error("[v0] Failed to delete announcement:", error)
      alert(getTranslation(currentLanguage, "delete_failed"))
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

  const backupRestoreTitle = getTranslation(currentLanguage, "backup_restore_title")
  const backupDescription = getTranslation(currentLanguage, "backup_description")
  const downloadBackupText = getTranslation(currentLanguage, "export_data")
  const restoreBackupText = importing
    ? getTranslation(currentLanguage, "restoring")
    : getTranslation(currentLanguage, "restore_backup")
  const userGuideTitle = getTranslation(currentLanguage, "user_guide_title")
  const openGuideText = getTranslation(currentLanguage, "open_guide")
  const connectionStatusTitle = getTranslation(currentLanguage, "connection_status_title")
  const connectionStatusLabel = getTranslation(currentLanguage, "connection_label")
  const connectionStatusText = user
    ? `${getTranslation(currentLanguage, "logged_in")}: ${user.email}`
    : getTranslation(currentLanguage, "not_logged_in")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> {getTranslation(currentLanguage, "back_to_forest")}
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
                    <span>{getTranslation(currentLanguage, "json_format")}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV()
                      setShowExportMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{getTranslation(currentLanguage, "csv_format")}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportExcel()
                      setShowExportMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>{getTranslation(currentLanguage, "excel_format")}</span>
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
          <h2 className="text-xl font-bold">{getTranslation(currentLanguage, "personal_information")}</h2>
          <Button onClick={() => setShowPersonalInfo(!showPersonalInfo)} variant="outline" size="sm">
            {showPersonalInfo ? getTranslation(currentLanguage, "hide") : getTranslation(currentLanguage, "view")}
          </Button>
        </div>

        {showPersonalInfo && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{getTranslation(currentLanguage, "account_information")}</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">{getTranslation(currentLanguage, "email")}:</span> {user?.email || "-"}
                </p>
                <p>
                  <span className="font-medium">{getTranslation(currentLanguage, "user_id")}:</span>{" "}
                  {user?.id?.slice(0, 8) || "-"}
                  ...
                </p>
                <p>
                  <span className="font-medium">{getTranslation(currentLanguage, "account_created")}:</span>{" "}
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{getTranslation(currentLanguage, "change_email")}</h3>
              {!editingEmail ? (
                <Button onClick={() => setEditingEmail(true)} variant="outline" size="sm">
                  {getTranslation(currentLanguage, "update_email")}
                </Button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={getTranslation(currentLanguage, "new_email")}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={getTranslation(currentLanguage, "enter_password")}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleEmailChange} disabled={isUpdating} size="sm" className="flex-1">
                      {isUpdating
                        ? getTranslation(currentLanguage, "updating")
                        : getTranslation(currentLanguage, "save")}
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
                      {getTranslation(currentLanguage, "cancel")}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{getTranslation(currentLanguage, "data_management")}</h3>
              <p className="text-xs text-muted-foreground">
                {getTranslation(currentLanguage, "data_management_description")}
              </p>
              <p className="text-xs text-muted-foreground">
                {getTranslation(currentLanguage, "view_data")}:{" "}
                {getTranslation(currentLanguage, "data_export_description")}
              </p>
            </div>
          </div>
        )}
      </Card>

      {user && <StorageQuotaCard userId={user.id} language={currentLanguage} />}

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

      {user.email === "lee381111@gmail.com" && (
        <Card className="p-6 space-y-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">관리자 전용</h2>
          </div>
          <p className="text-sm text-muted-foreground">약관 동의 로그 및 개인정보 파기 대장을 관리할 수 있습니다.</p>
          <Button
            onClick={() => router.push("/admin/consents")}
            variant="outline"
            className="w-full border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-950/50"
          >
            관리자 페이지 열기
          </Button>
        </Card>
      )}

      <Card className="p-6 space-y-2 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
          {getTranslation(currentLanguage, "app_developer")}
        </h2>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {getTranslation(currentLanguage, "developer_info")}
        </p>
      </Card>

      <Card className="p-6 space-y-2 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {getTranslation(currentLanguage, "app_designer")}
        </h2>
        <p className="text-sm text-blue-700 dark:text-blue-300">{getTranslation(currentLanguage, "designer_info")}</p>
      </Card>

      <Card className="p-6 space-y-4 bg-card">
        <h2 className="text-xl font-bold">{getTranslation(currentLanguage, "legal_information")}</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <h3 className="font-semibold">{getTranslation(currentLanguage, "privacy_policy")}</h3>
              <p className="text-sm text-muted-foreground">
                {getTranslation(currentLanguage, "privacy_policy_description")}
              </p>
            </div>
            <Button
              onClick={() => router.push(`/privacy-policy?lang=${currentLanguage}`)}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              {getTranslation(currentLanguage, "view")}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <h3 className="font-semibold">{getTranslation(currentLanguage, "terms_of_service")}</h3>
              <p className="text-sm text-muted-foreground">
                {getTranslation(currentLanguage, "terms_of_service_description")}
              </p>
            </div>
            <Button
              onClick={() => router.push(`/terms-of-service?lang=${currentLanguage}`)}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              {getTranslation(currentLanguage, "view")}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4 bg-card border-red-200 dark:border-red-900">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
          {getTranslation(currentLanguage, "danger_zone")}
        </h2>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{getTranslation(currentLanguage, "account_deletion_warning")}</p>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {getTranslation(currentLanguage, "delete_account")}
          </Button>
        </div>
      </Card>

      <Card>
        <CardContent className="p-6">
          <button
            onClick={() => setShowAnnouncementPanel(!showAnnouncementPanel)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold">{getTranslation(currentLanguage, "announcement_management")}</h3>
            <ChevronDown className={`h-5 w-5 transition-transform ${showAnnouncementPanel ? "rotate-180" : ""}`} />
          </button>

          {showAnnouncementPanel && (
            <div className="mt-4 space-y-4">
              <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium">
                  {editingAnnouncement
                    ? getTranslation(currentLanguage, "edit_announcement")
                    : getTranslation(currentLanguage, "new_announcement")}
                </h4>

                <div>
                  <label className="text-sm font-medium">
                    {getTranslation(currentLanguage, "announcement_message")}
                  </label>
                  <textarea
                    value={announcementForm.message}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-md"
                    rows={3}
                    placeholder={getTranslation(currentLanguage, "announcement_message_placeholder")}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">{getTranslation(currentLanguage, "announcement_type")}</label>
                  <select
                    value={announcementForm.type}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value as any })}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="info">{getTranslation(currentLanguage, "type_info")}</option>
                    <option value="warning">{getTranslation(currentLanguage, "type_warning")}</option>
                    <option value="success">{getTranslation(currentLanguage, "type_success")}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">{getTranslation(currentLanguage, "expires_at")}</label>
                  <input
                    type="date"
                    value={announcementForm.expiresAt}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, expiresAt: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveAnnouncement} className="bg-green-600 hover:bg-green-700">
                    {editingAnnouncement
                      ? getTranslation(currentLanguage, "update")
                      : getTranslation(currentLanguage, "save")}
                  </Button>
                  {editingAnnouncement && (
                    <Button
                      onClick={() => {
                        setEditingAnnouncement(null)
                        setAnnouncementForm({ message: "", type: "info", expiresAt: "" })
                      }}
                      variant="outline"
                    >
                      {getTranslation(currentLanguage, "cancel")}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">{getTranslation(currentLanguage, "active_announcements")}</h4>
                {announcements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{getTranslation(currentLanguage, "no_announcements")}</p>
                ) : (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm flex-1">{announcement.message}</p>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEditAnnouncement(announcement)}>
                            {getTranslation(currentLanguage, "edit")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            {getTranslation(currentLanguage, "delete")}
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{announcement.type}</span>
                        {announcement.expiresAt && (
                          <span>
                            • {getTranslation(currentLanguage, "expires")}:{" "}
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
            <DialogTitle>{getTranslation(currentLanguage, "user_guide")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                {getTranslation(currentLanguage, "app_introduction")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "app_introduction_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "notes")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "notes_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "diaries")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "diaries_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "schedules")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "schedules_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "travel_records")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "travel_records_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "vehicle_records")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "vehicle_records_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "health_records")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "health_records_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "budget")}
              </h3>
              <p className="text-sm text-muted-foreground">{getTranslation(currentLanguage, "budget_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "business_cards")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "business_cards_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "weather")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "weather_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "radio")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(currentLanguage, "radio_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(currentLanguage, "data_backup")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {getTranslation(currentLanguage, "data_backup_description")}
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">
              {getTranslation(currentLanguage, "delete_account_title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                {getTranslation(currentLanguage, "delete_account_warning_title")}
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                <li>{getTranslation(currentLanguage, "delete_warning_1")}</li>
                <li>{getTranslation(currentLanguage, "delete_warning_2")}</li>
                <li>{getTranslation(currentLanguage, "delete_warning_3")}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {getTranslation(currentLanguage, "delete_account_confirm_instruction")}
              </label>
              <p className="text-sm text-muted-foreground mb-2">
                "{getTranslation(currentLanguage, "delete_account_confirm_phrase")}"
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-slate-800"
                placeholder={getTranslation(currentLanguage, "delete_account_confirm_phrase")}
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
                {getTranslation(currentLanguage, "cancel")}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="flex-1"
                disabled={
                  isDeleting || deleteConfirmText !== getTranslation(currentLanguage, "delete_account_confirm_phrase")
                }
              >
                {isDeleting
                  ? getTranslation(currentLanguage, "deleting")
                  : getTranslation(currentLanguage, "delete_permanently")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
