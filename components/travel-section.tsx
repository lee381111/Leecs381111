"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react"
import { saveTravelRecords, loadTravelRecords } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import type { TravelRecord, Attachment } from "@/lib/types"
import { MediaTools } from "@/components/media-tools"
import { getCoordinates } from "@/lib/geocoding"
import { Spinner } from "@/components/ui/spinner"
import { getTranslation } from "@/lib/i18n"
import dynamic from "next/dynamic"

const TravelMap = dynamic(() => import("@/components/travel-map").then((mod) => mod.TravelMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <Spinner className="h-12 w-12" />
    </div>
  ),
})

interface TravelSectionProps {
  onBack: () => void
  language: string
}

export function TravelSection({ onBack, language }: TravelSectionProps) {
  console.log("[v0] TravelSection rendering")

  const { user } = useAuth()
  const [travels, setTravels] = useState<TravelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedTravel, setSelectedTravel] = useState<TravelRecord | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isSelectingLocation, setIsSelectingLocation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
    category: "기타" as "도시" | "자연" | "산" | "바다" | "유적지" | "맛집" | "카페" | "기타",
    latitude: "",
    longitude: "",
    expense: "",
    attachments: [] as Attachment[],
  })

  const t = (key: string) => getTranslation(language as any, key)

  useEffect(() => {
    console.log("[v0] useEffect: Loading travel data")
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      console.log("[v0] loadData: Starting")
      setLoading(true)
      setError(null)

      if (!user?.id) return

      const data = await loadTravelRecords(user.id)
      console.log("[v0] loadData: Loaded", data.length, "travels")

      const updatedData = data.map((travel) => {
        if (!travel.latitude || !travel.longitude) {
          const coords = getCoordinates(travel.destination)
          return { ...travel, latitude: coords?.lat, longitude: coords?.lon }
        }
        return travel
      })

      setTravels(updatedData)

      if (JSON.stringify(data) !== JSON.stringify(updatedData)) {
        await saveTravelRecords(updatedData, user.id)
      }
    } catch (err) {
      console.error("[v0] Error loading travel records:", err)
      setError("여행 기록을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
      console.log("[v0] loadData: Finished")
    }
  }

  const handleSave = async (attachments: Attachment[] = []) => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    if (!formData.destination.trim()) {
      alert("여행지를 입력해주세요")
      return
    }

    // Validate dates
    if (!formData.startDate || !formData.endDate) {
      alert("출발일과 종료일을 입력해주세요")
      return
    }

    try {
      setSaving(true)
      console.log("[v0] 💾 Saving travel with", attachments.length, "attachments")
      attachments.forEach((att, idx) => {
        console.log(`[v0] Attachment ${idx + 1}:`, {
          type: att.type,
          hasUrl: !!att.url,
          hasData: !!att.data,
          dataLength: att.data?.length || 0,
        })
      })

      let updated: TravelRecord[]
      if (editingId) {
        updated = travels.map((t) =>
          t.id === editingId
            ? {
                ...t,
                destination: formData.destination,
                startDate: formData.startDate,
                endDate: formData.endDate,
                notes: formData.notes,
                category: formData.category,
                latitude: formData.latitude,
                longitude: formData.longitude,
                expense: formData.expense ? Number(formData.expense) : undefined,
                attachments,
              }
            : t,
        )
      } else {
        const uuid = crypto.randomUUID()
        const travel: TravelRecord = {
          id: uuid,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          notes: formData.notes,
          description: formData.notes,
          expenses: "",
          category: formData.category || "기타",
          latitude: formData.latitude,
          longitude: formData.longitude,
          expense: formData.expense ? Number(formData.expense) : undefined,
          attachments,
          createdAt: new Date().toISOString(),
          user_id: user?.id,
        }
        console.log("[v0] 📝 New travel record created with UUID:", uuid)
        updated = [travel, ...travels]
      }

      setTravels(updated)
      await saveTravelRecords(updated, user.id)
      console.log("[v0] ✅ Travel records saved successfully")

      setIsAdding(false)
      setEditingId(null)
      setFormData({
        destination: "",
        startDate: "",
        endDate: "",
        notes: "",
        category: "기타",
        latitude: "",
        longitude: "",
        expense: "",
        attachments: [],
      })

      alert("여행 기록이 저장되었습니다!")
    } catch (error) {
      console.error("[v0] Error saving travel:", error)
      alert("저장 중 오류가 발생했습니다: " + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (travel: TravelRecord) => {
    setFormData({
      destination: travel.destination,
      startDate: travel.startDate,
      endDate: travel.endDate,
      notes: travel.notes || "",
      category: travel.category || "기타",
      latitude: travel.latitude?.toString() || "",
      longitude: travel.longitude?.toString() || "",
      expense: travel.expense?.toString() || "",
      attachments: travel.attachments || [],
    })
    setEditingId(travel.id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("이 여행 기록을 삭제하시겠습니까?")) return

    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    try {
      const updated = travels.filter((t) => t.id !== id)
      setTravels(updated)
      await saveTravelRecords(updated, user.id)
      alert("삭제되었습니다")
    } catch (error) {
      console.error("[v0] Error deleting travel:", error)
      alert("삭제 중 오류가 발생했습니다")
    }
  }

  const calculateMapBounds = () => {
    if (travels.length === 0) {
      return { minLat: 33, maxLat: 38, minLon: 125, maxLon: 130 }
    }

    const validTravels = travels.filter((t) => t.latitude != null && t.longitude != null)
    if (validTravels.length === 0) {
      return { minLat: 33, maxLat: 38, minLon: 125, maxLon: 130 }
    }

    const lats = validTravels.map((t) => Number(t.latitude))
    const lons = validTravels.map((t) => Number(t.longitude))

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)

    const baseLatRange = Math.max(maxLat - minLat, 0.5)
    const baseLonRange = Math.max(maxLon - minLon, 0.5)

    const latRange = baseLatRange / zoomLevel + 0.3
    const lonRange = baseLonRange / zoomLevel + 0.3

    const centerLat = (minLat + maxLat) / 2
    const centerLon = (minLon + maxLon) / 2

    return {
      minLat: centerLat - latRange,
      maxLat: centerLat + latRange,
      minLon: centerLon - lonRange,
      maxLon: centerLon + lonRange,
    }
  }

  const bounds = calculateMapBounds()
  const [mapCenter, setMapCenter] = useState({ lat: 37.5, lon: 127.0, zoom: 7 })

  const handleAttachmentsChange = (attachments: Attachment[]) => {
    setFormData({ ...formData, attachments })
  }

  const handleTranscriptReceived = (text: string) => {
    setFormData({ ...formData, notes: formData.notes + text })
  }

  if (error) {
    console.log("[v0] Rendering error state")
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("title")}
        </Button>
        <Card className="p-8 text-center bg-red-50 border-red-200">
          <p className="text-red-600 font-semibold">{error}</p>
          <Button onClick={loadData} className="mt-4">
            다시 시도
          </Button>
        </Card>
      </div>
    )
  }

  if (isAdding) {
    console.log("[v0] Rendering add/edit form")
    return (
      <div className="p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            console.log("[v0] Cancelling add/edit")
            setIsAdding(false)
            setEditingId(null)
            setIsSelectingLocation(false)
            setFormData({
              destination: "",
              startDate: "",
              endDate: "",
              notes: "",
              category: "기타",
              latitude: "",
              longitude: "",
              expense: "",
              attachments: [],
            })
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("title")}
        </Button>
        <h2 className="text-xl font-bold">{editingId ? "여행 기록 수정" : "새 여행 기록"}</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium">여행지</label>
          <Input
            placeholder="예: 제주 한라산, 서울 남산, 파리, 뉴욕"
            value={formData.destination}
            onChange={(e) => {
              const newDestination = e.target.value
              setFormData({ ...formData, destination: newDestination })

              if (newDestination.trim()) {
                const coords = getCoordinates(newDestination)
                if (coords) {
                  setFormData((prev) => ({
                    ...prev,
                    destination: newDestination,
                    latitude: coords.lat.toFixed(4),
                    longitude: coords.lon.toFixed(4),
                  }))
                  console.log(
                    `[v0] 좌표 계산: ${newDestination} → 위도 ${coords.lat.toFixed(4)}, 경도 ${coords.lon.toFixed(4)}`,
                  )
                }
              }
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-emerald-700">📍 위도</label>
            <Input
              placeholder="자동 계산 또는 수동 입력"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="bg-emerald-100 border-emerald-300 font-mono text-emerald-900 font-semibold"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-emerald-700">📍 경도</label>
            <Input
              placeholder="자동 계산 또는 수동 입력"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="bg-emerald-100 border-emerald-300 font-mono text-emerald-900 font-semibold"
            />
          </div>
        </div>

        <Button
          onClick={() => setIsSelectingLocation(!isSelectingLocation)}
          variant={isSelectingLocation ? "default" : "outline"}
          className={`w-full ${isSelectingLocation ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}`}
        >
          {isSelectingLocation ? "✖️ 위치 선택 취소" : "🗺️ 지도에서 직접 위치 선택하기"}
        </Button>

        {isSelectingLocation && (
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400">
            <div className="mb-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
              <p className="text-sm font-semibold text-yellow-900 text-center">
                💡 지도를 클릭하여 정확한 위치를 선택하세요
              </p>
            </div>
            <TravelMap
              travels={[]}
              onMarkerClick={() => {}}
              clickMode={true}
              language={language}
              onMapClick={(lat: number, lon: number) => {
                console.log("[v0] Location selected from map:", lat, lon)
                setFormData({
                  ...formData,
                  latitude: lat.toFixed(4),
                  longitude: lon.toFixed(4),
                })
                setIsSelectingLocation(false)
                console.log("[v0] Form updated with coordinates, selection mode closed")
                alert(`✅ 위치가 선택되었습니다!\n📍 위도: ${lat.toFixed(4)}, 경도: ${lon.toFixed(4)}`)
              }}
            />
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">출발일</label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="p-2 border rounded"
              placeholder={t("startDate")}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">종료일</label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="p-2 border rounded"
              placeholder={t("endDate")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">카테고리</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full p-2 border rounded bg-white"
          >
            <option value="도시">🏙️ 도시</option>
            <option value="자연">🌿 자연</option>
            <option value="산">⛰️ 산</option>
            <option value="바다">🌊 바다</option>
            <option value="유적지">🏛️ 유적지</option>
            <option value="맛집">🍽️ 맛집</option>
            <option value="카페">☕ 카페</option>
            <option value="기타">📌 기타</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">💰 여행 비용 (원)</label>
          <Input
            type="number"
            placeholder="여행 비용을 입력하세요"
            value={formData.expense}
            onChange={(e) => setFormData({ ...formData, expense: e.target.value })}
            className="p-2 border rounded"
          />
          <p className="text-xs text-muted-foreground">💡 입력하면 가계부에 자동으로 기록됩니다</p>
        </div>

        <Textarea
          placeholder={t("notes")}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={5}
        />

        <MediaTools
          attachments={formData.attachments || []}
          onAttachmentsChange={handleAttachmentsChange}
          onSave={(attachments) => handleSave(attachments)}
          saving={saving}
          onTextFromSpeech={handleTranscriptReceived}
        />
      </div>
    )
  }

  console.log("[v0] Rendering main list view with", travels.length, "travels")
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("title")}
        </Button>
        <Button
          onClick={() => {
            console.log("[v0] Add button clicked")
            setIsAdding(true)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" /> {t("add")} {t("travel")}
        </Button>
      </div>

      <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
        <h3 className="font-semibold mb-4 text-lg">🗺️ {t("travel_map")}</h3>
        <TravelMap travels={travels} onMarkerClick={(travel) => setSelectedTravel(travel)} language={language} />
      </Card>

      <div className="grid gap-4">
        {travels.map((travel) => (
          <Card key={travel.id} className={`p-4 ${selectedTravel?.id === travel.id ? "ring-2 ring-emerald-500" : ""}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {travel.category === "도시" && "🏙️"}
                  {travel.category === "자연" && "🌿"}
                  {travel.category === "산" && "⛰️"}
                  {travel.category === "바다" && "🌊"}
                  {travel.category === "유적지" && "🏛️"}
                  {travel.category === "맛집" && "🍽️"}
                  {travel.category === "카페" && "☕"}
                  {(!travel.category || travel.category === "기타") && "📍"} {travel.destination}
                </h3>
                {travel.category && <span className="text-xs text-gray-500">{travel.category}</span>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(travel)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(travel.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              📅 {travel.startDate} ~ {travel.endDate}
            </p>

            {travel.latitude && travel.longitude && (
              <p className="text-xs text-emerald-600 mb-2">
                📍 위도: {Number(travel.latitude).toFixed(4)}, 경도: {Number(travel.longitude).toFixed(4)}
              </p>
            )}

            {travel.expense && travel.expense > 0 && (
              <p className="text-sm font-semibold text-blue-600 mb-2">
                💰 여행 비용: {travel.expense.toLocaleString()}원
              </p>
            )}

            {travel.notes && <p className="text-sm mt-2">{travel.notes}</p>}

            {travel.attachments && travel.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">첨부파일 ({travel.attachments.length}개)</p>
                <div className="grid grid-cols-2 gap-2">
                  {travel.attachments.map((file: any, idx: number) => {
                    const isImage =
                      file.type?.startsWith("image/") ||
                      file.type === "image" ||
                      file.type === "drawing" ||
                      file.name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
                    const isVideo =
                      file.type?.startsWith("video/") ||
                      file.type === "video" ||
                      file.name?.match(/\.(mp4|webm|mov|avi)$/i)
                    const isAudio =
                      file.type?.startsWith("audio/") ||
                      file.type === "audio" ||
                      file.name?.match(/\.(mp3|wav|ogg|m4a)$/i)

                    if (isImage) {
                      return (
                        <div
                          key={idx}
                          className="relative border rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
                          onClick={() => setSelectedImage(file.url || file.data)}
                        >
                          <img
                            src={file.url || file.data}
                            alt={file.name || "첨부파일"}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                            }}
                          />
                        </div>
                      )
                    }
                    if (isVideo) {
                      return (
                        <div key={idx} className="border rounded overflow-hidden">
                          <video src={file.url || file.data} controls playsInline className="w-full h-32 bg-black" />
                        </div>
                      )
                    }
                    if (isAudio) {
                      return (
                        <div key={idx} className="flex items-center justify-center h-20 bg-gray-100 border rounded">
                          <audio src={file.url || file.data} controls className="w-full px-2" />
                        </div>
                      )
                    }
                    return (
                      <div key={idx} className="flex items-center justify-center h-20 bg-gray-200 border rounded p-2">
                        <p className="text-xs text-gray-600 text-center truncate">{file.name || "파일"}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </Card>
        ))}

        {travels.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            <p>아직 여행 기록이 없습니다</p>
            <p className="text-sm mt-2">첫 여행 기록을 추가해보세요!</p>
          </Card>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="확대 이미지"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black font-bold py-2 px-4 rounded-full shadow-lg"
            >
              ✕ 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
