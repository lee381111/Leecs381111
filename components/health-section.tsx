"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, TrendingUp, Pill, Bell, Pencil, Save, Phone, Lightbulb } from "lucide-react"
import { saveHealthRecords, loadHealthRecords, saveMedications, loadMedications } from "@/lib/storage"
import { saveMedicalContacts, loadMedicalContacts, deleteMedicalContact } from "@/lib/storage"
import type { MedicalContact } from "@/lib/types"
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

type ViewMode = "list" | "add_record" | "medications" | "add_medication" | "charts" | "add_contact"

export function HealthSection({ onBack, language }: HealthSectionProps) {
  const { user } = useAuth()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [medicalContacts, setMedicalContacts] = useState<MedicalContact[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingMedId, setEditingMedId] = useState<string | null>(null)
  const [editingContactId, setEditingContactId] = useState<string | null>(null)
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

  const [contactFormData, setContactFormData] = useState({
    name: "",
    type: "hospital" as "hospital" | "clinic" | "pharmacy",
    phone: "",
    address: "",
    notes: "",
  })

  // Modifying useEffect for loading data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        console.log("[v0] 건강 섹션: 데이터 로드 시작")
        const [healthData, medData, contactData] = await Promise.all([
          loadHealthRecords(user.id),
          loadMedications(user.id),
          loadMedicalContacts(user.id),
        ])
        console.log("[v0] 건강 기록 로드됨:", healthData.length, "개")
        console.log("[v0] 복약 기록 로드됨:", medData.length, "개")
        console.log("[v0] 의료 연락처 로드됨:", contactData.length, "개")
        setRecords(healthData)
        setMedications(medData)
        setMedicalContacts(contactData)

        setupMedicationAlarms(medData)
      } catch (error) {
        console.error("[v0] 건강 데이터 로드 에러:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

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

  const handleSaveContact = async () => {
    if (!user?.id) {
      alert("로그인이 필요합니다.")
      return
    }
    if (!contactFormData.name.trim() || !contactFormData.phone.trim()) {
      alert(t("fill_required_fields"))
      return
    }

    setSaving(true)
    try {
      const newContact: MedicalContact = {
        id: editingContactId || crypto.randomUUID(),
        ...contactFormData,
        userId: user.id, // Use actual user ID
        createdAt: new Date().toISOString(),
      }

      const updatedContacts = editingContactId
        ? medicalContacts.map((c) => (c.id === editingContactId ? newContact : c))
        : [...medicalContacts, newContact]

      await saveMedicalContacts(updatedContacts, user.id)
      setMedicalContacts(updatedContacts)
      setViewMode("list")
      resetContactForm()
      setEditingContactId(null)
      alert(t("save_success"))
    } catch (error) {
      console.error("[v0] Error saving contact:", error)
      alert(t("save_failed"))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!user?.id) {
      alert("로그인이 필요합니다.")
      return
    }
    if (!confirm(t("confirm_delete"))) return

    setSaving(true)
    try {
      await deleteMedicalContact(id, user.id)
      setMedicalContacts(medicalContacts.filter((c) => c.id !== id))
      alert(t("delete_success"))
    } catch (error) {
      console.error("[v0] Error deleting contact:", error)
      alert(t("delete_failed"))
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

  // Adding contact form reset handler
  const resetContactForm = () => {
    setContactFormData({
      name: "",
      type: "hospital",
      phone: "",
      address: "",
      notes: "",
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
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("cancel")}
        </Button>
        <h2 className="text-xl font-bold">{t("add_health_record")}</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">{t("date_label")}</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("record_type")}</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
            >
              <option value="vital_signs">{t("vital_signs")}</option>
              <option value="exercise">{t("exercise")}</option>
              <option value="expense">{t("medical_expenses")}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t("systolic_bp")}</label>
              <Input
                type="number"
                placeholder={t("systolic_placeholder")}
                value={formData.systolic}
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("diastolic_bp")}</label>
              <Input
                type="number"
                placeholder={t("diastolic_placeholder")}
                value={formData.diastolic}
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t("blood_sugar")}</label>
            <Input
              type="number"
              placeholder={t("blood_sugar_placeholder")}
              value={formData.bloodSugar}
              onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("temperature")}</label>
            <Input
              type="number"
              step="0.1"
              placeholder={t("temperature_placeholder")}
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("weight")}</label>
            <Input
              type="number"
              step="0.1"
              placeholder={t("weight_placeholder")}
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("steps")}</label>
            <Input
              type="number"
              placeholder={t("steps_placeholder")}
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("distance")}</label>
            <Input
              type="number"
              step="0.1"
              placeholder={t("distance_placeholder")}
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("medical_expense")}</label>
            <Input
              type="number"
              placeholder={t("medical_expense_placeholder")}
              value={formData.medicalExpense}
              onChange={(e) => setFormData({ ...formData, medicalExpense: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("medication_expense")}</label>
            <Input
              type="number"
              placeholder={t("medication_expense_placeholder")}
              value={formData.medicationExpense}
              onChange={(e) => setFormData({ ...formData, medicationExpense: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("memo")}</label>
            <Input
              placeholder={t("memo_additional")}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <MediaTools
            language={language}
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
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("cancel")}
        </Button>
        <h2 className="text-xl font-bold">{t("add_medication_schedule")}</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">{t("medicine_name")}</label>
            <Input
              placeholder={t("medicine_name_placeholder")}
              value={medFormData.name}
              onChange={(e) => setMedFormData({ ...medFormData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("dosage")}</label>
            <Input
              placeholder={t("dosage_placeholder")}
              value={medFormData.dosage}
              onChange={(e) => setMedFormData({ ...medFormData, dosage: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("frequency")}</label>
            <Input
              placeholder={t("frequency_placeholder")}
              value={medFormData.frequency}
              onChange={(e) => setMedFormData({ ...medFormData, frequency: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t("medication_times")}</label>
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
              <Plus className="w-4 h-4 mr-2" /> {t("add_time")}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t("start_date")}</label>
              <input
                type="date"
                value={medFormData.startDate}
                onChange={(e) => setMedFormData({ ...medFormData, startDate: e.target.value })}
                className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("end_date_optional")}</label>
              <input
                type="date"
                value={medFormData.endDate}
                onChange={(e) => setMedFormData({ ...medFormData, endDate: e.target.value })}
                className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t("memo")}</label>
            <Input
              placeholder={t("memo_additional")}
              value={medFormData.notes}
              onChange={(e) => setMedFormData({ ...medFormData, notes: e.target.value })}
            />
          </div>

          <MediaTools
            language={language}
            attachments={medFormData.attachments || []}
            onAttachmentsChange={handleMedAttachmentsChange}
            onSave={handleSaveMedication}
            saving={saving}
            saveButtonText={t("save_medication_schedule")}
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
              {t("enable_alarm")}
            </label>
          </div>
        </div>
      </div>
    )
  }

  // Adding add_contact view
  if (viewMode === "add_contact") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setViewMode("list")
            resetContactForm()
            setEditingContactId(null)
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("cancel")}
        </Button>
        <h2 className="text-xl font-bold">{editingContactId ? t("edit_medical_contact") : t("add_medical_contact")}</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">{t("contact_name")}</label>
            <Input
              placeholder={t("contact_name_placeholder")}
              value={contactFormData.name}
              onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("contact_type")}</label>
            <select
              value={contactFormData.type}
              onChange={(e) => setContactFormData({ ...contactFormData, type: e.target.value as any })}
              className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
            >
              <option value="hospital">{t("hospital")}</option>
              <option value="clinic">{t("clinic")}</option>
              <option value="pharmacy">{t("pharmacy")}</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">{t("contact_phone")}</label>
            <Input
              placeholder={t("contact_phone_placeholder")}
              value={contactFormData.phone}
              onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("contact_address")}</label>
            <Input
              placeholder={t("contact_address_placeholder")}
              value={contactFormData.address}
              onChange={(e) => setContactFormData({ ...contactFormData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("notes")}</label>
            <Input
              placeholder={t("contact_notes_placeholder")}
              value={contactFormData.notes}
              onChange={(e) => setContactFormData({ ...contactFormData, notes: e.target.value })}
            />
          </div>

          <Button onClick={handleSaveContact} disabled={saving} className="w-full">
            {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {editingContactId ? t("update") : t("save")}
          </Button>
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
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
          </Button>
          <Button
            onClick={() => {
              resetMedForm()
              setEditingMedId(null)
              setViewMode("add_medication")
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("add_medication")}
          </Button>
        </div>

        <h2 className="text-xl font-bold">{t("medication_management_title")}</h2>

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
                      {med.dosage && (
                        <p className="text-sm mt-1">
                          {t("dosage_label")} {med.dosage}
                        </p>
                      )}
                      {med.frequency && (
                        <p className="text-sm">
                          {t("frequency_label")} {med.frequency}
                        </p>
                      )}

                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium">{t("today_medication_times")}</p>
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
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
        </Button>

        <h2 className="text-xl font-bold">{t("view_graph")}</h2>

        {chartData.length === 0 && expenseData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t("no_health_records_message")}</p>
        ) : (
          <>
            {/* Blood Pressure Chart */}
            {chartData.some((d) => d.systolic || d.diastolic) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">{t("blood_pressure")} (mmHg)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" stroke="#ef4444" name={t("systolic")} />
                    <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name={t("diastolic")} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Blood Sugar Chart */}
            {chartData.some((d) => d.bloodSugar) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">{t("blood_sugar")} (mg/dL)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bloodSugar" stroke="#f59e0b" name={t("blood_sugar")} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Weight Chart */}
            {chartData.some((d) => d.weight) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">{t("weight")} (kg)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#10b981" name={t("weight")} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Temperature Chart */}
            {chartData.some((d) => d.temperature) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">{t("temperature")} (°C)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[35, 40]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#ec4899" name={t("temperature")} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Steps Chart */}
            {chartData.some((d) => d.steps) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">
                  {t("steps")} ({t("steps_unit")})
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="steps" stroke="#8b5cf6" name={t("steps")} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Distance Chart */}
            {chartData.some((d) => d.distance) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">{t("distance")} (km)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="distance" stroke="#06b6d4" name={t("distance")} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Medical/Medication Expense Chart */}
            {expenseData.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">
                  {t("medical_and_medication_expenses")} ({t("krw_unit")})
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="medicalExpense" stroke="#f97316" name={t("medical_expense")} />
                    <Line type="monotone" dataKey="medicationExpense" stroke="#84cc16" name={t("medication_expense")} />
                    <Line type="monotone" dataKey="total" stroke="#dc2626" name={t("total_expense")} strokeWidth={2} />
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

      {/* Adding usage guide card to health section empty state */}
      {viewMode === "list" && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <div className="flex items-start gap-4">
              <Lightbulb className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-3">
                  {language === "ko"
                    ? "🏥 건강 관리 가이드"
                    : language === "en"
                      ? "🏥 Health Management Guide"
                      : language === "zh"
                        ? "🏥 健康管理指南"
                        : "🏥 健康管理ガイド"}
                </h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>
                      {language === "ko"
                        ? "혈압, 혈당 등 건강 지표를 꾸준히 기록하세요"
                        : language === "en"
                          ? "Record health indicators like blood pressure and blood sugar regularly"
                          : language === "zh"
                            ? "定期记录血压、血糖等健康指标"
                            : "血圧、血糖などの健康指標を定期的に記録しましょう"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>
                      {language === "ko"
                        ? "복용 중인 약을 관리하고 알람을 설정하세요"
                        : language === "en"
                          ? "Manage medications and set reminders"
                          : language === "zh"
                            ? "管理药物并设置提醒"
                            : "服用中の薬を管理してアラームを設定しましょう"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>
                      {language === "ko"
                        ? "운동과 식단을 기록하여 건강한 생활습관을 만드세요"
                        : language === "en"
                          ? "Record exercise and diet to build healthy habits"
                          : language === "zh"
                            ? "记录运动和饮食建立健康习惯"
                            : "運動と食事を記録して健康的な生活習慣を作りましょう"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => setViewMode("add_record")} className="h-20 bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="mr-2 h-5 w-5" /> {t("health_record_btn")}
            </Button>
            <Button
              onClick={() => setViewMode("medications")}
              className="h-20 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center gap-1 px-2"
            >
              <Pill className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs leading-tight text-center">{t("medication_management_btn")}</span>
            </Button>
            <Button
              onClick={() => setViewMode("charts")}
              className="h-20 col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <TrendingUp className="mr-2 h-5 w-5" /> {t("view_graph")}
            </Button>
            {/* Adding button for medical contacts */}
            <Button
              onClick={() => {
                resetContactForm()
                setEditingContactId(null)
                setViewMode("add_contact")
              }}
              className="h-20 col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Phone className="mr-2 h-5 w-5" /> {t("manage_medical_contacts")}
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
                        {t("blood_pressure")}: {record.bloodPressure.systolic}/{record.bloodPressure.diastolic} mmHg
                      </p>
                    )}
                    {record.bloodSugar && (
                      <p className="text-sm">
                        {t("blood_sugar")}: {record.bloodSugar} mg/dL
                      </p>
                    )}
                    {record.temperature && (
                      <p className="text-sm">
                        {t("temperature")}: {record.temperature}°C
                      </p>
                    )}
                    {record.weight && (
                      <p className="text-sm">
                        {t("weight")}: {record.weight} kg
                      </p>
                    )}
                    {record.steps && (
                      <p className="text-sm">
                        {t("steps")}: {record.steps.toLocaleString()} {t("steps_unit")}
                      </p>
                    )}
                    {record.distance && (
                      <p className="text-sm">
                        {t("distance")}: {record.distance} km
                      </p>
                    )}
                    {record.medicalExpense && (
                      <p className="text-sm">
                        {t("medical_expense")}: {record.medicalExpense.toLocaleString()} {t("krw_unit")}
                      </p>
                    )}
                    {record.medicationExpense && (
                      <p className="text-sm">
                        {t("medication_expense")}: {record.medicationExpense.toLocaleString()} {t("krw_unit")}
                      </p>
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

          {/* Removed AdsenseAd component */}
        </div>
      )}
    </div>
  )
}
