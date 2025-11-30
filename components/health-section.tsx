"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, TrendingUp, Pill, Bell, Pencil } from "lucide-react"
import { saveHealthRecords, loadHealthRecords, saveMedications, loadMedications } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import type { HealthRecord, Medication, Attachment } from "@/lib/types"
import { MediaTools } from "@/components/media-tools"
import { Spinner } from "@/components/ui/spinner"
import { getTranslation } from "@/lib/i18n"
import {
  cancelNotification,
  setupMedicationAlarms,
  getMedicationCompletions,
  toggleMedicationCompletion,
} from "@/lib/notification-manager"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface HealthSectionProps {
  onBack: () => void
  language: string
}

type ViewMode = "list" | "add_record" | "medications" | "add_medication" | "charts"

export function HealthSection({ onBack, language }: HealthSectionProps) {
  const { user } = useAuth()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingMedId, setEditingMedId] = useState<string | null>(null)
  const [medicationCompletions, setMedicationCompletions] = useState<Record<string, string[]>>({})

  const [formData, setFormData] = useState<{
    date: string
    type: "vital_signs" | "medication" | "expense" | "exercise"
    systolic: string
    diastolic: string
    bloodSugar: string
    temperature: string
    weight: string
    steps: string
    distance: string
    medicalExpense: string
    medicationExpense: string
    notes: string
    attachments: Attachment[]
  }>({
    date: new Date().toISOString().split("T")[0],
    type: "vital_signs",
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    temperature: "",
    weight: "",
    steps: "",
    distance: "",
    medicalExpense: "",
    medicationExpense: "",
    notes: "",
    attachments: [],
  })

  const [medFormData, setMedFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    times: [""],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
    alarmEnabled: true,
    attachments: [] as Attachment[],
  })

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      console.log("[v0] 건강 섹션: 데이터 로드 시작")
      const [healthData, medData] = await Promise.all([loadHealthRecords(user.id), loadMedications(user.id)])
      console.log("[v0] 건강 기록 로드됨:", healthData.length, "개")
      console.log("[v0] 복약 기록 로드됨:", medData.length, "개")
      setRecords(healthData)
      setMedications(medData)

      setupMedicationAlarms(medData)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRecord = async (attachments: Attachment[]) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!formData.date) {
      alert("날짜를 입력해주세요")
      return
    }

    try {
      setSaving(true)

      let updated: HealthRecord[]
      if (editingId) {
        console.log("[v0] 건강 기록 수정:", editingId)
        updated = records.map((r) =>
          r.id === editingId
            ? {
                ...r,
                date: formData.date,
                type: formData.type,
                bloodPressure:
                  formData.systolic && formData.diastolic
                    ? { systolic: Number(formData.systolic), diastolic: Number(formData.diastolic) }
                    : undefined,
                bloodSugar: formData.bloodSugar ? Number(formData.bloodSugar) : undefined,
                temperature: formData.temperature ? Number(formData.temperature) : undefined,
                weight: formData.weight ? Number(formData.weight) : undefined,
                steps: formData.steps ? Number(formData.steps) : undefined,
                distance: formData.distance ? Number(formData.distance) : undefined,
                medicalExpense: formData.medicalExpense ? Number(formData.medicalExpense) : undefined,
                medicationExpense: formData.medicationExpense ? Number(formData.medicationExpense) : undefined,
                notes: formData.notes,
                attachments,
              }
            : r,
        )
      } else {
        console.log("[v0] 새 건강 기록 추가")
        const record: HealthRecord = {
          id: crypto.randomUUID(),
          date: formData.date,
          type: formData.type,
          bloodPressure:
            formData.systolic && formData.diastolic
              ? { systolic: Number(formData.systolic), diastolic: Number(formData.diastolic) }
              : undefined,
          bloodSugar: formData.bloodSugar ? Number(formData.bloodSugar) : undefined,
          temperature: formData.temperature ? Number(formData.temperature) : undefined,
          weight: formData.weight ? Number(formData.weight) : undefined,
          steps: formData.steps ? Number(formData.steps) : undefined,
          distance: formData.distance ? Number(formData.distance) : undefined,
          medicalExpense: formData.medicalExpense ? Number(formData.medicalExpense) : undefined,
          medicationExpense: formData.medicationExpense ? Number(formData.medicationExpense) : undefined,
          notes: formData.notes,
          attachments,
          createdAt: new Date().toISOString(),
          user_id: user.id,
        }
        updated = [record, ...records]
      }

      console.log("[v0] 저장할 건강 기록 수:", updated.length)
      setRecords(updated)
      await saveHealthRecords(updated, user.id)
      console.log("[v0] 건강 기록 저장 완료")

      setViewMode("list")
      setEditingId(null)
      resetForm()
      alert("건강 기록이 저장되었습니다!")
    } catch (error) {
      console.error("[v0] 건강 기록 저장 에러:", error)
      alert("저장 중 오류가 발생했습니다")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveMedication = async () => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!medFormData.name || medFormData.times.length === 0) {
      alert("약 이름과 복용 시간을 입력해주세요")
      return
    }

    try {
      setSaving(true)

      let updated: Medication[]
      if (editingMedId) {
        console.log("[v0] 복약 일정 수정:", editingMedId)
        // Cancel old alarms
        const oldMed = medications.find((m) => m.id === editingMedId)
        if (oldMed) {
          oldMed.times.forEach((time) => {
            cancelNotification(`med_${editingMedId}_${time}`)
          })
        }

        // Update existing medication
        updated = medications.map((m) =>
          m.id === editingMedId
            ? {
                ...m,
                name: medFormData.name,
                dosage: medFormData.dosage,
                frequency: medFormData.frequency,
                times: medFormData.times.filter((t) => t),
                startDate: medFormData.startDate,
                endDate: medFormData.endDate,
                notes: medFormData.notes,
                alarmEnabled: medFormData.alarmEnabled,
                attachments: medFormData.attachments || [],
              }
            : m,
        )
      } else {
        console.log("[v0] 새 복약 일정 추가")
        const medication: Medication = {
          id: crypto.randomUUID(),
          name: medFormData.name,
          dosage: medFormData.dosage,
          frequency: medFormData.frequency,
          times: medFormData.times.filter((t) => t),
          startDate: medFormData.startDate,
          endDate: medFormData.endDate,
          notes: medFormData.notes,
          alarmEnabled: medFormData.alarmEnabled,
          isActive: true,
          createdAt: new Date().toISOString(),
          user_id: user.id,
          attachments: medFormData.attachments || [],
        }
        updated = [medication, ...medications]
      }

      console.log("[v0] 저장할 복약 일정 수:", updated.length)
      setMedications(updated)
      await saveMedications(updated, user.id)
      console.log("[v0] 복약 일정 저장 완료")

      // Setup alarms for all medications
      setupMedicationAlarms(updated)

      setViewMode("medications")
      setEditingMedId(null)
      resetMedForm()
      alert("복약 일정이 저장되었습니다!")
    } catch (error) {
      console.error("[v0] 복약 일정 저장 에러:", error)
      alert("저장 중 오류가 발생했습니다")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!confirm("이 기록을 삭제하시겠습니까?")) return

    try {
      const updated = records.filter((r) => r.id !== id)
      setRecords(updated)
      await saveHealthRecords(updated, user.id)
      alert("삭제되었습니다")
    } catch (error) {
      console.error("Error deleting record:", error)
      alert("삭제 중 오류가 발생했습니다")
    }
  }

  const handleDeleteMedication = async (id: string) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!confirm("이 복약 일정을 삭제하시겠습니까?")) return

    try {
      const med = medications.find((m) => m.id === id)
      if (med) {
        // Cancel alarms
        med.times.forEach((time) => {
          cancelNotification(`med_${id}_${time}`)
        })
      }

      const updated = medications.filter((m) => m.id !== id)
      setMedications(updated)
      await saveMedications(updated, user.id)
      alert("삭제되었습니다")
    } catch (error) {
      console.error("Error deleting medication:", error)
      alert("삭제 중 오류가 발생했습니다")
    }
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type: "vital_signs",
      systolic: "",
      diastolic: "",
      bloodSugar: "",
      temperature: "",
      weight: "",
      steps: "",
      distance: "",
      medicalExpense: "",
      medicationExpense: "",
      notes: "",
      attachments: [],
    })
  }

  const resetMedForm = () => {
    setMedFormData({
      name: "",
      dosage: "",
      frequency: "",
      times: [""],
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      notes: "",
      alarmEnabled: true,
      attachments: [],
    })
  }

  const handleAttachmentsChange = (attachments: Attachment[]) => {
    setFormData({ ...formData, attachments })
  }

  const handleMedAttachmentsChange = (attachments: Attachment[]) => {
    setMedFormData({ ...medFormData, attachments })
  }

  const handleRecordTranscript = (text: string) => {
    setFormData({ ...formData, notes: formData.notes + text })
  }

  const handleMedicationTranscript = (text: string) => {
    setMedFormData({ ...medFormData, notes: medFormData.notes + text })
  }

  const getChartData = () => {
    const sortedRecords = [...records]
      .filter((r) => r.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30) // Last 30 records

    return sortedRecords.map((r) => ({
      date: r.date,
      systolic: r.bloodPressure?.systolic,
      diastolic: r.bloodPressure?.diastolic,
      bloodSugar: r.bloodSugar,
      weight: r.weight,
      temperature: r.temperature,
      steps: r.steps,
      distance: r.distance,
    }))
  }

  const getMedicationExpenseData = () => {
    const sortedRecords = [...records]
      .filter((r) => r.date && (r.medicalExpense || r.medicationExpense))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30)

    return sortedRecords.map((r) => ({
      date: r.date,
      medicalExpense: r.medicalExpense,
      medicationExpense: r.medicationExpense,
      total: (r.medicalExpense || 0) + (r.medicationExpense || 0),
    }))
  }

  const t = (key: string) => getTranslation(language as any, key)

  useEffect(() => {
    const handleStorageChange = () => {
      // Reload completion data
      const today = new Date().toISOString().split("T")[0]
      const newCompletions: Record<string, string[]> = {}
      medications.forEach((med) => {
        newCompletions[med.id] = getMedicationCompletions(med.id, today)
      })
      setMedicationCompletions(newCompletions)
    }

    window.addEventListener("storage", handleStorageChange)
    handleStorageChange() // Initial load

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [medications])

  const handleEditMedication = (med: Medication) => {
    setMedFormData({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      times: med.times,
      startDate: med.startDate,
      endDate: med.endDate || "",
      notes: med.notes || "",
      alarmEnabled: med.alarmEnabled,
      attachments: med.attachments || [],
    })
    setEditingMedId(med.id)
    setViewMode("add_medication")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    )
  }

  if (viewMode === "add_record") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setViewMode("list")
            resetForm()
            setEditingId(null)
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> 취소
        </Button>
        <h2 className="text-xl font-bold">건강 기록 추가</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">날짜</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium">기록 유형</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
            >
              <option value="vital_signs">생체 징후</option>
              <option value="exercise">운동</option>
              <option value="expense">의료비</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">수축기 혈압 (mmHg)</label>
              <Input
                type="number"
                placeholder="120"
                value={formData.systolic}
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">이완기 혈압 (mmHg)</label>
              <Input
                type="number"
                placeholder="80"
                value={formData.diastolic}
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">혈당 (mg/dL)</label>
            <Input
              type="number"
              placeholder="100"
              value={formData.bloodSugar}
              onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">체온 (°C)</label>
            <Input
              type="number"
              step="0.1"
              placeholder="36.5"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">몸무게 (kg)</label>
            <Input
              type="number"
              step="0.1"
              placeholder="70.5"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">걸음수</label>
            <Input
              type="number"
              placeholder="10000"
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">걸은 거리 (km)</label>
            <Input
              type="number"
              step="0.1"
              placeholder="5.2"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">의료비 (원)</label>
            <Input
              type="number"
              placeholder="50000"
              value={formData.medicalExpense}
              onChange={(e) => setFormData({ ...formData, medicalExpense: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">약값 (원)</label>
            <Input
              type="number"
              placeholder="20000"
              value={formData.medicationExpense}
              onChange={(e) => setFormData({ ...formData, medicationExpense: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">메모</label>
            <Input
              placeholder="추가 메모"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <MediaTools
            attachments={formData.attachments || []}
            onAttachmentsChange={handleAttachmentsChange}
            onSave={(attachments) => handleSaveRecord(attachments)}
            saving={saving}
            onTextFromSpeech={handleRecordTranscript}
          />
        </div>
      </div>
    )
  }

  if (viewMode === "add_medication") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setViewMode("medications")
            resetMedForm()
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> 취소
        </Button>
        <h2 className="text-xl font-bold">복약 일정 추가</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">약 이름 *</label>
            <Input
              placeholder="예: 아스피린"
              value={medFormData.name}
              onChange={(e) => setMedFormData({ ...medFormData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">용량</label>
            <Input
              placeholder="예: 100mg"
              value={medFormData.dosage}
              onChange={(e) => setMedFormData({ ...medFormData, dosage: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">복용 주기</label>
            <Input
              placeholder="예: 하루 3회"
              value={medFormData.frequency}
              onChange={(e) => setMedFormData({ ...medFormData, frequency: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">복용 시간 *</label>
            {medFormData.times.map((time, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const newTimes = [...medFormData.times]
                    newTimes[idx] = e.target.value
                    setMedFormData({ ...medFormData, times: newTimes })
                  }}
                  className="flex-1 p-2 border rounded bg-white/50 dark:bg-slate-800/50"
                />
                {idx > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const newTimes = medFormData.times.filter((_, i) => i !== idx)
                      setMedFormData({ ...medFormData, times: newTimes })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMedFormData({ ...medFormData, times: [...medFormData.times, ""] })}
            >
              <Plus className="w-4 h-4 mr-2" /> 시간 추가
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">시작일</label>
              <input
                type="date"
                value={medFormData.startDate}
                onChange={(e) => setMedFormData({ ...medFormData, startDate: e.target.value })}
                className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">종료일 (선택)</label>
              <input
                type="date"
                value={medFormData.endDate}
                onChange={(e) => setMedFormData({ ...medFormData, endDate: e.target.value })}
                className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">메모</label>
            <Input
              placeholder="추가 메모"
              value={medFormData.notes}
              onChange={(e) => setMedFormData({ ...medFormData, notes: e.target.value })}
            />
          </div>

          <MediaTools
            attachments={medFormData.attachments || []}
            onAttachmentsChange={handleMedAttachmentsChange}
            onSave={handleSaveMedication}
            saving={saving}
            saveButtonText="복약 일정 저장"
            onTextFromSpeech={handleMedicationTranscript}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="alarm"
              checked={medFormData.alarmEnabled}
              onChange={(e) => setMedFormData({ ...medFormData, alarmEnabled: e.target.checked })}
            />
            <label htmlFor="alarm" className="text-sm">
              <Bell className="inline w-4 h-4 mr-1" />
              알람 설정
            </label>
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === "medications") {
    const today = new Date().toISOString().split("T")[0]

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setViewMode("list")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 뒤로
          </Button>
          <Button
            onClick={() => {
              resetMedForm()
              setEditingMedId(null)
              setViewMode("add_medication")
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> 복약 추가
          </Button>
        </div>

        <h2 className="text-xl font-bold">💊 복약 관리</h2>

        <div className="grid gap-4">
          {medications
            .filter((m) => m.isActive)
            .map((med) => {
              const completedTimes = medicationCompletions[med.id] || []

              return (
                <Card key={med.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Pill className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold">{med.name}</span>
                        {med.alarmEnabled && <Bell className="w-4 h-4 text-green-500" />}
                      </div>
                      {med.dosage && <p className="text-sm mt-1">용량: {med.dosage}</p>}
                      {med.frequency && <p className="text-sm">주기: {med.frequency}</p>}

                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium">오늘의 복용 시간:</p>
                        {med.times.map((time) => (
                          <div key={time} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`${med.id}_${time}`}
                              checked={completedTimes.includes(time)}
                              onChange={() => toggleMedicationCompletion(med.id, time, today)}
                              className="w-4 h-4"
                            />
                            <label htmlFor={`${med.id}_${time}`} className="text-sm">
                              {time} {completedTimes.includes(time) && "✓"}
                            </label>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">
                        {med.startDate} ~ {med.endDate || "계속"}
                      </p>
                      {med.notes && <p className="text-sm mt-1">{med.notes}</p>}

                      {med.attachments && med.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-medium">첨부파일 ({med.attachments.length}개)</p>
                          <div className="grid grid-cols-2 gap-2">
                            {med.attachments.map((file: any, idx: number) => {
                              if (file.type?.startsWith("image/") || file.type === "image" || file.type === "drawing") {
                                return (
                                  <div key={idx} className="relative border rounded overflow-hidden">
                                    <img
                                      src={file.url || file.data}
                                      alt={file.name || "첨부파일"}
                                      className="w-full h-32 object-cover"
                                    />
                                  </div>
                                )
                              }
                              if (file.type?.startsWith("video/") || file.type === "video") {
                                return (
                                  <div key={idx} className="border rounded overflow-hidden">
                                    <video src={file.url || file.data} controls className="w-full h-32 bg-black" />
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="ghost" onClick={() => handleEditMedication(med)}>
                        <Pencil className="w-4 h-4 text-black" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteMedication(med.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
        </div>
      </div>
    )
  }

  if (viewMode === "charts") {
    const chartData = getChartData()
    const expenseData = getMedicationExpenseData()

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-6">
        <Button variant="ghost" onClick={() => setViewMode("list")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 뒤로
        </Button>

        <h2 className="text-xl font-bold">📊 건강 그래프</h2>

        {chartData.length === 0 && expenseData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">건강 기록을 추가하면 그래프가 표시됩니다</p>
        ) : (
          <>
            {/* Blood Pressure Chart */}
            {chartData.some((d) => d.systolic || d.diastolic) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">혈압 (mmHg)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="수축기" />
                    <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="이완기" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Blood Sugar Chart */}
            {chartData.some((d) => d.bloodSugar) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">혈당 (mg/dL)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bloodSugar" stroke="#f59e0b" name="혈당" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Weight Chart */}
            {chartData.some((d) => d.weight) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">몸무게 (kg)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#10b981" name="몸무게" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Temperature Chart */}
            {chartData.some((d) => d.temperature) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">체온 (°C)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[35, 40]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#ec4899" name="체온" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Steps Chart */}
            {chartData.some((d) => d.steps) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">걸음수 (보)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="steps" stroke="#8b5cf6" name="걸음수" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Distance Chart */}
            {chartData.some((d) => d.distance) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">걸은 거리 (km)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="distance" stroke="#06b6d4" name="거리" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Medical/Medication Expense Chart */}
            {expenseData.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">의료비 및 약값 (원)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="medicalExpense" stroke="#f97316" name="의료비" />
                    <Line type="monotone" dataKey="medicationExpense" stroke="#84cc16" name="약값" />
                    <Line type="monotone" dataKey="total" stroke="#dc2626" name="총액" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("title")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => setViewMode("add_record")} className="h-20 bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="mr-2 h-5 w-5" /> {t("health_record_btn")}
        </Button>
        <Button
          onClick={() => setViewMode("medications")}
          className="h-20 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Pill className="mr-2 h-5 w-5" /> {t("medication_management_btn")}
        </Button>
        <Button
          onClick={() => setViewMode("charts")}
          className="h-20 col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <TrendingUp className="mr-2 h-5 w-5" /> {t("view_graph")}
        </Button>
      </div>

      <h2 className="text-lg font-bold mt-6">{t("recent_records")}</h2>

      <div className="grid gap-4">
        {records.slice(0, 10).map((record) => (
          <Card key={record.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">
                    {record.type === "vital_signs" && `💓 ${t("vital_signs")}`}
                    {record.type === "exercise" && `🏃 ${t("exercise")}`}
                    {record.type === "expense" && `💰 ${t("medical_expenses")}`}
                  </span>
                  <span className="text-sm text-muted-foreground">{record.date}</span>
                </div>

                {record.bloodPressure && (
                  <p className="text-sm mt-2">
                    혈압: {record.bloodPressure.systolic}/{record.bloodPressure.diastolic} mmHg
                  </p>
                )}
                {record.bloodSugar && <p className="text-sm">혈당: {record.bloodSugar} mg/dL</p>}
                {record.temperature && <p className="text-sm">체온: {record.temperature}°C</p>}
                {record.weight && <p className="text-sm">몸무게: {record.weight} kg</p>}
                {record.steps && <p className="text-sm">걸음수: {record.steps.toLocaleString()}보</p>}
                {record.distance && <p className="text-sm">거리: {record.distance} km</p>}
                {record.medicalExpense && <p className="text-sm">의료비: {record.medicalExpense.toLocaleString()}원</p>}
                {record.medicationExpense && (
                  <p className="text-sm">약값: {record.medicationExpense.toLocaleString()}원</p>
                )}
                {record.notes && <p className="text-sm mt-1 text-muted-foreground">{record.notes}</p>}

                {record.attachments && record.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium">첨부파일 ({record.attachments.length}개)</p>
                    <div className="grid grid-cols-2 gap-2">
                      {record.attachments.map((file: any, idx: number) => {
                        if (file.type?.startsWith("image/") || file.type === "image" || file.type === "drawing") {
                          return (
                            <div key={idx} className="relative border rounded overflow-hidden">
                              <img
                                src={file.url || file.data}
                                alt={file.name || "첨부파일"}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          )
                        }
                        if (file.type?.startsWith("video/") || file.type === "video") {
                          return (
                            <div key={idx} className="border rounded overflow-hidden">
                              <video src={file.url || file.data} controls className="w-full h-32 bg-black" />
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setFormData({
                      date: record.date,
                      type: record.type,
                      systolic: record.bloodPressure?.systolic?.toString() || "",
                      diastolic: record.bloodPressure?.diastolic?.toString() || "",
                      bloodSugar: record.bloodSugar?.toString() || "",
                      temperature: record.temperature?.toString() || "",
                      weight: record.weight?.toString() || "",
                      steps: record.steps?.toString() || "",
                      distance: record.distance?.toString() || "",
                      medicalExpense: record.medicalExpense?.toString() || "",
                      medicationExpense: record.medicationExpense?.toString() || "",
                      notes: record.notes || "",
                      attachments: record.attachments || [],
                    })
                    setEditingId(record.id)
                    setViewMode("add_record")
                  }}
                >
                  <Pencil className="w-4 h-4 text-black" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteRecord(record.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
