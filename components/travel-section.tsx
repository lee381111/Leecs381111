"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Paperclip, Mic, MapPinIcon, X, ImageIcon, Pencil, PenTool, ArrowUpDown } from "lucide-react"
import type { TravelLocation } from "./personal-organizer-app"
import { useLanguage } from "@/lib/language-context"
import { HandwritingCanvas } from "./handwriting-canvas"
import { AttachmentList } from "./attachment-list"
import { uploadFileToStorage } from "@/lib/storage"

type UploadedFile = {
  name: string
  url: string
  type: string
}

type TravelSectionProps = {
  travelLocations: TravelLocation[]
  setTravelLocations: (locations: TravelLocation[]) => void
  userId?: string
}

export function TravelSection({ travelLocations, setTravelLocations, userId }: TravelSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newLocation, setNewLocation] = useState({
    name: "",
    travelDate: "",
    locationType: "",
    notes: "",
  })
  const [mapLoaded, setMapLoaded] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<UploadedFile[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const [isHandwritingOpen, setIsHandwritingOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>("all")
  const { t, language } = useLanguage()

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    setMapLoaded(true)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

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
      setNewLocation({ ...newLocation, notes: newLocation.notes + " " + transcript })
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

  const handleAddLocation = async () => {
    if (newLocation.name) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newLocation.name)}`,
        )
        const data = await response.json()

        if (data && data.length > 0) {
          let uploadedFiles: UploadedFile[] = []
          if (attachedFiles.length > 0 && userId) {
            uploadedFiles = await convertFilesToDataUrls(attachedFiles, userId)
          }

          const location: TravelLocation = {
            id: Date.now().toString(),
            name: newLocation.name,
            date: new Date(),
            travelDate: newLocation.travelDate,
            locationType: newLocation.locationType,
            notes: newLocation.notes,
            lat: Number.parseFloat(data[0].lat),
            lng: Number.parseFloat(data[0].lon),
            user_id: userId || null,
            attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
          }
          setTravelLocations([...travelLocations, location])
          setNewLocation({ name: "", travelDate: "", locationType: "", notes: "" })
          setAttachedFiles([])
          setIsAdding(false)
        } else {
          const messages = {
            ko: "위치를 찾을 수 없습니다. 다른 이름으로 시도해주세요.",
            en: "Location not found. Please try a different name.",
            zh: "找不到位置。请尝试其他名称。",
            ja: "場所が見つかりません。別の名前で試してください。",
          }
          alert(messages[language])
        }
      } catch (error) {
        console.error("[v0] Error geocoding location:", error)
        const messages = {
          ko: "위치 검색 중 오류가 발생했습니다.",
          en: "An error occurred while searching for the location.",
          zh: "搜索位置时发生错误。",
          ja: "場所の検索中にエラーが発生しました。",
        }
        alert(messages[language])
      }
    }
  }

  const handleEdit = (location: TravelLocation) => {
    setEditingId(location.id)
    setNewLocation({
      name: location.name,
      travelDate: location.travelDate || "",
      locationType: location.locationType || "",
      notes: location.notes || "",
    })
    setExistingAttachments((location.attachments as UploadedFile[]) || [])
    setAttachedFiles([])
    setIsAdding(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !newLocation.name) return

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newLocation.name)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        let uploadedFiles: UploadedFile[] = []
        if (attachedFiles.length > 0 && userId) {
          uploadedFiles = await convertFilesToDataUrls(attachedFiles, userId)
        }

        const allAttachments = [...existingAttachments, ...uploadedFiles]

        const updatedLocation: TravelLocation = {
          id: editingId,
          name: newLocation.name,
          date: new Date(),
          travelDate: newLocation.travelDate,
          locationType: newLocation.locationType,
          notes: newLocation.notes,
          lat: Number.parseFloat(data[0].lat),
          lng: Number.parseFloat(data[0].lon),
          attachments: allAttachments.length > 0 ? allAttachments : undefined,
          user_id: userId || null,
        }

        setTravelLocations(travelLocations.map((loc) => (loc.id === editingId ? updatedLocation : loc)))
        setNewLocation({ name: "", travelDate: "", locationType: "", notes: "" })
        setAttachedFiles([])
        setExistingAttachments([])
        setEditingId(null)
        setIsAdding(false)
      } else {
        const messages = {
          ko: "위치를 찾을 수 없습니다. 다른 이름으로 시도해주세요.",
          en: "Location not found. Please try a different name.",
          zh: "找不到位置。请尝试其他名称。",
          ja: "場所が見つかりません。別の名前で試してください。",
        }
        alert(messages[language])
      }
    } catch (error) {
      console.error("[v0] Error updating location:", error)
      const messages = {
        ko: "위치 업데이트 중 오류가 발생했습니다.",
        en: "An error occurred while updating the location.",
        zh: "更新位置时发生错误。",
        ja: "場所の更新中にエラーが発生しました。",
      }
      alert(messages[language])
    }
  }

  const handleRemoveExistingAttachment = (index: number) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index))
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setNewLocation({ name: "", travelDate: "", locationType: "", notes: "" })
    setAttachedFiles([])
    setExistingAttachments([])
  }

  const handleHandwritingSave = async (imageBlob: Blob) => {
    const file = new File([imageBlob], `handwriting-${Date.now()}.png`, { type: "image/png" })
    setAttachedFiles([...attachedFiles, file])
  }

  const handleDelete = async (id: string) => {
    setTravelLocations(travelLocations.filter((l) => l.id !== id))
  }

  const filteredAndSortedLocations = [...travelLocations]
    .filter((location) => {
      if (locationTypeFilter === "all") return true
      return location.locationType === locationTypeFilter
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.date.getTime() - a.date.getTime()
      } else {
        return a.date.getTime() - b.date.getTime()
      }
    })

  const groupedLocations = filteredAndSortedLocations.reduce(
    (groups, location) => {
      const type = location.locationType || "other"
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(location)
      return groups
    },
    {} as Record<string, TravelLocation[]>,
  )

  const getLangCode = () => {
    const langCodes = { ko: "ko-KR", en: "en-US", zh: "zh-CN", ja: "ja-JP" }
    return langCodes[language]
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("travelTitle")}</h2>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("addTravel")}
        </Button>
      </div>

      {isAdding && (
        <div className="mb-6 space-y-4 rounded-lg border bg-muted/50 p-4">
          <div className="space-y-2">
            <Label htmlFor="location-name">{t("locationName")}</Label>
            <Input
              id="location-name"
              value={newLocation.name}
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
              placeholder={
                language === "ko"
                  ? "예: 서울, 파리, 도쿄"
                  : language === "en"
                    ? "e.g., Seoul, Paris, Tokyo"
                    : language === "zh"
                      ? "例如：首尔、巴黎、东京"
                      : "例：ソウル、パリ、東京"
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="travel-date">{t("travelDate")}</Label>
            <Input
              id="travel-date"
              type="date"
              lang={getLangCode()}
              value={newLocation.travelDate}
              onChange={(e) => setNewLocation({ ...newLocation, travelDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-type">{t("locationType")}</Label>
            <select
              id="location-type"
              value={newLocation.locationType}
              onChange={(e) => setNewLocation({ ...newLocation, locationType: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">{t("selectLocationType")}</option>
              <option value="city">{t("typeCity")}</option>
              <option value="nature">{t("typeNature")}</option>
              <option value="beach">{t("typeBeach")}</option>
              <option value="mountain">{t("typeMountain")}</option>
              <option value="historical">{t("typeHistorical")}</option>
              <option value="themePark">{t("typeThemePark")}</option>
              <option value="cafe">{t("typeCafe")}</option>
              <option value="restaurant">{t("typeRestaurant")}</option>
              <option value="other">{t("typeOther")}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-notes">{t("travelNotes")}</Label>
            <Textarea
              id="location-notes"
              value={newLocation.notes}
              onChange={(e) => setNewLocation({ ...newLocation, notes: e.target.value })}
              placeholder={t("travelNotes")}
              rows={4}
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
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => handleRemoveFile(index)}>
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
              accept="image/*,video/*"
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
            <Button onClick={editingId ? handleUpdate : handleAddLocation}>
              {editingId ? t("update") : t("save")}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t("locationList")}</h3>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="type-filter" className="text-sm whitespace-nowrap">
                {t("filterByType")}:
              </Label>
              <select
                id="type-filter"
                value={locationTypeFilter}
                onChange={(e) => setLocationTypeFilter(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">{t("allTypes")}</option>
                <option value="city">{t("typeCity")}</option>
                <option value="nature">{t("typeNature")}</option>
                <option value="beach">{t("typeBeach")}</option>
                <option value="mountain">{t("typeMountain")}</option>
                <option value="historical">{t("typeHistorical")}</option>
                <option value="themePark">{t("typeThemePark")}</option>
                <option value="cafe">{t("typeCafe")}</option>
                <option value="restaurant">{t("typeRestaurant")}</option>
                <option value="other">{t("typeOther")}</option>
              </select>
            </div>
          </div>
          {filteredAndSortedLocations.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("noTravelLocations")}</p>
          ) : (
            filteredAndSortedLocations.map((location) => (
              <div key={location.id} className="rounded-lg border bg-card p-3 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <h4 className="font-medium">{location.name}</h4>
                    </div>
                    {location.travelDate && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("travelDate")}: {location.travelDate}
                      </p>
                    )}
                    {location.locationType && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("locationType")}:{" "}
                        {t(`type${location.locationType.charAt(0).toUpperCase() + location.locationType.slice(1)}`)}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">{location.notes}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{location.date.toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(location)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(location.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {location.attachments && location.attachments.length > 0 && (
                  <AttachmentList attachments={location.attachments as UploadedFile[]} compact />
                )}
              </div>
            ))
          )}
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="mb-3 font-medium">{t("map")}</h3>
          {mapLoaded ? (
            <TravelMap locations={filteredAndSortedLocations} />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">{t("loading")}</p>
            </div>
          )}
        </div>
      </div>
      <HandwritingCanvas
        isOpen={isHandwritingOpen}
        onClose={() => setIsHandwritingOpen(false)}
        onSave={handleHandwritingSave}
      />
    </div>
  )
}

function TravelMap({ locations }: { locations: TravelLocation[] }) {
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)
    })
  }, [])

  useEffect(() => {
    if (!L || map) return

    const mapInstance = L.map("travel-map").setView([37.5665, 126.978], 2)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance)

    setMap(mapInstance)

    return () => {
      markersRef.current.forEach((marker) => {
        try {
          mapInstance.removeLayer(marker)
        } catch (e) {
          // Ignore errors during cleanup
        }
      })
      markersRef.current = []
      mapInstance.remove()
    }
  }, [L])

  useEffect(() => {
    if (!map || !L || locations.length === 0) return

    markersRef.current.forEach((marker) => {
      try {
        map.removeLayer(marker)
      } catch (e) {
        // Ignore errors if marker is already removed
      }
    })
    markersRef.current = []

    const bounds: any[] = []
    locations.forEach((location) => {
      const redIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      const marker = L.marker([location.lat, location.lng], { icon: redIcon }).addTo(map)
      markersRef.current.push(marker)

      const popupContent = `
        <div style="min-width: 150px;">
          <b>${location.name}</b><br>
          ${location.travelDate ? `<small>날짜: ${location.travelDate}</small><br>` : ""}
          ${location.notes ? `<small>메모: ${location.notes}</small>` : ""}
        </div>
      `
      marker.bindPopup(popupContent)
      bounds.push([location.lat, location.lng])
    })

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, L, locations])

  return <div id="travel-map" className="h-64 w-full rounded-md" />
}
