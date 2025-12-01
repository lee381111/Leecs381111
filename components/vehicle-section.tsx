"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Pencil, Trash2, Car, Calendar } from "lucide-react"
import { saveVehicles, loadVehicles, saveVehicleMaintenanceRecords, loadVehicleMaintenanceRecords } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import type { Vehicle, VehicleMaintenanceRecord, PreventiveMaintenanceSchedule, Attachment } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"
import { getTranslation } from "@/lib/i18n"
import { notificationManager } from "@/lib/notification-manager"
import { MediaTools } from "@/components/media-tools"

interface VehicleSectionProps {
  onBack: () => void
  language: string
}

export function VehicleSection({ onBack, language }: VehicleSectionProps) {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<VehicleMaintenanceRecord[]>([])
  const [preventiveSchedules, setPreventiveSchedules] = useState<PreventiveMaintenanceSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [screen, setScreen] = useState<"list" | "add-vehicle" | "vehicle-detail">("list")
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)

  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    licensePlate: "",
    model: "",
    year: "",
    purchaseYear: "",
    insurance: "",
  })

  const [maintenanceForm, setMaintenanceForm] = useState({
    type: "engine_oil" as "engine_oil" | "tire" | "filter" | "repair" | "insurance" | "parts" | "other",
    date: "",
    mileage: 0,
    amount: 0,
    notes: "",
    attachments: [] as Attachment[],
  })

  const [scheduleForm, setScheduleForm] = useState({
    type: "engine_oil" as "engine_oil" | "tire" | "filter" | "repair" | "insurance" | "parts" | "other",
    scheduledDate: "",
    mileage: 0,
    description: "",
    alarmEnabled: false,
    alarmDaysBefore: 1,
  })

  const t = (key: string) => getTranslation(language as any, key)

  useEffect(() => {
    loadData()
    notificationManager.requestPermission()
    notificationManager.restoreAlarms()
  }, [user])

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const [vehiclesData, recordsData] = await Promise.all([
        loadVehicles(user.id),
        loadVehicleMaintenanceRecords(user.id),
      ])
      setVehicles(vehiclesData)
      setMaintenanceRecords(recordsData)

      const schedulesData = localStorage.getItem(`preventive_schedules_${user.id}`)
      if (schedulesData) {
        setPreventiveSchedules(JSON.parse(schedulesData))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveVehicle = async () => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!vehicleForm.name || !vehicleForm.licensePlate) {
      alert(t("vehicle_name_and_plate_required"))
      return
    }

    try {
      setSaving(true)
      let updated: Vehicle[]

      if (editingVehicleId) {
        updated = vehicles.map((v) => (v.id === editingVehicleId ? { ...v, ...vehicleForm } : v))
      } else {
        const vehicle: Vehicle = {
          id: window.crypto.randomUUID(),
          ...vehicleForm,
          createdAt: new Date().toISOString(),
          user_id: user.id,
        }
        updated = [vehicle, ...vehicles]
      }

      setVehicles(updated)
      await saveVehicles(updated, user.id)

      setScreen("list")
      setVehicleForm({ name: "", licensePlate: "", model: "", year: "", purchaseYear: "", insurance: "" })
      setEditingVehicleId(null)
      alert(t("vehicle_saved"))
    } catch (error) {
      console.error("[v0] Error saving vehicle:", error)
      alert(t("save_error"))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteVehicle = async (id: string) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!confirm(t("delete_vehicle_confirm"))) return

    try {
      const updatedVehicles = vehicles.filter((v) => v.id !== id)
      const updatedRecords = maintenanceRecords.filter((r) => r.vehicleId !== id)
      const updatedSchedules = preventiveSchedules.filter((s) => s.vehicleId !== id)

      setVehicles(updatedVehicles)
      setMaintenanceRecords(updatedRecords)
      setPreventiveSchedules(updatedSchedules)

      await Promise.all([
        saveVehicles(updatedVehicles, user.id),
        saveVehicleMaintenanceRecords(updatedRecords, user.id),
      ])

      localStorage.setItem(`preventive_schedules_${user.id}`, JSON.stringify(updatedSchedules))

      alert(t("deleted"))
    } catch (error) {
      console.error("[v0] Error deleting vehicle:", error)
      alert(t("delete_error"))
    }
  }

  const handleSaveMaintenance = async (attachments: Attachment[]) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    console.log("[v0] 🔧 Saving maintenance record")
    console.log("[v0] Selected vehicle ID:", selectedVehicleId)
    console.log("[v0] Maintenance form:", maintenanceForm)
    console.log("[v0] Attachments:", attachments)

    if (!selectedVehicleId || !maintenanceForm.date) {
      alert(t("date_required"))
      return
    }

    try {
      setSaving(true)
      console.log("[v0] 💾 Saving maintenance record with", attachments.length, "attachments")

      let updated: VehicleMaintenanceRecord[]

      if (editingRecordId) {
        updated = maintenanceRecords.map((r) =>
          r.id === editingRecordId ? { ...r, ...maintenanceForm, attachments } : r,
        )
      } else {
        const record: VehicleMaintenanceRecord = {
          id: window.crypto.randomUUID(),
          vehicleId: selectedVehicleId,
          ...maintenanceForm,
          attachments,
          createdAt: new Date().toISOString(),
          user_id: user.id,
        }
        updated = [record, ...maintenanceRecords]
      }

      setMaintenanceRecords(updated)
      await saveVehicleMaintenanceRecords(updated, user.id)

      setMaintenanceForm({
        type: "engine_oil",
        date: "",
        mileage: 0,
        amount: 0,
        notes: "",
        attachments: [],
      })
      setEditingRecordId(null)
      setShowMaintenanceForm(false)

      alert(t("maintenance_saved"))
    } catch (error) {
      console.error("[v0] Error saving maintenance record:", error)
      alert(t("save_error"))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMaintenance = async (id: string) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!confirm(t("delete_maintenance_confirm"))) return

    try {
      const updated = maintenanceRecords.filter((r) => r.id !== id)
      setMaintenanceRecords(updated)
      await saveVehicleMaintenanceRecords(updated, user.id)
      alert(t("deleted"))
    } catch (error) {
      console.error("[v0] Error deleting maintenance record:", error)
      alert(t("delete_error"))
    }
  }

  const handleAttachmentsChange = (attachments: Attachment[]) => {
    setMaintenanceForm({ ...maintenanceForm, attachments })
  }

  const handleTranscriptReceived = (text: string) => {
    setMaintenanceForm({ ...maintenanceForm, notes: maintenanceForm.notes + text })
  }

  const handleSaveSchedule = async () => {
    console.log("[v0] 📅 Saving preventive schedule")
    console.log("[v0] Selected vehicle ID:", selectedVehicleId)
    console.log("[v0] Schedule form:", scheduleForm)

    if (!selectedVehicleId || !scheduleForm.scheduledDate) {
      alert(t("scheduled_date_required"))
      return
    }

    try {
      setSaving(true)

      const scheduleId = window.crypto.randomUUID()
      const schedule: PreventiveMaintenanceSchedule = {
        id: scheduleId,
        vehicleId: selectedVehicleId,
        ...scheduleForm,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        user_id: user.id,
      }

      const updated = [schedule, ...preventiveSchedules]
      setPreventiveSchedules(updated)

      localStorage.setItem(`preventive_schedules_${user?.id || "guest"}`, JSON.stringify(updated))

      if (scheduleForm.alarmEnabled && scheduleForm.scheduledDate) {
        const scheduleDate = new Date(scheduleForm.scheduledDate)
        const alarmTime = new Date(scheduleDate.getTime() - scheduleForm.alarmDaysBefore * 24 * 60 * 60 * 1000)

        if (alarmTime.getTime() > Date.now()) {
          const vehicle = vehicles.find((v) => v.id === selectedVehicleId)
          notificationManager.scheduleAlarm({
            id: `maintenance_${scheduleId}`,
            title: `${t("maintenance_alarm_title")}: ${vehicle?.name || "차량"}`,
            message: `${t("maintenance_alarm_message")}: ${scheduleForm.alarmDaysBefore} ${t("days_before_1")}`,
            scheduleTime: alarmTime,
            type: "maintenance",
          })
        }
      }

      setScheduleForm({
        type: "engine_oil",
        scheduledDate: "",
        mileage: 0,
        description: "",
        alarmEnabled: false,
        alarmDaysBefore: 1,
      })
      setShowScheduleForm(false)

      alert(t("schedule_saved"))
    } catch (error) {
      console.error("[v0] Error saving schedule:", error)
      alert(t("save_error"))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!confirm(t("delete_schedule_confirm"))) return

    try {
      const updated = preventiveSchedules.filter((s) => s.id !== id)
      setPreventiveSchedules(updated)
      localStorage.setItem(`preventive_schedules_${user?.id || "guest"}`, JSON.stringify(updated))

      notificationManager.cancelAlarm(`maintenance_${id}`)

      alert(t("deleted"))
    } catch (error) {
      console.error("[v0] Error deleting schedule:", error)
      alert(t("delete_error"))
    }
  }

  const handleToggleScheduleCompletion = async (id: string) => {
    const updated = preventiveSchedules.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s))
    setPreventiveSchedules(updated)
    localStorage.setItem(`preventive_schedules_${user?.id || "guest"}`, JSON.stringify(updated))
  }

  const getMaintenanceTypeLabel = (type: string) => {
    const labelKeys: Record<string, string> = {
      engine_oil: "engine_oil",
      tire: "tire",
      filter: "filter",
      repair: "repair",
      insurance: "insurance_fee",
      parts: "parts",
      other: "other",
    }
    return t(labelKeys[type] || "other")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    )
  }

  if (screen === "add-vehicle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setScreen("list")
            setVehicleForm({ name: "", licensePlate: "", model: "", year: "", purchaseYear: "", insurance: "" })
            setEditingVehicleId(null)
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("cancel")}
        </Button>
        <h2 className="text-xl font-bold">{editingVehicleId ? t("edit_vehicle") : t("new_vehicle")}</h2>

        <Input
          placeholder={t("vehicle_name_placeholder")}
          value={vehicleForm.name}
          onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
        />
        <Input
          placeholder={t("license_plate_placeholder")}
          value={vehicleForm.licensePlate}
          onChange={(e) => setVehicleForm({ ...vehicleForm, licensePlate: e.target.value })}
        />
        <Input
          placeholder={t("vehicle_type_placeholder")}
          value={vehicleForm.model}
          onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
        />
        <Input
          placeholder={t("vehicle_model_placeholder")}
          value={vehicleForm.year}
          onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
        />
        <Input
          placeholder={t("purchase_year_placeholder")}
          value={vehicleForm.purchaseYear}
          onChange={(e) => setVehicleForm({ ...vehicleForm, purchaseYear: e.target.value })}
        />
        <Input
          placeholder={t("insurance_placeholder")}
          value={vehicleForm.insurance}
          onChange={(e) => setVehicleForm({ ...vehicleForm, insurance: e.target.value })}
        />

        <Button onClick={handleSaveVehicle} disabled={saving} className="w-full bg-green-600 hover:bg-green-700">
          {saving ? <Spinner className="mr-2 h-4 w-4" /> : null}
          {editingVehicleId ? t("update") : t("register")}
        </Button>
      </div>
    )
  }

  if (screen === "vehicle-detail" && selectedVehicleId) {
    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)
    const vehicleRecords = maintenanceRecords.filter((r) => r.vehicleId === selectedVehicleId)
    const vehicleSchedules = preventiveSchedules.filter((s) => s.vehicleId === selectedVehicleId)

    if (!selectedVehicle) {
      setScreen("list")
      return null
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setScreen("list")
            setShowMaintenanceForm(false)
            setShowScheduleForm(false)
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("vehicle_list")}
        </Button>

        <Card className="p-4 bg-emerald-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Car className="h-5 w-5" />
                {selectedVehicle.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{selectedVehicle.licensePlate}</p>
              <div className="mt-2 space-y-1 text-sm">
                {selectedVehicle.model && (
                  <p>
                    {t("vehicle_type")}: {selectedVehicle.model}
                  </p>
                )}
                {selectedVehicle.year && (
                  <p>
                    {t("vehicle_model")}: {selectedVehicle.year}
                  </p>
                )}
                {selectedVehicle.purchaseYear && (
                  <p>
                    {t("purchase_year")}: {selectedVehicle.purchaseYear}
                  </p>
                )}
                {selectedVehicle.insurance && (
                  <p>
                    {t("insurance")}: {selectedVehicle.insurance}
                  </p>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setVehicleForm({
                  name: selectedVehicle.name,
                  licensePlate: selectedVehicle.licensePlate,
                  model: selectedVehicle.model,
                  year: selectedVehicle.year,
                  purchaseYear: selectedVehicle.purchaseYear || "",
                  insurance: selectedVehicle.insurance || "",
                })
                setEditingVehicleId(selectedVehicle.id)
                setScreen("add-vehicle")
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              console.log("[v0] 🔘 Toggle maintenance form. Current state:", showMaintenanceForm)
              setShowMaintenanceForm(!showMaintenanceForm)
              setShowScheduleForm(false)
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showMaintenanceForm ? t("cancel") : t("add_maintenance")}
          </Button>
          <Button
            onClick={() => {
              console.log("[v0] 🔘 Toggle schedule form. Current state:", showScheduleForm)
              setShowScheduleForm(!showScheduleForm)
              setShowMaintenanceForm(false)
            }}
            variant="outline"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {showScheduleForm ? t("cancel") : t("preventive_schedule")}
          </Button>
        </div>

        {showMaintenanceForm && (
          <>
            {console.log("[v0] ✅ Rendering maintenance form")}
            <Card className="p-4 bg-emerald-50 border-emerald-200">
              <h3 className="text-lg font-semibold mb-4">{t("maintenance_input")}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("maintenance_category")}</label>
                  <select
                    value={maintenanceForm.type}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, type: e.target.value as any })}
                    className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
                  >
                    <option value="engine_oil">{t("engine_oil")}</option>
                    <option value="tire">{t("tire")}</option>
                    <option value="filter">{t("filter")}</option>
                    <option value="repair">{t("repair")}</option>
                    <option value="insurance">{t("insurance_fee")}</option>
                    <option value="parts">{t("parts")}</option>
                    <option value="other">{t("other")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("maintenance_date")}</label>
                  <input
                    type="date"
                    value={maintenanceForm.date}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, date: e.target.value })}
                    className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("mileage")} ({t("km_unit")})
                  </label>
                  <Input
                    type="number"
                    placeholder={t("mileage_placeholder")}
                    value={maintenanceForm.mileage || ""}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, mileage: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("amount")} ({t("won_unit")})
                  </label>
                  <Input
                    type="number"
                    placeholder={t("amount_placeholder")}
                    value={maintenanceForm.amount || ""}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, amount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("memo")}</label>
                  <Input
                    placeholder={t("memo_placeholder")}
                    value={maintenanceForm.notes}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                  />
                </div>

                <MediaTools
                  language={language}
                  attachments={maintenanceForm.attachments || []}
                  onAttachmentsChange={handleAttachmentsChange}
                  onSave={(attachments) => handleSaveMaintenance(attachments)}
                  saving={saving}
                  saveButtonText={t("save_maintenance")}
                  onTextFromSpeech={handleTranscriptReceived}
                />
              </div>
            </Card>
          </>
        )}

        {showScheduleForm && (
          <>
            {console.log("[v0] ✅ Rendering schedule form")}
            <Card className="p-4 bg-teal-50 border-teal-200">
              <h3 className="text-lg font-semibold mb-4">{t("preventive_input")}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("maintenance_category")}</label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value as any })}
                    className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
                  >
                    <option value="engine_oil">{t("engine_oil")}</option>
                    <option value="tire">{t("tire")}</option>
                    <option value="filter">{t("filter")}</option>
                    <option value="repair">{t("repair")}</option>
                    <option value="insurance">{t("insurance_fee")}</option>
                    <option value="parts">{t("parts")}</option>
                    <option value="other">{t("other")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("scheduled_date")}</label>
                  <input
                    type="date"
                    value={scheduleForm.scheduledDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                    className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("estimated_mileage")} ({t("km_unit")})
                  </label>
                  <Input
                    type="number"
                    placeholder={t("estimated_mileage_placeholder")}
                    value={scheduleForm.mileage || ""}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, mileage: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("description")}</label>
                  <Input
                    placeholder={t("description_placeholder")}
                    value={scheduleForm.description}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                  />
                </div>

                <Card className="p-3 bg-emerald-50">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={scheduleForm.alarmEnabled}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, alarmEnabled: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <label className="text-sm font-medium">{t("alarm_setting")}</label>
                  </div>
                  {scheduleForm.alarmEnabled && (
                    <div className="space-y-2">
                      <label className="block text-sm">{t("alarm_days_before")}</label>
                      <select
                        value={scheduleForm.alarmDaysBefore}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, alarmDaysBefore: Number(e.target.value) })}
                        className="w-full p-2 border rounded bg-white/50 dark:bg-slate-800/50"
                      >
                        <option value={1}>{t("days_before_1")}</option>
                        <option value={2}>{t("days_before_2")}</option>
                        <option value={3}>{t("days_before_3")}</option>
                        <option value={7}>{t("days_before_7")}</option>
                        <option value={14}>{t("days_before_14")}</option>
                        <option value={30}>{t("days_before_30")}</option>
                      </select>
                    </div>
                  )}
                </Card>

                <Button
                  onClick={handleSaveSchedule}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {saving ? <Spinner className="mr-2 h-4 w-4" /> : null}
                  {t("save_schedule")}
                </Button>
              </div>
            </Card>
          </>
        )}

        {vehicleSchedules.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 mt-6">{t("preventive_schedule")}</h3>
            <div className="grid gap-3">
              {vehicleSchedules.map((schedule) => (
                <Card key={schedule.id} className={`p-4 ${schedule.isCompleted ? "bg-gray-100" : "bg-teal-50"}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={schedule.isCompleted}
                          onChange={() => handleToggleScheduleCompletion(schedule.id)}
                          className="w-5 h-5"
                        />
                        <span className={`font-semibold ${schedule.isCompleted ? "line-through text-gray-500" : ""}`}>
                          {getMaintenanceTypeLabel(schedule.type)}
                        </span>
                        <span className="text-sm text-muted-foreground">{schedule.scheduledDate}</span>
                      </div>
                      {schedule.mileage > 0 && (
                        <p className="text-sm mt-2">
                          {t("estimated_mileage")}: {schedule.mileage.toLocaleString()} {t("km_unit")}
                        </p>
                      )}
                      {schedule.description && (
                        <p className="text-sm mt-2 text-muted-foreground">{schedule.description}</p>
                      )}
                      {schedule.alarmEnabled && (
                        <p className="text-xs text-amber-600 mt-1">
                          🔔 {t("alarm_notification")}: {schedule.alarmDaysBefore}
                          {t("days_before_1")}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteSchedule(schedule.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {vehicleRecords.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 mt-6">{t("maintenance_history")}</h3>
            <div className="grid gap-3">
              {vehicleRecords.map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-semibold">{getMaintenanceTypeLabel(record.type)}</span>
                        <span className="text-sm text-muted-foreground">{record.date}</span>
                      </div>
                      {record.mileage > 0 && (
                        <p className="text-sm mt-2">
                          {t("mileage")}: {record.mileage.toLocaleString()} {t("km_unit")}
                        </p>
                      )}
                      {record.amount > 0 && (
                        <p className="text-sm">
                          {t("amount")}: {record.amount.toLocaleString()} {t("won_unit")}
                        </p>
                      )}
                      {record.notes && <p className="text-sm mt-2 text-muted-foreground">{record.notes}</p>}

                      {record.attachments && record.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-medium">
                            {t("attachments")} ({record.attachments.length}
                            {t("attachments_count")})
                          </p>
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
                              if (file.type?.startsWith("audio/") || file.type === "audio") {
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-center h-20 bg-gray-100 border rounded"
                                  >
                                    <audio src={file.url || file.data} controls className="w-full px-2" />
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
                          setMaintenanceForm({
                            type: record.type,
                            date: record.date,
                            mileage: record.mileage || 0,
                            amount: record.amount || 0,
                            notes: record.notes || "",
                            attachments: record.attachments || [],
                          })
                          setEditingRecordId(record.id)
                          setShowMaintenanceForm(true)
                        }}
                      >
                        <Pencil className="w-4 h-4 text-black" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteMaintenance(record.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {vehicleRecords.length === 0 && <p className="text-center text-muted-foreground py-8">{t("no_records")}</p>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("title")}
        </Button>
        <Button onClick={() => setScreen("add-vehicle")} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> {t("add_vehicle")}
        </Button>
      </div>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => {
          const vehicleRecords = maintenanceRecords.filter((r) => r.vehicleId === vehicle.id)
          const totalAmount = vehicleRecords.reduce((sum, r) => sum + r.amount, 0)

          return (
            <Card
              key={vehicle.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => {
                setSelectedVehicleId(vehicle.id)
                setScreen("vehicle-detail")
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold text-lg">{vehicle.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{vehicle.licensePlate}</p>
                  <div className="mt-1 text-sm space-y-0.5">
                    {vehicle.model && vehicle.year && (
                      <p>
                        {vehicle.model} · {vehicle.year}
                      </p>
                    )}
                    {vehicle.purchaseYear && (
                      <p>
                        {t("purchase_year")}: {vehicle.purchaseYear}
                      </p>
                    )}
                    {vehicle.insurance && (
                      <p>
                        {t("insurance")}: {vehicle.insurance}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t("records_count")}: </span>
                      <span className="font-medium">
                        {vehicleRecords.length}
                        {t("records_unit")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("schedules_count")}: </span>
                      <span className="font-medium">
                        {preventiveSchedules.filter((s) => s.vehicleId === vehicle.id).length}
                        {t("records_unit")}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteVehicle(vehicle.id)
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </Card>
          )
        })}

        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{t("no_vehicles")}</p>
            <Button onClick={() => setScreen("add-vehicle")}>
              <Plus className="mr-2 h-4 w-4" /> {t("first_vehicle")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
