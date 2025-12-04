"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Paperclip, Mic, X, ImageIcon, Pencil, PenTool, ArrowUpDown, Car, Wrench } from "lucide-react"
import type { Vehicle, VehicleMaintenance } from "./personal-organizer-app"
import { useLanguage } from "@/lib/language-context"
import { AttachmentList } from "./attachment-list"
import { HandwritingCanvas } from "./handwriting-canvas"
import { uploadFileToStorage } from "@/lib/storage"

type UploadedFile = {
  name: string
  url: string
  type: string
}

type VehicleSectionProps = {
  vehicles: Vehicle[]
  setVehicles: (vehicles: Vehicle[]) => void
  maintenanceRecords: VehicleMaintenance[]
  setMaintenanceRecords: (records: VehicleMaintenance[]) => void
  userId?: string
}

export function VehicleSection({
  vehicles,
  setVehicles,
  maintenanceRecords,
  setMaintenanceRecords,
  userId,
}: VehicleSectionProps) {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false)
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isAddingMaintenance, setIsAddingMaintenance] = useState(false)
  const [editingMaintenanceId, setEditingMaintenanceId] = useState<string | null>(null)
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    purchaseDate: "",
    mileage: "",
    notes: "",
  })
  const [newMaintenance, setNewMaintenance] = useState({
    date: "",
    category: "",
    type: "repair" as "repair" | "preventive",
    cost: "",
    mileage: "",
    description: "",
    nextServiceDate: "",
    nextServiceMileage: "",
  })
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<UploadedFile[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const [isHandwritingOpen, setIsHandwritingOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const { t, language } = useLanguage()
  const maintenanceFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0])
    }
  }, [vehicles, selectedVehicle])

  useEffect(() => {
    if (isAddingMaintenance && maintenanceFormRef.current) {
      maintenanceFormRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [isAddingMaintenance])

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
      if (isAddingVehicle) {
        setNewVehicle({ ...newVehicle, notes: newVehicle.notes + " " + transcript })
      } else {
        setNewMaintenance({ ...newMaintenance, description: newMaintenance.description + " " + transcript })
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

  const handleAddVehicle = async () => {
    if (newVehicle.name) {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        name: newVehicle.name,
        make: newVehicle.make,
        model: newVehicle.model,
        year: newVehicle.year ? Number.parseInt(newVehicle.year) : undefined,
        licensePlate: newVehicle.licensePlate,
        purchaseDate: newVehicle.purchaseDate,
        mileage: newVehicle.mileage ? Number.parseInt(newVehicle.mileage) : undefined,
        notes: newVehicle.notes,
        createdAt: new Date(),
        user_id: userId || null,
      }
      setVehicles([...vehicles, vehicle])
      setSelectedVehicle(vehicle)
      setNewVehicle({
        name: "",
        make: "",
        model: "",
        year: "",
        licensePlate: "",
        purchaseDate: "",
        mileage: "",
        notes: "",
      })
      setIsAddingVehicle(false)
    }
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicleId(vehicle.id)
    setNewVehicle({
      name: vehicle.name,
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: vehicle.year?.toString() || "",
      licensePlate: vehicle.licensePlate || "",
      purchaseDate: vehicle.purchaseDate || "",
      mileage: vehicle.mileage?.toString() || "",
      notes: vehicle.notes || "",
    })
    setIsAddingVehicle(true)
  }

  const handleUpdateVehicle = async () => {
    if (!editingVehicleId || !newVehicle.name) return

    const updatedVehicle: Vehicle = {
      id: editingVehicleId,
      name: newVehicle.name,
      make: newVehicle.make,
      model: newVehicle.model,
      year: newVehicle.year ? Number.parseInt(newVehicle.year) : undefined,
      licensePlate: newVehicle.licensePlate,
      purchaseDate: newVehicle.purchaseDate,
      mileage: newVehicle.mileage ? Number.parseInt(newVehicle.mileage) : undefined,
      notes: newVehicle.notes,
      createdAt: new Date(),
      user_id: userId || null,
    }

    setVehicles(vehicles.map((v) => (v.id === editingVehicleId ? updatedVehicle : v)))
    if (selectedVehicle?.id === editingVehicleId) {
      setSelectedVehicle(updatedVehicle)
    }
    setNewVehicle({
      name: "",
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      purchaseDate: "",
      mileage: "",
      notes: "",
    })
    setEditingVehicleId(null)
    setIsAddingVehicle(false)
  }

  const handleDeleteVehicle = async (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(null)
    }
  }

  const handleCancelVehicle = () => {
    setIsAddingVehicle(false)
    setEditingVehicleId(null)
    setNewVehicle({
      name: "",
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      purchaseDate: "",
      mileage: "",
      notes: "",
    })
  }

  const convertFilesToDataUrls = async (files: File[], userId: string): Promise<UploadedFile[]> => {
    const results: UploadedFile[] = []

    for (const file of files) {
      const isAudioOrVideo = file.type.startsWith("audio/") || file.type.startsWith("video/")

      if (isAudioOrVideo) {
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

  const handleAddMaintenance = async () => {
    if (!selectedVehicle) {
      alert(t("pleaseSelectVehicle"))
      return
    }

    if (!newMaintenance.date) {
      alert(t("pleaseEnterMaintenanceDate"))
      return
    }

    if (!newMaintenance.category) {
      alert(t("pleaseSelectCategory"))
      return
    }

    try {
      let uploadedFiles: UploadedFile[] = []
      if (attachedFiles.length > 0 && userId) {
        uploadedFiles = await convertFilesToDataUrls(attachedFiles, userId)
      }

      const maintenance: VehicleMaintenance = {
        id: Date.now().toString(),
        vehicleId: selectedVehicle.id,
        date: newMaintenance.date,
        category: newMaintenance.category,
        type: newMaintenance.type,
        cost: newMaintenance.cost ? Number.parseFloat(newMaintenance.cost) : 0,
        mileage: newMaintenance.mileage ? Number.parseInt(newMaintenance.mileage) : undefined,
        description: newMaintenance.description,
        nextServiceDate: newMaintenance.nextServiceDate || undefined,
        nextServiceMileage: newMaintenance.nextServiceMileage
          ? Number.parseInt(newMaintenance.nextServiceMileage)
          : undefined,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        createdAt: new Date(),
        user_id: userId || null,
      }
      setMaintenanceRecords([...maintenanceRecords, maintenance])
      setNewMaintenance({
        date: "",
        category: "",
        type: "repair",
        cost: "",
        mileage: "",
        description: "",
        nextServiceDate: "",
        nextServiceMileage: "",
      })
      setAttachedFiles([])
      setIsAddingMaintenance(false)
    } catch (error) {
      console.error("[v0] Error adding maintenance:", error)
      alert(t("errorAddingMaintenance"))
    }
  }

  const handleEditMaintenance = (maintenance: VehicleMaintenance) => {
    setEditingMaintenanceId(maintenance.id)
    setNewMaintenance({
      date: maintenance.date,
      category: maintenance.category,
      type: maintenance.type,
      cost: maintenance.cost?.toString() || "",
      mileage: maintenance.mileage?.toString() || "",
      description: maintenance.description || "",
      nextServiceDate: maintenance.nextServiceDate || "",
      nextServiceMileage: maintenance.nextServiceMileage?.toString() || "",
    })
    setExistingAttachments((maintenance.attachments as UploadedFile[]) || [])
    setAttachedFiles([])
    setIsAddingMaintenance(true)
  }

  const handleUpdateMaintenance = async () => {
    if (!editingMaintenanceId) return

    if (!newMaintenance.date) {
      alert(t("pleaseEnterMaintenanceDate"))
      return
    }

    if (!newMaintenance.category) {
      alert(t("pleaseSelectCategory"))
      return
    }

    try {
      let uploadedFiles: UploadedFile[] = []
      if (attachedFiles.length > 0 && userId) {
        uploadedFiles = await convertFilesToDataUrls(attachedFiles, userId)
      }

      const allAttachments = [...existingAttachments, ...uploadedFiles]

      const updatedMaintenance: VehicleMaintenance = {
        id: editingMaintenanceId,
        vehicleId: selectedVehicle?.id || "",
        date: newMaintenance.date,
        category: newMaintenance.category,
        type: newMaintenance.type,
        cost: newMaintenance.cost ? Number.parseFloat(newMaintenance.cost) : 0,
        mileage: newMaintenance.mileage ? Number.parseInt(newMaintenance.mileage) : undefined,
        description: newMaintenance.description,
        nextServiceDate: newMaintenance.nextServiceDate || undefined,
        nextServiceMileage: newMaintenance.nextServiceMileage
          ? Number.parseInt(newMaintenance.nextServiceMileage)
          : undefined,
        attachments: allAttachments.length > 0 ? allAttachments : undefined,
        createdAt: new Date(),
        user_id: userId || null,
      }

      setMaintenanceRecords(maintenanceRecords.map((m) => (m.id === editingMaintenanceId ? updatedMaintenance : m)))
      setNewMaintenance({
        date: "",
        category: "",
        type: "repair",
        cost: "",
        mileage: "",
        description: "",
        nextServiceDate: "",
        nextServiceMileage: "",
      })
      setAttachedFiles([])
      setExistingAttachments([])
      setEditingMaintenanceId(null)
      setIsAddingMaintenance(false)
    } catch (error) {
      console.error("[v0] Error updating maintenance:", error)
      alert(t("errorUpdatingMaintenance"))
    }
  }

  const handleDeleteMaintenance = async (id: string) => {
    setMaintenanceRecords(maintenanceRecords.filter((m) => m.id !== id))
  }

  const handleRemoveExistingAttachment = (index: number) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index))
  }

  const handleCancelMaintenance = () => {
    setIsAddingMaintenance(false)
    setEditingMaintenanceId(null)
    setNewMaintenance({
      date: "",
      category: "",
      type: "repair",
      cost: "",
      mileage: "",
      description: "",
      nextServiceDate: "",
      nextServiceMileage: "",
    })
    setAttachedFiles([])
    setExistingAttachments([])
  }

  const handleHandwritingSave = async (imageBlob: Blob) => {
    const file = new File([imageBlob], `handwriting-${Date.now()}.png`, { type: "image/png" })
    setAttachedFiles([...attachedFiles, file])
  }

  const vehicleMaintenanceRecords = selectedVehicle
    ? maintenanceRecords.filter((m) => m.vehicleId === selectedVehicle.id)
    : []

  const sortedMaintenanceRecords = [...vehicleMaintenanceRecords].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  })

  const totalCostByCategory = vehicleMaintenanceRecords.reduce(
    (acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + (record.cost || 0)
      return acc
    },
    {} as Record<string, number>,
  )

  const upcomingMaintenance = vehicleMaintenanceRecords.filter(
    (m) => m.nextServiceDate && new Date(m.nextServiceDate) >= new Date(),
  )

  const getLangCode = () => {
    const langCodes = { ko: "ko-KR", en: "en-US", zh: "zh-CN", ja: "ja-JP" }
    return langCodes[language]
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("vehicleTitle")}</h2>
        <Button onClick={() => setIsAddingVehicle(!isAddingVehicle)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("addVehicle")}
        </Button>
      </div>

      {isAddingVehicle && (
        <div className="mb-6 space-y-4 rounded-lg border bg-muted/50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicle-name">{t("vehicleName")}</Label>
              <Input
                id="vehicle-name"
                value={newVehicle.name}
                onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                placeholder={t("vehicleNamePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-make">{t("vehicleMake")}</Label>
              <Input
                id="vehicle-make"
                value={newVehicle.make}
                onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                placeholder={t("vehicleMakePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-model">{t("vehicleModel")}</Label>
              <Input
                id="vehicle-model"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                placeholder={t("vehicleModelPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-year">{t("vehicleYear")}</Label>
              <Input
                id="vehicle-year"
                type="number"
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                placeholder="2020"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-license">{t("vehicleLicensePlate")}</Label>
              <Input
                id="vehicle-license"
                value={newVehicle.licensePlate}
                onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                placeholder={t("vehicleLicensePlatePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-purchase-date">{t("vehiclePurchaseDate")}</Label>
              <Input
                id="vehicle-purchase-date"
                type="date"
                lang={getLangCode()}
                value={newVehicle.purchaseDate}
                onChange={(e) => setNewVehicle({ ...newVehicle, purchaseDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-mileage">{t("vehicleMileage")}</Label>
              <Input
                id="vehicle-mileage"
                type="number"
                value={newVehicle.mileage}
                onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
                placeholder="50000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle-notes">{t("vehicleNotes")}</Label>
            <Textarea
              id="vehicle-notes"
              value={newVehicle.notes}
              onChange={(e) => setNewVehicle({ ...newVehicle, notes: e.target.value })}
              placeholder={t("vehicleNotes")}
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={editingVehicleId ? handleUpdateVehicle : handleAddVehicle}>
              {editingVehicleId ? t("update") : t("save")}
            </Button>
            <Button variant="outline" onClick={handleCancelVehicle}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-medium">{t("vehicleList")}</h3>
        {vehicles.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("noVehicles")}</p>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="space-y-4">
                <div
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    selectedVehicle?.id === vehicle.id ? "border-primary bg-primary/5" : "bg-card hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-primary flex-shrink-0" />
                        <h4 className="font-medium">{vehicle.name}</h4>
                      </div>
                      {vehicle.make && vehicle.model && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {vehicle.make} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
                        </p>
                      )}
                      {vehicle.licensePlate && (
                        <p className="mt-1 text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                      )}
                      {vehicle.mileage && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t("vehicleMileage")}: {vehicle.mileage.toLocaleString()} km
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditVehicle(vehicle)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteVehicle(vehicle.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedVehicle?.id === vehicle.id && (
                  <div className="space-y-4 rounded-lg border border-primary/30 bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {t("maintenanceRecordsFor")} {selectedVehicle.name}
                      </h3>
                      <Button onClick={() => setIsAddingMaintenance(!isAddingMaintenance)} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("addMaintenance")}
                      </Button>
                    </div>

                    {isAddingMaintenance && (
                      <div ref={maintenanceFormRef} className="space-y-4 rounded-lg border bg-muted/50 p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="maintenance-date">{t("maintenanceDate")}</Label>
                            <Input
                              id="maintenance-date"
                              type="date"
                              lang={getLangCode()}
                              value={newMaintenance.date}
                              onChange={(e) => setNewMaintenance({ ...newMaintenance, date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maintenance-category">{t("maintenanceCategory")}</Label>
                            <select
                              id="maintenance-category"
                              value={newMaintenance.category}
                              onChange={(e) => setNewMaintenance({ ...newMaintenance, category: e.target.value })}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <option value="">{t("selectCategory")}</option>
                              <option value="engine">{t("categoryEngine")}</option>
                              <option value="transmission">{t("categoryTransmission")}</option>
                              <option value="brakes">{t("categoryBrakes")}</option>
                              <option value="tires">{t("categoryTires")}</option>
                              <option value="battery">{t("categoryBattery")}</option>
                              <option value="oilChange">{t("categoryOilChange")}</option>
                              <option value="filters">{t("categoryFilters")}</option>
                              <option value="suspension">{t("categorySuspension")}</option>
                              <option value="electrical">{t("categoryElectrical")}</option>
                              <option value="bodyPaint">{t("categoryBodyPaint")}</option>
                              <option value="interior">{t("categoryInterior")}</option>
                              <option value="insurance">{t("categoryInsurance") || "보험료"}</option>
                              <option value="other">{t("categoryOther")}</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maintenance-type">{t("maintenanceType")}</Label>
                            <select
                              id="maintenance-type"
                              value={newMaintenance.type}
                              onChange={(e) =>
                                setNewMaintenance({
                                  ...newMaintenance,
                                  type: e.target.value as "repair" | "preventive",
                                })
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <option value="repair">{t("typeRepair")}</option>
                              <option value="preventive">{t("typePreventive")}</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maintenance-cost">{t("maintenanceCost")}</Label>
                            <Input
                              id="maintenance-cost"
                              type="number"
                              value={newMaintenance.cost}
                              onChange={(e) => setNewMaintenance({ ...newMaintenance, cost: e.target.value })}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maintenance-mileage">{t("maintenanceMileage")}</Label>
                            <Input
                              id="maintenance-mileage"
                              type="number"
                              value={newMaintenance.mileage}
                              onChange={(e) => setNewMaintenance({ ...newMaintenance, mileage: e.target.value })}
                              placeholder="50000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="next-service-date">{t("nextServiceDate")}</Label>
                            <Input
                              id="next-service-date"
                              type="date"
                              lang={getLangCode()}
                              value={newMaintenance.nextServiceDate}
                              onChange={(e) =>
                                setNewMaintenance({ ...newMaintenance, nextServiceDate: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="next-service-mileage">{t("nextServiceMileage")}</Label>
                            <Input
                              id="next-service-mileage"
                              type="number"
                              value={newMaintenance.nextServiceMileage}
                              onChange={(e) =>
                                setNewMaintenance({ ...newMaintenance, nextServiceMileage: e.target.value })
                              }
                              placeholder="55000"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maintenance-description">{t("maintenanceDescription")}</Label>
                          <Textarea
                            id="maintenance-description"
                            value={newMaintenance.description}
                            onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
                            placeholder={t("maintenanceDescription")}
                            rows={3}
                          />
                        </div>
                        {existingAttachments.length > 0 && (
                          <div className="space-y-2">
                            <Label>{t("existingAttachments")}</Label>
                            <div className="flex flex-wrap gap-2">
                              {existingAttachments.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 rounded-md border bg-background px-3 py-2"
                                >
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
                                <div
                                  key={index}
                                  className="flex items-center gap-2 rounded-md border bg-background px-3 py-2"
                                >
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
                          <Button onClick={editingMaintenanceId ? handleUpdateMaintenance : handleAddMaintenance}>
                            {editingMaintenanceId ? t("update") : t("save")}
                          </Button>
                          <Button variant="outline" onClick={handleCancelMaintenance}>
                            {t("cancel")}
                          </Button>
                        </div>
                      </div>
                    )}

                    {upcomingMaintenance.length > 0 && (
                      <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-4">
                        <h4 className="mb-2 flex items-center gap-2 font-medium text-orange-700 dark:text-orange-400">
                          <Wrench className="h-4 w-4" />
                          {t("upcomingMaintenance")}
                        </h4>
                        <div className="space-y-2">
                          {upcomingMaintenance.map((m) => (
                            <div key={m.id} className="text-sm">
                              <span className="font-medium">
                                {t(`category${m.category.charAt(0).toUpperCase() + m.category.slice(1)}`)}
                              </span>
                              {" - "}
                              {m.nextServiceDate && (
                                <span>
                                  {t("nextServiceDate")}: {m.nextServiceDate}
                                </span>
                              )}
                              {m.nextServiceMileage && (
                                <span>
                                  {" "}
                                  ({t("nextServiceMileage")}: {m.nextServiceMileage.toLocaleString()} km)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {Object.keys(totalCostByCategory).length > 0 && (
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <h4 className="mb-3 font-medium">{t("costByCategory")}</h4>
                        <div className="space-y-2">
                          {Object.entries(totalCostByCategory)
                            .sort(([, a], [, b]) => b - a)
                            .map(([category, cost]) => (
                              <div key={category} className="flex items-center justify-between text-sm">
                                <span>{t(`category${category.charAt(0).toUpperCase() + category.slice(1)}`)}</span>
                                <span className="font-medium">
                                  {cost.toLocaleString()} {t("currency")}
                                </span>
                              </div>
                            ))}
                          <div className="mt-3 flex items-center justify-between border-t pt-2 font-medium">
                            <span>{t("totalCost")}</span>
                            <span>
                              {Object.values(totalCostByCategory)
                                .reduce((a, b) => a + b, 0)
                                .toLocaleString()}{" "}
                              {t("currency")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{t("maintenanceHistory")}</h4>
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
                      {sortedMaintenanceRecords.length === 0 ? (
                        <p className="text-center text-muted-foreground">{t("noMaintenanceRecords")}</p>
                      ) : (
                        sortedMaintenanceRecords.map((record) => (
                          <div key={record.id} className="rounded-lg border bg-card p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Wrench className="h-4 w-4 text-primary flex-shrink-0" />
                                  <h5 className="font-medium">
                                    {t(`category${record.category.charAt(0).toUpperCase() + record.category.slice(1)}`)}
                                  </h5>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-xs ${
                                      record.type === "repair"
                                        ? "bg-red-500/10 text-red-700 dark:text-red-400"
                                        : "bg-green-500/10 text-green-700 dark:text-green-400"
                                    }`}
                                  >
                                    {t(`type${record.type.charAt(0).toUpperCase() + record.type.slice(1)}`)}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {t("maintenanceDate")}: {record.date}
                                </p>
                                {record.mileage && (
                                  <p className="text-sm text-muted-foreground">
                                    {t("maintenanceMileage")}: {record.mileage.toLocaleString()} km
                                  </p>
                                )}
                                {record.cost && (
                                  <p className="text-sm font-medium">
                                    {t("maintenanceCost")}: {record.cost.toLocaleString()} {t("currency")}
                                  </p>
                                )}
                                {record.description && <p className="mt-1 text-sm">{record.description}</p>}
                                {(record.nextServiceDate || record.nextServiceMileage) && (
                                  <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                                    {t("nextService")}: {record.nextServiceDate && record.nextServiceDate}
                                    {record.nextServiceMileage && ` (${record.nextServiceMileage.toLocaleString()} km)`}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <Button variant="ghost" size="sm" onClick={() => handleEditMaintenance(record)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteMaintenance(record.id)}>
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <HandwritingCanvas
        isOpen={isHandwritingOpen}
        onClose={() => setIsHandwritingOpen(false)}
        onSave={handleHandwritingSave}
      />
    </div>
  )
}
