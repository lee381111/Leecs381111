"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Trash2,
  Paperclip,
  Mic,
  X,
  ImageIcon,
  Pencil,
  PenTool,
  ArrowUpDown,
  Heart,
  Pill,
  Bell,
  BellOff,
  Footprints,
  Activity,
  Droplet,
  WeightIcon,
  Thermometer,
} from "lucide-react"
import type { HealthRecord, Medication, MedicationLog } from "./personal-organizer-app"
import { useLanguage } from "@/lib/language-context"
import { AttachmentList } from "./attachment-list"
import { HandwritingCanvas } from "./handwriting-canvas"
import { uploadFileToStorage } from "@/lib/storage"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

type UploadedFile = {
  name: string
  url: string
  type: string
}

type HealthSectionProps = {
  healthRecords: HealthRecord[]
  setHealthRecords: (records: HealthRecord[]) => void
  medications: Medication[]
  setMedications: (medications: Medication[]) => void
  medicationLogs: MedicationLog[]
  setMedicationLogs: (logs: MedicationLog[]) => void
  userId?: string
}

export function HealthSection({
  healthRecords,
  setHealthRecords,
  medications,
  setMedications,
  medicationLogs,
  setMedicationLogs,
  userId,
}: HealthSectionProps) {
  const [activeTab, setActiveTab] = useState<"records" | "medications">("records")
  const [isAddingRecord, setIsAddingRecord] = useState(false)
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
  const [isAddingMedication, setIsAddingMedication] = useState(false)
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null)
  const [newRecord, setNewRecord] = useState({
    date: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    bloodSugar: "",
    pulse: "",
    weight: "",
    temperature: "",
    steps: "",
    distanceKm: "",
    medicalCost: "",
    medicineCost: "",
    notes: "",
  })
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    time: "",
    alarmEnabled: false,
    notes: "",
  })
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<UploadedFile[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const [isHandwritingOpen, setIsHandwritingOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const { t, language } = useLanguage()

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachedFiles([...attachedFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      const messages = {
        ko: "음성 인식이 지원되지 않는 브라우저입니다.",
        en: "Speech recognition is not supported in this browser.",
        zh: "此浏览器不支持语音识别。",
        ja: "このブラウザは音声認識をサポートしていません。",
      }
      alert(messages[language])
      return
    }

    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    const langCodes = { ko: "ko-KR", en: "en-US", zh: "zh-CN", ja: "ja-JP" }
    recognition.lang = langCodes[language]

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      if (activeTab === "records") {
        setNewRecord({ ...newRecord, notes: newRecord.notes + " " + transcript })
      } else {
        setNewMedication({ ...newMedication, notes: newMedication.notes + " " + transcript })
      }
    }

    recognition.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const convertFilesToDataUrls = async (files: File[], userId: string): Promise<UploadedFile[]> => {
    const results: UploadedFile[] = []

    for (const file of files) {
      const isAudioOrVideo = file.type.startsWith("audio/") || file.type.startsWith("video/")

      if (isAudioOrVideo) {
        // Upload to Storage via Server Action
        const storageFile = await uploadFileToStorage(file, userId)
        if (storageFile) {
          results.push({
            name: storageFile.name,
            url: storageFile.url,
            type: storageFile.type,
          })
        } else {
          console.error("[v0] Failed to upload file:", file.name)
          const errorMessages = {
            ko: `파일 업로드에 실패했습니다: ${file.name}`,
            en: `Failed to upload file: ${file.name}`,
            zh: `文件上传失败：${file.name}`,
            ja: `ファイルのアップロードに失敗しました：${file.name}`,
          }
          alert(errorMessages[language])
          continue
        }
      } else {
        // Convert images to data URLs
        const dataUrl = await new Promise<UploadedFile>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve({
              name: file.name,
              url: e.target?.result as string,
              type: file.type,
            })
          }
          reader.readAsDataURL(file)
        })
        results.push(dataUrl)
      }
    }

    return results
  }

  const handleAddRecord = async () => {
    if (!newRecord.date) {
      alert(t("pleaseEnterDate"))
      return
    }

    let uploadedFiles: UploadedFile[] = []
    if (attachedFiles.length > 0 && userId) {
      uploadedFiles = await convertFilesToDataUrls(attachedFiles, userId)
    }

    const record: HealthRecord = {
      id: Date.now().toString(),
      date: newRecord.date,
      bloodPressureSystolic: newRecord.bloodPressureSystolic
        ? Number.parseInt(newRecord.bloodPressureSystolic)
        : undefined,
      bloodPressureDiastolic: newRecord.bloodPressureDiastolic
        ? Number.parseInt(newRecord.bloodPressureDiastolic)
        : undefined,
      bloodSugar: newRecord.bloodSugar ? Number.parseFloat(newRecord.bloodSugar) : undefined,
      pulse: newRecord.pulse ? Number.parseInt(newRecord.pulse) : undefined,
      weight: newRecord.weight ? Number.parseFloat(newRecord.weight) : undefined,
      temperature: newRecord.temperature ? Number.parseFloat(newRecord.temperature) : undefined,
      steps: newRecord.steps ? Number.parseInt(newRecord.steps) : undefined,
      distanceKm: newRecord.distanceKm ? Number.parseFloat(newRecord.distanceKm) : undefined,
      cost: newRecord.medicalCost ? Number.parseFloat(newRecord.medicalCost) : undefined,
      medicineCost: newRecord.medicineCost ? Number.parseFloat(newRecord.medicineCost) : undefined,
      notes: newRecord.notes,
      attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      createdAt: new Date(),
      user_id: userId || null,
    }
    setHealthRecords([...healthRecords, record])
    setNewRecord({
      date: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      bloodSugar: "",
      pulse: "",
      weight: "",
      temperature: "",
      steps: "",
      distanceKm: "",
      medicalCost: "",
      medicineCost: "",
      notes: "",
    })
    setAttachedFiles([])
    setIsAddingRecord(false)
  }

  const handleEditRecord = (record: HealthRecord) => {
    setEditingRecordId(record.id)
    setNewRecord({
      date: record.date,
      bloodPressureSystolic: record.bloodPressureSystolic?.toString() || "",
      bloodPressureDiastolic: record.bloodPressureDiastolic?.toString() || "",
      bloodSugar: record.bloodSugar?.toString() || "",
      pulse: record.pulse?.toString() || "",
      weight: record.weight?.toString() || "",
      temperature: record.temperature?.toString() || "",
      steps: record.steps?.toString() || "",
      distanceKm: record.distanceKm?.toString() || "",
      medicalCost: record.cost?.toString() || "",
      medicineCost: record.medicineCost?.toString() || "",
      notes: record.notes || "",
    })
    setExistingAttachments((record.attachments as UploadedFile[]) || [])
    setAttachedFiles([])
    setIsAddingRecord(true)
  }

  const handleUpdateRecord = async () => {
    if (!editingRecordId || !newRecord.date) return

    let uploadedFiles: UploadedFile[] = []
    if (attachedFiles.length > 0 && userId) {
      uploadedFiles = await convertFilesToDataUrls(attachedFiles, userId)
    }

    const allAttachments = [...existingAttachments, ...uploadedFiles]

    const updatedRecord: HealthRecord = {
      id: editingRecordId,
      date: newRecord.date,
      bloodPressureSystolic: newRecord.bloodPressureSystolic
        ? Number.parseInt(newRecord.bloodPressureSystolic)
        : undefined,
      bloodPressureDiastolic: newRecord.bloodPressureDiastolic
        ? Number.parseInt(newRecord.bloodPressureDiastolic)
        : undefined,
      bloodSugar: newRecord.bloodSugar ? Number.parseFloat(newRecord.bloodSugar) : undefined,
      pulse: newRecord.pulse ? Number.parseInt(newRecord.pulse) : undefined,
      weight: newRecord.weight ? Number.parseFloat(newRecord.weight) : undefined,
      temperature: newRecord.temperature ? Number.parseFloat(newRecord.temperature) : undefined,
      steps: newRecord.steps ? Number.parseInt(newRecord.steps) : undefined,
      distanceKm: newRecord.distanceKm ? Number.parseFloat(newRecord.distanceKm) : undefined,
      cost: newRecord.medicalCost ? Number.parseFloat(newRecord.medicalCost) : undefined,
      medicineCost: newRecord.medicineCost ? Number.parseFloat(newRecord.medicineCost) : undefined,
      notes: newRecord.notes,
      attachments: allAttachments.length > 0 ? allAttachments : undefined,
      createdAt: new Date(),
      user_id: userId || null,
    }

    setHealthRecords(healthRecords.map((r) => (r.id === editingRecordId ? updatedRecord : r)))
    setNewRecord({
      date: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      bloodSugar: "",
      pulse: "",
      weight: "",
      temperature: "",
      steps: "",
      distanceKm: "",
      medicalCost: "",
      medicineCost: "",
      notes: "",
    })
    setAttachedFiles([])
    setExistingAttachments([])
    setEditingRecordId(null)
    setIsAddingRecord(false)
  }

  const handleDeleteRecord = async (id: string) => {
    setHealthRecords(healthRecords.filter((r) => r.id !== id))
  }

  const handleAddMedication = async () => {
    if (!newMedication.name) {
      alert(t("pleaseEnterMedicationName"))
      return
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      startDate: newMedication.startDate || undefined,
      endDate: newMedication.endDate || undefined,
      time: newMedication.time || undefined,
      alarmEnabled: newMedication.alarmEnabled,
      notes: newMedication.notes,
      createdAt: new Date(),
      user_id: userId || null,
    }
    setMedications([...medications, medication])
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      time: "",
      alarmEnabled: false,
      notes: "",
    })
    setIsAddingMedication(false)
  }

  const handleEditMedication = (medication: Medication) => {
    setEditingMedicationId(medication.id)
    setNewMedication({
      name: medication.name,
      dosage: medication.dosage || "",
      frequency: medication.frequency || "",
      startDate: medication.startDate || "",
      endDate: medication.endDate || "",
      time: medication.time || "",
      alarmEnabled: medication.alarmEnabled || false,
      notes: medication.notes || "",
    })
    setIsAddingMedication(true)
  }

  const handleUpdateMedication = async () => {
    if (!editingMedicationId || !newMedication.name) return

    const updatedMedication: Medication = {
      id: editingMedicationId,
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      startDate: newMedication.startDate || undefined,
      endDate: newMedication.endDate || undefined,
      time: newMedication.time || undefined,
      alarmEnabled: newMedication.alarmEnabled,
      notes: newMedication.notes,
      createdAt: new Date(),
      user_id: userId || null,
    }

    setMedications(medications.map((m) => (m.id === editingMedicationId ? updatedMedication : m)))
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      time: "",
      alarmEnabled: false,
      notes: "",
    })
    setEditingMedicationId(null)
    setIsAddingMedication(false)
  }

  const handleDeleteMedication = async (id: string) => {
    setMedications(medications.filter((m) => m.id !== id))
  }

  const handleRemoveExistingAttachment = (index: number) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index))
  }

  const handleCancelRecord = () => {
    setIsAddingRecord(false)
    setEditingRecordId(null)
    setNewRecord({
      date: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      bloodSugar: "",
      pulse: "",
      weight: "",
      temperature: "",
      steps: "",
      distanceKm: "",
      medicalCost: "",
      medicineCost: "",
      notes: "",
    })
    setAttachedFiles([])
    setExistingAttachments([])
  }

  const handleCancelMedication = () => {
    setIsAddingMedication(false)
    setEditingMedicationId(null)
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      time: "",
      alarmEnabled: false,
      notes: "",
    })
  }

  const handleHandwritingSave = async (imageBlob: Blob) => {
    const file = new File([imageBlob], `handwriting-${Date.now()}.png`, { type: "image/png" })
    setAttachedFiles([...attachedFiles, file])
  }

  const sortedRecords = [...healthRecords].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  })

  const sortedMedications = [...medications].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.createdAt.getTime() - a.createdAt.getTime()
    } else {
      return a.createdAt.getTime() - b.createdAt.getTime()
    }
  })

  const getLangCode = () => {
    const langCodes = { ko: "ko-KR", en: "en-US", zh: "zh-CN", ja: "ja-JP" }
    return langCodes[language]
  }

  const wasTakenToday = (medicationId: string) => {
    const today = new Date().toISOString().split("T")[0]
    return medicationLogs.some((log) => {
      const logDate = new Date(log.takenAt).toISOString().split("T")[0]
      return log.medicationId === medicationId && logDate === today
    })
  }

  const stepsDistanceData = sortedRecords
    .filter((r) => r.steps || r.distanceKm)
    .map((r) => ({
      date: r.date,
      steps: r.steps || 0,
      distance: r.distanceKm || 0,
    }))
    .reverse()

  const bloodPressureData = sortedRecords
    .filter((r) => r.bloodPressureSystolic || r.bloodPressureDiastolic)
    .map((r) => ({
      date: r.date,
      systolic: r.bloodPressureSystolic || 0,
      diastolic: r.bloodPressureDiastolic || 0,
    }))
    .reverse()

  const bloodSugarData = sortedRecords
    .filter((r) => r.bloodSugar)
    .map((r) => ({
      date: r.date,
      bloodSugar: r.bloodSugar || 0,
    }))
    .reverse()

  const pulseData = sortedRecords
    .filter((r) => r.pulse)
    .map((r) => ({
      date: r.date,
      pulse: r.pulse || 0,
    }))
    .reverse()

  const weightData = sortedRecords
    .filter((r) => r.weight)
    .map((r) => ({
      date: r.date,
      weight: r.weight || 0,
    }))
    .reverse()

  const temperatureData = sortedRecords
    .filter((r) => r.temperature)
    .map((r) => ({
      date: r.date,
      temperature: r.temperature || 0,
    }))
    .reverse()

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("healthTitle")}</h2>
      </div>

      <div className="mb-6 flex gap-2">
        <Button
          variant={activeTab === "records" ? "default" : "outline"}
          onClick={() => setActiveTab("records")}
          className="flex-1"
        >
          <Heart className="mr-2 h-4 w-4" />
          {t("healthRecords")}
        </Button>
        <Button
          variant={activeTab === "medications" ? "default" : "outline"}
          onClick={() => setActiveTab("medications")}
          className="flex-1"
        >
          <Pill className="mr-2 h-4 w-4" />
          {t("medications")}
        </Button>
      </div>

      {activeTab === "records" && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <Button onClick={() => setIsAddingRecord(!isAddingRecord)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t("addHealthRecord")}
            </Button>
          </div>

          {isAddingRecord && (
            <div className="mb-6 space-y-4 rounded-lg border bg-muted/50 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="record-date">{t("recordDate")}</Label>
                  <Input
                    id="record-date"
                    type="date"
                    lang={getLangCode()}
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood-pressure">{t("bloodPressure")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="blood-pressure-systolic"
                      type="number"
                      value={newRecord.bloodPressureSystolic}
                      onChange={(e) => setNewRecord({ ...newRecord, bloodPressureSystolic: e.target.value })}
                      placeholder={t("systolic")}
                    />
                    <span className="flex items-center">/</span>
                    <Input
                      id="blood-pressure-diastolic"
                      type="number"
                      value={newRecord.bloodPressureDiastolic}
                      onChange={(e) => setNewRecord({ ...newRecord, bloodPressureDiastolic: e.target.value })}
                      placeholder={t("diastolic")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood-sugar">{t("bloodSugar")}</Label>
                  <Input
                    id="blood-sugar"
                    type="number"
                    value={newRecord.bloodSugar}
                    onChange={(e) => setNewRecord({ ...newRecord, bloodSugar: e.target.value })}
                    placeholder="mg/dL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pulse">{t("pulse")}</Label>
                  <Input
                    id="pulse"
                    type="number"
                    value={newRecord.pulse}
                    onChange={(e) => setNewRecord({ ...newRecord, pulse: e.target.value })}
                    placeholder="bpm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">{t("weight")}</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={newRecord.weight}
                    onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })}
                    placeholder="kg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">{t("temperature")}</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={newRecord.temperature}
                    onChange={(e) => setNewRecord({ ...newRecord, temperature: e.target.value })}
                    placeholder="°C"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="steps">걸음수</Label>
                  <Input
                    id="steps"
                    type="number"
                    value={newRecord.steps}
                    onChange={(e) => setNewRecord({ ...newRecord, steps: e.target.value })}
                    placeholder="걸음수 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance-km">걸은 거리 (km)</Label>
                  <Input
                    id="distance-km"
                    type="number"
                    step="0.1"
                    value={newRecord.distanceKm}
                    onChange={(e) => setNewRecord({ ...newRecord, distanceKm: e.target.value })}
                    placeholder="km"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medical-cost">의료비</Label>
                  <Input
                    id="medical-cost"
                    type="number"
                    value={newRecord.medicalCost}
                    onChange={(e) => setNewRecord({ ...newRecord, medicalCost: e.target.value })}
                    placeholder="원"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicine-cost">약값</Label>
                  <Input
                    id="medicine-cost"
                    type="number"
                    value={newRecord.medicineCost}
                    onChange={(e) => setNewRecord({ ...newRecord, medicineCost: e.target.value })}
                    placeholder="원"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="record-notes">{t("notes")}</Label>
                <Textarea
                  id="record-notes"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  placeholder={t("notes")}
                  rows={3}
                />
              </div>
              {existingAttachments.length > 0 && (
                <div className="space-y-2">
                  <Label>{t("existingAttachments")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {existingAttachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => handleRemoveExistingAttachment(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>{t("attachedFiles")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf"
                  className="hidden"
                  onChange={handleFileAttach}
                />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="mr-2 h-4 w-4" />
                  {t("attachFile")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsHandwritingOpen(true)}>
                  <PenTool className="mr-2 h-4 w-4" />
                  {t("handwriting")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={isRecording ? "bg-red-500 text-white hover:bg-red-600" : ""}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  {isRecording ? t("recording") : t("voiceInput")}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={editingRecordId ? handleUpdateRecord : handleAddRecord}>
                  {editingRecordId ? t("update") : t("save")}
                </Button>
                <Button variant="outline" onClick={handleCancelRecord}>
                  {t("cancel")}
                </Button>
              </div>
            </div>
          )}

          <div className="mb-6 space-y-6">
            {bloodPressureData.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                  <Activity className="h-5 w-5 text-red-500" />
                  혈압 그래프
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bloodPressureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="수축기" strokeWidth={2} />
                    <Line type="monotone" dataKey="diastolic" stroke="#f97316" name="이완기" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {bloodSugarData.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  혈당 그래프
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bloodSugarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bloodSugar" stroke="#3b82f6" name="혈당 (mg/dL)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {pulseData.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                  <Heart className="h-5 w-5 text-pink-500" />
                  맥박 그래프
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pulseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pulse" stroke="#ec4899" name="맥박 (bpm)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {weightData.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                  <WeightIcon className="h-5 w-5 text-purple-500" />
                  체중 그래프
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#a855f7" name="체중 (kg)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {temperatureData.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  체온 그래프
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[35, 40]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#f97316" name="체온 (°C)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {stepsDistanceData.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 flex items-center gap-2 font-medium">
                  <Footprints className="h-5 w-5 text-green-500" />
                  활동 기록 그래프
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stepsDistanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="steps"
                      stroke="#8884d8"
                      name="걸음수"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="distance"
                      stroke="#82ca9d"
                      name="거리 (km)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t("healthRecordsList")}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                className="gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-xs">{sortOrder === "newest" ? t("sortNewest") : t("sortOldest")}</span>
              </Button>
            </div>
            {sortedRecords.length === 0 ? (
              <p className="text-center text-muted-foreground">{t("noHealthRecords")}</p>
            ) : (
              sortedRecords.map((record) => (
                <div key={record.id} className="rounded-lg border bg-card p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-primary flex-shrink-0" />
                        <p className="text-sm font-medium">{record.date}</p>
                      </div>
                      <div className="mt-2 grid gap-1 text-sm">
                        {record.bloodPressureSystolic && record.bloodPressureDiastolic && (
                          <p>
                            {t("bloodPressure")}: {record.bloodPressureSystolic}/{record.bloodPressureDiastolic} mmHg
                          </p>
                        )}
                        {record.bloodSugar && (
                          <p>
                            {t("bloodSugar")}: {record.bloodSugar} mg/dL
                          </p>
                        )}
                        {record.pulse && (
                          <p>
                            {t("pulse")}: {record.pulse} bpm
                          </p>
                        )}
                        {record.weight && (
                          <p>
                            {t("weight")}: {record.weight} kg
                          </p>
                        )}
                        {record.temperature && (
                          <p>
                            {t("temperature")}: {record.temperature} °C
                          </p>
                        )}
                        {record.steps && (
                          <p className="flex items-center gap-1">
                            <Footprints className="h-3 w-3" />
                            걸음수: {record.steps.toLocaleString()}
                          </p>
                        )}
                        {record.distanceKm && <p>걸은 거리: {record.distanceKm} km</p>}
                        {record.cost && <p>의료비: {record.cost.toLocaleString()} 원</p>}
                        {record.medicineCost && <p>약값: {record.medicineCost.toLocaleString()} 원</p>}
                        {record.notes && <p className="mt-1 text-muted-foreground">{record.notes}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRecord(record)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRecord(record.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {record.attachments && record.attachments.length > 0 && (
                    <AttachmentList attachments={record.attachments as UploadedFile[]} compact />
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === "medications" && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <Button onClick={() => setIsAddingMedication(!isAddingMedication)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t("addMedication")}
            </Button>
          </div>

          {isAddingMedication && (
            <div className="mb-6 space-y-4 rounded-lg border bg-muted/50 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="medication-name">{t("medicationName")}</Label>
                  <Input
                    id="medication-name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    placeholder={t("medicationName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">{t("dosage")}</Label>
                  <Input
                    id="dosage"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                    placeholder={t("dosagePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">{t("frequency")}</Label>
                  <Input
                    id="frequency"
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                    placeholder={t("frequencyPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medication-time">{t("time")}</Label>
                  <Input
                    id="medication-time"
                    type="time"
                    lang={getLangCode()}
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">{t("startDate")}</Label>
                  <Input
                    id="start-date"
                    type="date"
                    lang={getLangCode()}
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">{t("endDate")}</Label>
                  <Input
                    id="end-date"
                    type="date"
                    lang={getLangCode()}
                    value={newMedication.endDate}
                    onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })}
                  />
                </div>
              </div>
              {newMedication.time && (
                <div className="flex items-center space-x-2 rounded-lg border bg-background p-3">
                  <input
                    type="checkbox"
                    id="alarm-enabled"
                    checked={newMedication.alarmEnabled}
                    onChange={(e) => setNewMedication({ ...newMedication, alarmEnabled: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="alarm-enabled" className="flex items-center gap-2 cursor-pointer">
                    {newMedication.alarmEnabled ? (
                      <Bell className="h-4 w-4 text-primary" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{t("enableMedicationAlarm")}</span>
                  </Label>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="medication-notes">{t("notes")}</Label>
                <Textarea
                  id="medication-notes"
                  value={newMedication.notes}
                  onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                  placeholder={t("notes")}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={editingMedicationId ? handleUpdateMedication : handleAddMedication}>
                  {editingMedicationId ? t("update") : t("save")}
                </Button>
                <Button variant="outline" onClick={handleCancelMedication}>
                  {t("cancel")}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t("medicationsList")}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                className="gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-xs">{sortOrder === "newest" ? t("sortNewest") : t("sortOldest")}</span>
              </Button>
            </div>
            {sortedMedications.length === 0 ? (
              <p className="text-center text-muted-foreground">{t("noMedications")}</p>
            ) : (
              sortedMedications.map((medication) => {
                const takenToday = wasTakenToday(medication.id)

                return (
                  <div
                    key={medication.id}
                    className={`rounded-lg border p-3 space-y-2 ${
                      takenToday ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : "bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary flex-shrink-0" />
                          <h5 className="font-medium">{medication.name}</h5>
                          {medication.alarmEnabled && medication.time && (
                            <Bell className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                          {takenToday && (
                            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                              ✓ {t("takenToday")}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 grid gap-1 text-sm">
                          {medication.dosage && (
                            <p>
                              {t("dosage")}: {medication.dosage}
                            </p>
                          )}
                          {medication.frequency && (
                            <p>
                              {t("frequency")}: {medication.frequency}
                            </p>
                          )}
                          {medication.time && (
                            <p className="flex items-center gap-1">
                              {t("time")}: {medication.time}
                              {medication.alarmEnabled && (
                                <span className="text-xs text-muted-foreground">({t("alarmEnabled")})</span>
                              )}
                            </p>
                          )}
                          {medication.startDate && (
                            <p>
                              {t("startDate")}: {medication.startDate}
                              {medication.endDate && ` ~ ${medication.endDate}`}
                            </p>
                          )}
                          {medication.notes && <p className="mt-1 text-muted-foreground">{medication.notes}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => handleEditMedication(medication)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMedication(medication.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </>
      )}

      <HandwritingCanvas
        isOpen={isHandwritingOpen}
        onClose={() => setIsHandwritingOpen(false)}
        onSave={handleHandwritingSave}
      />
    </div>
  )
}
