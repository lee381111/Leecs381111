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
import type { Language, BusinessCard } from "@/lib/types"
import Tesseract from "tesseract.js"

export default function BusinessCardSection({ language }: { language: Language }) {
  const { user } = useAuth()
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([])
  const [showAddCard, setShowAddCard] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "name" | "company">("date")
  const [imageRotations, setImageRotations] = useState<Record<string, number>>({})
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [extractingCard, setExtractingCard] = useState(false)
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
      alert(getText("requireInfo"))
      return
    }

    setSaving(true)

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

    setSaving(false)

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
    if (!user || !confirm(language === "ko" ? "삭제하시겠습니까?" : "Delete this card?")) return

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

  const getText = (key: string) => {
    const translations: Record<string, Record<Language, string>> = {
      title: { ko: "명함 관리", en: "Business Cards", zh: "名片管理", ja: "名刺管理" },
      addCard: { ko: "명함 추가", en: "Add Card", zh: "添加名片", ja: "名刺追加" },
      name: { ko: "이름", en: "Name", zh: "姓名", ja: "名前" },
      company: { ko: "회사", en: "Company", zh: "公司", ja: "会社" },
      position: { ko: "직책", en: "Position", zh: "职位", ja: "役職" },
      phone: { ko: "전화번호", en: "Phone", zh: "电话", ja: "電話" },
      email: { ko: "이메일", en: "Email", zh: "电子邮件", ja: "メール" },
      address: { ko: "주소", en: "Address", zh: "地址", ja: "住所" },
      notes: { ko: "메모", en: "Notes", zh: "备注", ja: "メモ" },
      save: { ko: "저장", en: "Save", zh: "保存", ja: "保存" },
      cancel: { ko: "취소", en: "Cancel", zh: "取消", ja: "キャンセル" },
      scanCard: { ko: "명함 촬영", en: "Scan Card", zh: "扫描名片", ja: "名刺撮影" },
      back: { ko: "뒤로", en: "Back", zh: "返回", ja: "戻る" },
      edit: { ko: "수정", en: "Edit", zh: "编辑", ja: "編集" },
      delete: { ko: "삭제", en: "Delete", zh: "删除", ja: "削除" },
      editCard: { ko: "명함 수정", en: "Edit Card", zh: "编辑名片", ja: "名刺編集" },
      captureCard: { ko: "명함 촬영", en: "Capture Card", zh: "拍摄名片", ja: "名刺撮影" },
      takePhoto: { ko: "촬영", en: "Capture", zh: "拍摄", ja: "撮影" },
      positionCard: {
        ko: "명함을 화면에 맞춰주세요",
        en: "Position the card in frame",
        zh: "将名片对准画面",
        ja: "名刺をフレームに合わせてください",
      },
      sort: { ko: "정렬", en: "Sort", zh: "排序", ja: "並べ替え" },
      sortByName: { ko: "이름순", en: "By Name", zh: "按姓名", ja: "名前順" },
      sortByCompany: { ko: "회사순", en: "By Company", zh: "按公司", ja: "会社順" },
      sortByDate: { ko: "최신순", en: "By Date", zh: "按日期", ja: "日付順" },
      requireInfo: {
        ko: "최소 한 가지 정보를 입력하거나 사진을 추가해주세요",
        en: "Please add at least one field or photo",
        zh: "请至少添加一个信息或照片",
        ja: "少なくとも1つの情報または写真を追加してください",
      },
      please_add_card_photo_first: {
        ko: "먼저 명함 사진을 추가해주세요",
        en: "Please add a card photo first",
        zh: "请先添加名片照片",
        ja: "まず名刺の写真を追加してください",
      },
      card_info_extracted_successfully: {
        ko: "명함 정보가 자동으로 입력되었습니다!",
        en: "Card information has been automatically filled!",
        zh: "名片信息已自动填充!",
        ja: "名刺の情報が自動で入力されました!",
      },
      failed_to_extract_card_info: {
        ko: "명함 정보 추출에 실패했습니다. 다시 시도해주세요.",
        en: "Failed to extract card information. Please try again.",
        zh: "名片信息提取失败。请再试一次。",
        ja: "名刺の情報抽出に失敗しました。もう一度お試しください。",
      },
      align_card_in_frame: {
        ko: "프레임 안에 명함을 맞춰주세요",
        en: "Align the card within the frame",
        zh: "将名片对准画面",
        ja: "名刺をフレーム内に合わせてください",
      },
      extracting_card_info: {
        ko: "명함 정보 추출 중...",
        en: "Extracting card info...",
        zh: "正在提取名片信息...",
        ja: "名刺の情報を抽出中...",
      },
      ai_auto_fill: {
        ko: "명함 정보 자동 입력",
        en: "AI Auto Fill",
        zh: "AI自动填充",
        ja: "AI自動入力",
      },
      saving: {
        ko: "저장 중...",
        en: "Saving...",
        zh: "保存中...",
        ja: "保存中...",
      },
    }
    return translations[key]?.[language] || key
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
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 16 / 9 },
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
      alert("카메라 권한이 필요합니다")
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
      ctx.filter = "contrast(1.2) brightness(1.1)"
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

  const handleAIAutoFill = async () => {
    if (attachments.length === 0) {
      alert(getText("please_add_card_photo_first"))
      return
    }

    setExtractingCard(true)

    try {
      const imageData = attachments[0].url || attachments[0].data
      const {
        data: { text: ocrText },
      } = await Tesseract.recognize(imageData, ["eng", "kor", "chi_sim", "jpn"])
      console.log("[v0] OCR extracted text:", ocrText)

      const response = await fetch("/api/extract-business-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ocrText }),
      })

      if (!response.ok) {
        throw new Error("Failed to extract card information")
      }

      const { data } = await response.json()

      setFormData({
        name: data.name || "",
        company: data.company || "",
        position: data.position || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        notes: data.notes || "",
      })

      alert(getText("card_info_extracted_successfully") || "명함 정보가 자동으로 입력되었습니다!")
    } catch (error) {
      console.error("[v0] AI auto-fill error:", error)
      alert(getText("failed_to_extract_card_info") || "명함 정보 추출에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setExtractingCard(false)
    }
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
            {getText("cancel")}
          </Button>

          {showCameraPreview && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
              <div className="flex-1 flex items-center justify-center bg-black p-4">
                <div className="relative w-full max-w-4xl" style={{ aspectRatio: "16/9" }}>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover rounded-lg border-4 border-emerald-500"
                    playsInline
                    autoPlay
                  />
                  <div className="absolute inset-4 border-2 border-dashed border-white/50 rounded-lg pointer-events-none flex items-center justify-center">
                    <p className="text-white text-sm bg-black/50 px-4 py-2 rounded">
                      {getText("align_card_in_frame") || "프레임 안에 명함을 맞춰주세요"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-black/90 p-6 flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={closeCameraPreview}
                  className="px-8 py-6 text-lg bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                >
                  {getText("cancel")}
                </Button>
                <Button
                  onClick={capturePhoto}
                  className="px-8 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Camera className="mr-2 h-6 w-6" />
                  {getText("takePhoto")}
                </Button>
              </div>
            </div>
          )}

          <Card className="p-6 bg-card dark:bg-card">
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-6">
              {editingId ? getText("editCard") : getText("addCard")}
            </h2>

            <div className="space-y-4">
              <div>
                <Label>{getText("scanCard")}</Label>
                <div className="space-y-2">
                  <Button onClick={startCameraPreview} variant="outline" className="w-full bg-transparent">
                    <Camera className="mr-2 h-4 w-4" />
                    {getText("captureCard")}
                  </Button>

                  {attachments.length > 0 && (
                    <Button
                      onClick={handleAIAutoFill}
                      disabled={extractingCard}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {extractingCard ? getText("extracting_card_info") : getText("ai_auto_fill")}
                    </Button>
                  )}

                  {attachments.length > 0 && (
                    <div className="grid grid-cols-1 gap-2">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="relative group border rounded overflow-hidden">
                          <img
                            src={file.url || file.data}
                            alt={file.name}
                            className="w-full aspect-[16/9] object-contain bg-muted dark:bg-muted"
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
                <Label>{getText("name")}</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div>
                <Label>{getText("company")}</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div>
                <Label>{getText("position")}</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>

              <div>
                <Label>{getText("phone")}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  type="tel"
                />
              </div>

              <div>
                <Label>{getText("email")}</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                />
              </div>

              <div>
                <Label>{getText("address")}</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <Label>{getText("notes")}</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full bg-green-600 hover:bg-green-700">
                {saving ? getText("saving") : getText("save")}
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
          <Button variant="ghost" onClick={() => setShowAddCard(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getText("back")}
          </Button>
          <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">{getText("title")}</h1>
          <Button onClick={() => setShowAddCard(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            {getText("addCard")}
          </Button>
        </div>

        {businessCards.length > 0 && (
          <div className="flex items-center gap-2 bg-card dark:bg-card p-3 rounded-lg">
            <ArrowUpDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{getText("sort")}:</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "date" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("date")}
                className={sortBy === "date" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {getText("sortByDate")}
              </Button>
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("name")}
                className={sortBy === "name" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {getText("sortByName")}
              </Button>
              <Button
                variant={sortBy === "company" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("company")}
                className={sortBy === "company" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {getText("sortByCompany")}
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
                    {getText("edit")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(card.id)}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {getText("delete")}
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
