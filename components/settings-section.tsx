"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Upload, BookOpen, CheckCircle2, FileJson, FileSpreadsheet, FileText } from "lucide-react"
import { exportAllData, importAllData } from "@/lib/storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/types"

export function SettingsSection({ onBack, language }: { onBack: () => void; language: string }) {
  const { user } = useAuth()
  const [importing, setImporting] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      alert("로그인이 필요합니다")
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

      alert("CSV 파일이 다운로드되었습니다")
    } catch (err) {
      console.error("[v0] CSV export error:", err)
      alert("CSV 내보내기 실패")
    }
  }

  const handleExportExcel = async () => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
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

      alert("Excel 파일이 다운로드되었습니다")
    } catch (err) {
      console.error("[v0] Excel export error:", err)
      alert("Excel 내보내기 실패")
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

  const lang = language as Language

  const backupRestoreTitle = getTranslation(lang, "backup_restore_title")
  const backupDescription =
    language === "ko"
      ? "데이터를 JSON, CSV, Excel 형식으로 내보낼 수 있습니다. JSON 형식으로만 복원 가능합니다."
      : language === "ja"
        ? "データをJSON、CSV、Excel形式でエクスポートできます。JSON形式のみ復元可能です。"
        : language === "zh"
          ? "可以将数据导出为JSON、CSV、Excel格式。只能用JSON格式恢复。"
          : "Export data in JSON, CSV, or Excel format. Only JSON can be restored."
  const downloadBackupText =
    language === "ko"
      ? "데이터 내보내기"
      : language === "en"
        ? "Export Data"
        : language === "zh"
          ? "导出数据"
          : "データエクスポート"
  const restoreBackupText = importing ? getTranslation(lang, "restoring") : getTranslation(lang, "restore_backup")
  const userGuideTitle = getTranslation(lang, "user_guide_title")
  const openGuideText = getTranslation(lang, "open_guide")
  const connectionStatusTitle = getTranslation(lang, "connection_status_title")
  const connectionStatusLabel = getTranslation(lang, "connection_label")
  const connectionStatusText = user
    ? `${getTranslation(lang, "logged_in")}: ${user.email}`
    : getTranslation(lang, "not_logged_in")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> {getTranslation(lang, "back_to_forest")}
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
                <div className="absolute top-full mt-1 w-full bg-card border rounded-lg shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      handleExport()
                      setShowExportMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileJson className="h-4 w-4" />
                    <span>JSON 형식 (복원 가능)</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV()
                      setShowExportMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>CSV 형식 (읽기 전용)</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportExcel()
                      setShowExportMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Excel 형식 (읽기 전용)</span>
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

      <Card className="p-6 space-y-2 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
        <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
          {language === "ko"
            ? "앱 개발자"
            : language === "ja"
              ? "アプリ開発者"
              : language === "zh"
                ? "应用开发者"
                : "App Developer"}
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {language === "ko"
            ? "경기도 김포시 장기동 이찬세"
            : language === "ja"
              ? "京畿道金浦市長期洞 イ・チャンセ"
              : language === "zh"
                ? "京畿道金浦市长期洞 李赞世"
                : "Lee Chan-se, Janggi-dong, Gimpo-si, Gyeonggi-do"}
        </p>
      </Card>

      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>{getTranslation(lang, "user_guide")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                기록의 숲 소개
              </h3>
              <p className="text-muted-foreground">
                기록의 숲은 일상의 모든 기록을 한 곳에서 관리할 수 있는 통합 노트 앱입니다. 노트, 일기, 일정부터 여행,
                차량, 건강 기록까지 다양한 섹션을 제공합니다.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(lang, "notes")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(lang, "notes_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(lang, "diaries")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(lang, "diaries_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(lang, "schedules")}
              </h3>
              <p className="text-muted-foreground">
                일정을 등록하면 메인 화면의 캘린더에 자동으로 표시됩니다. 알림 기능을 활성화하여 중요한 일정을 놓치지
                마세요.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(lang, "travel_records")}
              </h3>
              <p className="text-muted-foreground">
                여행지를 입력하면 지도에 빨간 점으로 자동 표시됩니다. 사진, 동영상, 음성 메모를 첨부하여 여행의 추억을
                생생하게 보관하세요.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(lang, "vehicle_records")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(lang, "vehicle_records_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(lang, "health_records")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(lang, "health_records_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {language === "ko" ? "가계부" : language === "ja" ? "家計簿" : language === "zh" ? "账本" : "Budget"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ko"
                  ? "수입과 지출을 기록하고 월별 통계를 확인하세요. 차량정비, 건강기록, 여행 비용이 자동으로 가계부에 연동됩니다."
                  : language === "ja"
                    ? "収入と支出を記録し、月別統計を確認してください。車両整備、健康記録、旅行費用が自動的に家計簿に連動されます。"
                    : language === "zh"
                      ? "记录收入和支出，查看月度统计。车辆维修、健康记录和旅行费用自动同步到账本。"
                      : "Track income and expenses with monthly statistics. Vehicle maintenance, health costs, and travel expenses sync automatically."}
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {language === "ko"
                  ? "명함 관리"
                  : language === "ja"
                    ? "名刺管理"
                    : language === "zh"
                      ? "名片管理"
                      : "Business Cards"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ko"
                  ? "명함을 촬영하거나 수동으로 입력하여 연락처를 체계적으로 관리하세요. 사진, 회사명, 직책 등을 함께 저장할 수 있습니다."
                  : language === "ja"
                    ? "名刺を撮影または手動入力して連絡先を体系的に管理してください。写真、会社名、役職などを一緒に保存できます。"
                    : language === "zh"
                      ? "拍摄或手动输入名片，系统化管理联系人。可以保存照片、公司名称、职位等信息。"
                      : "Capture or manually enter business cards to manage contacts systematically. Save photos, company names, titles, and more."}
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(lang, "weather")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(lang, "weather_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(lang, "radio")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(lang, "radio_description")}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTranslation(lang, "data_backup")}
              </h3>
              <p className="text-muted-foreground">{getTranslation(lang, "data_backup_description")}</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
