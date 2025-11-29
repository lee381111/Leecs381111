"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Plus,
  Camera,
  Trash2,
  Pencil,
  User,
  Building,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  ArrowUpDown,
  RotateCw,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { saveBusinessCards, loadBusinessCards } from "@/lib/storage"
import { getTranslation } from "@/lib/i18n"
import type { Language, BusinessCard } from "@/lib/types"

export function BusinessCardSection({ onBack, language }: { onBack: () => void; language: Language }) {
  const { user } = useAuth()
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([])
  const [sortBy, setSortBy] = useState<"name" | "company" | "date">("date")
  const [showAddCard, setShowAddCard] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })
  const [attachments, setAttachments] = useState<any[]>([])
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [imageRotations, setImageRotations] = useState<Record<string, number>>({})

  const t = (key: string) => getTranslation(language, key)

  useEffect(() => {
    if (user) {
      loadBusinessCards(user.id)
        .then((cards) => {
          console.log("[v0] Loaded business cards:", cards.length)
          setBusinessCards(cards)
          const rotations: Record<string, number> = {}
          cards.forEach((card) => {
            if (card.rotation !== undefined) {
              rotations[card.id] = card.rotation
            }
          })
          setImageRotations(rotations)
        })
        .catch((error) => {
          console.warn("[v0] Failed to load business cards:", error)
          setBusinessCards([])
        })
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return

    if (!formData.name && !formData.company && !formData.phone && !formData.email && attachments.length === 0) {
      alert(t("require_one_info"))
      return
    }

    const newCard: BusinessCard = {
      id: editingId || crypto.randomUUID(),
      ...formData,
      imageUrl: attachments[0]?.url || attachments[0]?.data || "",
      attachments,
      rotation: editingId ? imageRotations[editingId] || 0 : 0,
      createdAt: new Date().toISOString(),
      user_id: user.id,
    }

    const updatedCards = editingId
      ? businessCards.map((card) => (card.id === editingId ? newCard : card))
      : [...businessCards, newCard]

    setBusinessCards(updatedCards)

    try {
      await saveBusinessCards(updatedCards, user.id)
    } catch (error) {
      console.error("[v0] Failed to save business card:", error)
    }

    setFormData({
      name: "",
      company: "",
      position: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    })
    setAttachments([])
    setShowAddCard(false)
    setEditingId(null)
  }

  const handleEdit = (card: BusinessCard) => {
    setFormData({
      name: card.name,
      company: card.company,
      position: card.position,
      phone: card.phone,
      email: card.email,
      address: card.address || "",
      notes: card.notes || "",
    })
    setAttachments(card.attachments || [])
    setEditingId(card.id)
    setShowAddCard(true)
  }

  const handleDelete = async (id: string) => {
    if (!user || !confirm(t("confirmDelete"))) return

    const updatedCards = businessCards.filter((card) => card.id !== id)
    setBusinessCards(updatedCards)

    try {
      await saveBusinessCards(updatedCards, user.id)
      const newRotations = { ...imageRotations }
      delete newRotations[id]
      setImageRotations(newRotations)
    } catch (error) {
      console.error("[v0] Failed to delete business card:", error)
    }
  }

  const getSortedCards = () => {
    const sorted = [...businessCards]
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "company":
        return sorted.sort((a, b) => (a.company || "").localeCompare(b.company || ""))
      case "date":
      default:
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }

  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          aspectRatio: { ideal: 16 / 9 },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      streamRef.current = stream
      setShowCameraPreview(true)

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (error) {
      console.error("[v0] Camera error:", error)
      alert(t("camera_permission_required"))
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !streamRef.current) return

    const video = videoRef.current
    const canvas = document.createElement("canvas")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95)

    const newAttachment = {
      type: "image",
      name: `card_${Date.now()}.jpg`,
      data: dataUrl,
      url: dataUrl,
    }

    setAttachments([...attachments, newAttachment])
    closeCameraPreview()
  }

  const closeCameraPreview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setShowCameraPreview(false)
  }

  const rotateImage = async (cardId: string) => {
    if (!user) return

    const newRotation = ((imageRotations[cardId] || 0) + 90) % 360

    setImageRotations((prev) => ({
      ...prev,
      [cardId]: newRotation,
    }))

    const updatedCards = businessCards.map((card) => (card.id === cardId ? { ...card, rotation: newRotation } : card))
    setBusinessCards(updatedCards)

    try {
      await saveBusinessCards(updatedCards, user.id)
    } catch (error) {
      console.error("[v0] Failed to save rotation:", error)
    }
  }

  if (showAddCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <Button
            variant="ghost"
            onClick={() => {
              setShowAddCard(false)
              setEditingId(null)
              setFormData({
                name: "",
                company: "",
                position: "",
                phone: "",
                email: "",
                address: "",
                notes: "",
              })
              setAttachments([])
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("cancel")}
          </Button>

          {showCameraPreview && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
              <div className="flex-1 flex items-center justify-center bg-black overflow-hidden">
                <div className="relative w-full max-w-4xl mx-auto">
                  <video
                    ref={videoRef}
                    className="w-full rounded-lg"
                    playsInline
                    autoPlay
                    style={{ aspectRatio: "16/9" }}
                  />
                </div>
              </div>
              <div className="bg-black/90 p-6 flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={closeCameraPreview}
                  className="px-8 py-6 text-lg bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={capturePhoto}
                  className="px-8 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Camera className="mr-2 h-6 w-6" />
                  {t("takePhoto")}
                </Button>
              </div>
            </div>
          )}

          <Card className="p-6 bg-card dark:bg-card">
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-6">
              {editingId ? t("edit_card") : t("add_card")}
            </h2>

            <div className="space-y-4">
              <div>
                <Label>{t("scan_card")}</Label>
                <div className="space-y-2">
                  <Button onClick={startCameraPreview} variant="outline" className="w-full bg-transparent">
                    <Camera className="mr-2 h-4 w-4" />
                    {t("capture_card")}
                  </Button>

                  {attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="relative group border rounded overflow-hidden">
                          <img
                            src={file.url || file.data}
                            alt={file.name}
                            className="w-full h-32 object-contain bg-muted dark:bg-muted"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>{t("name")}</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div>
                <Label>{t("company")}</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div>
                <Label>{t("position")}</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>

              <div>
                <Label>{t("phone")}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  type="tel"
                />
              </div>

              <div>
                <Label>{t("email")}</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                />
              </div>

              <div>
                <Label>{t("address")}</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <Label>{t("notes")}</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
                {t("save")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back")}
          </Button>
          <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">{t("business_card_management")}</h1>
          <Button onClick={() => setShowAddCard(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            {t("add_card")}
          </Button>
        </div>

        {businessCards.length > 0 && (
          <div className="flex items-center gap-2 bg-card dark:bg-card p-3 rounded-lg">
            <ArrowUpDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("sort")}:</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "date" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("date")}
                className={sortBy === "date" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {t("sort_by_date")}
              </Button>
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("name")}
                className={sortBy === "name" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {t("sort_by_name")}
              </Button>
              <Button
                variant={sortBy === "company" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("company")}
                className={sortBy === "company" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {t("sort_by_company")}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getSortedCards().map((card) => {
            const rotation = imageRotations[card.id] || card.rotation || 0
            const isRotated = rotation === 90 || rotation === 270

            return (
              <Card key={card.id} className="p-4 bg-card dark:bg-card hover:shadow-lg transition-shadow">
                {card.imageUrl && (
                  <div className="relative mb-3 flex items-center justify-center overflow-hidden">
                    <div
                      className="relative flex items-center justify-center"
                      style={{
                        width: isRotated ? "160px" : "100%",
                        height: isRotated ? "100%" : "160px",
                      }}
                    >
                      <img
                        src={card.imageUrl || "/placeholder.svg"}
                        alt={card.name}
                        className="max-w-full max-h-full object-contain bg-muted dark:bg-muted rounded border transition-transform duration-300"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          width: isRotated ? "auto" : "100%",
                          height: isRotated ? "160px" : "auto",
                        }}
                        onError={(e) => {
                          console.warn("[v0] Failed to load card image:", card.id)
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 shadow-md"
                        onClick={() => rotateImage(card.id)}
                      >
                        <RotateCw className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-lg">{card.name}</h3>
                  </div>

                  {card.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                      <span>{card.company}</span>
                    </div>
                  )}

                  {card.position && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                      <span>{card.position}</span>
                    </div>
                  )}

                  {card.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                      <a href={`tel:${card.phone}`} className="hover:underline">
                        {card.phone}
                      </a>
                    </div>
                  )}

                  {card.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                      <a href={`mailto:${card.email}`} className="hover:underline truncate">
                        {card.email}
                      </a>
                    </div>
                  )}

                  {card.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                      <span className="text-xs">{card.address}</span>
                    </div>
                  )}

                  {card.notes && (
                    <p className="text-sm text-muted-foreground mt-2 pt-2 border-t dark:border-gray-700">
                      {card.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t dark:border-gray-700">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(card)} className="flex-1">
                    <Pencil className="h-4 w-4 mr-1" />
                    {t("edit")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(card.id)}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t("delete")}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {businessCards.length === 0 && (
          <Card className="p-12 text-center bg-card dark:bg-card">
            <Camera className="h-16 w-16 text-emerald-300 dark:text-emerald-600 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {language === "ko"
                ? "명함을 추가해보세요"
                : language === "en"
                  ? "Add your first business card"
                  : language === "zh"
                    ? "添加您的第一张名片"
                    : "最初の名刺を追加"}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
