"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { createClient } from "@/lib/supabase/client"
import { loadSchedules, loadNotes, loadDiaries, loadTravelRecords, checkUserConsent } from "@/lib/storage"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ForestCanvas } from "@/components/forest-canvas"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { NotificationCenter } from "@/components/notification-center"
import { PrivacyPolicyDialog } from "@/components/privacy-policy-dialog"
import { TermsOfServiceDialog } from "@/components/terms-of-service-dialog"
import { StorageQuotaCard } from "@/components/storage-quota-card"
import {
  FileText,
  BookOpen,
  CalendarIcon,
  Radio,
  Plane,
  Car,
  Heart,
  LogOut,
  ChevronDown,
  Search,
  X,
  Wallet,
  Settings,
  CheckSquare,
  CreditCard,
  Bot,
  Cloud,
} from "lucide-react"

const NotesSection = dynamic(() => import("@/components/notes-section").then((m) => ({ default: m.NotesSection })), {
  loading: () => <LoadingSection />,
})
const DiarySection = dynamic(() => import("@/components/diary-section").then((m) => ({ default: m.DiarySection })), {
  loading: () => <LoadingSection />,
})
const ScheduleSection = dynamic(
  () => import("@/components/schedule-section").then((m) => ({ default: m.ScheduleSection })),
  {
    loading: () => <LoadingSection />,
  },
)
const TodoSection = dynamic(() => import("@/components/todo-section").then((m) => ({ default: m.TodoSection })), {
  loading: () => <LoadingSection />,
})
const WeatherSection = dynamic(
  () => import("@/components/weather-section").then((m) => ({ default: m.WeatherSection })),
  {
    loading: () => <LoadingSection />,
  },
)
const RadioSection = dynamic(() => import("@/components/radio-section").then((m) => ({ default: m.RadioSection })), {
  loading: () => <LoadingSection />,
})
const TravelSection = dynamic(() => import("@/components/travel-section").then((m) => ({ default: m.TravelSection })), {
  loading: () => <LoadingSection />,
})
const VehicleSection = dynamic(
  () => import("@/components/vehicle-section").then((m) => ({ default: m.VehicleSection })),
  {
    loading: () => <LoadingSection />,
  },
)
const HealthSection = dynamic(() => import("@/components/health-section").then((m) => ({ default: m.HealthSection })), {
  loading: () => <LoadingSection />,
})
const StatisticsSection = dynamic(
  () => import("@/components/statistics-section").then((m) => ({ default: m.StatisticsSection })),
  {
    loading: () => <LoadingSection />,
  },
)
const BudgetSection = dynamic(() => import("@/components/budget-section").then((m) => ({ default: m.BudgetSection })), {
  loading: () => <LoadingSection />,
})
const BusinessCardSection = dynamic(
  () => import("@/components/business-card-section").then((m) => ({ default: m.BusinessCardSection })),
  {
    loading: () => <LoadingSection />,
  },
)
const SettingsSection = dynamic(
  () => import("@/components/settings-section").then((m) => ({ default: m.SettingsSection })),
  {
    loading: () => <LoadingSection />,
  },
)
const CalendarWidget = dynamic(
  () => import("@/components/calendar-widget").then((m) => ({ default: m.CalendarWidget })),
  {
    ssr: false,
  },
)
const AiAssistantSection = dynamic(
  () => import("@/components/ai-assistant-section").then((m) => ({ default: m.AiAssistantSection })),
  {
    loading: () => <LoadingSection />,
  },
)

function LoadingSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-800">로딩 중...</p>
      </div>
    </div>
  )
}

type Section =
  | "home"
  | "notes"
  | "diary"
  | "schedule"
  | "todo"
  | "weather"
  | "radio"
  | "travel"
  | "vehicle"
  | "health"
  | "budget"
  | "statistics"
  | "businessCard"
  | "settings"
  | "aiAssistant"

const LanguageSelector = ({ language, onChange }: { language: Language; onChange: (lang: Language) => void }) => {
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "ko" as Language, name: "한국어", flag: "🇰🇷" },
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
    { code: "ja" as Language, name: "日本語", flag: "🇯🇵" },
  ]

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
        <span className="text-xl">{currentLang.flag}</span>
        <span className="text-sm">{currentLang.name}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onChange(lang.code)
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const GlobalSearch = ({
  language,
  onResultClick,
}: { language: Language; onResultClick: (section: Section, item: any) => void }) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const searchAll = async (searchQuery: string) => {
    if (!user || !searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    const lowerQuery = searchQuery.toLowerCase()
    const allResults: any[] = []

    try {
      const [notes, diaries, schedules, travels] = await Promise.all([
        loadNotes(user.id),
        loadDiaries(user.id),
        loadSchedules(user.id),
        loadTravelRecords(user.id),
      ])

      notes.forEach((note: any) => {
        if (note.title?.toLowerCase().includes(lowerQuery) || note.content?.toLowerCase().includes(lowerQuery)) {
          allResults.push({ type: "notes", item: note, title: note.title, preview: note.content?.substring(0, 50) })
        }
      })

      diaries.forEach((diary: any) => {
        if (diary.content?.toLowerCase().includes(lowerQuery)) {
          allResults.push({ type: "diary", item: diary, title: diary.date, preview: diary.content?.substring(0, 50) })
        }
      })

      schedules.forEach((schedule: any) => {
        if (
          schedule.title?.toLowerCase().includes(lowerQuery) ||
          schedule.description?.toLowerCase().includes(lowerQuery)
        ) {
          allResults.push({
            type: "schedule",
            item: schedule,
            title: schedule.title,
            preview: schedule.description?.substring(0, 50),
          })
        }
      })

      travels.forEach((travel: any) => {
        if (travel.location?.toLowerCase().includes(lowerQuery) || travel.notes?.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            type: "travel",
            item: travel,
            title: travel.location,
            preview: travel.notes?.substring(0, 50),
          })
        }
      })

      setResults(allResults)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.trim()) {
        searchAll(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, user])

  const getSectionLabel = (type: string) => {
    switch (type) {
      case "notes":
        return getTranslation(language, "notes")
      case "diary":
        return getTranslation(language, "diary")
      case "schedule":
        return getTranslation(language, "schedule")
      case "travel":
        return getTranslation(language, "travel")
      default:
        return type
    }
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        <span className="text-sm">
          {language === "ko" ? "검색" : language === "en" ? "Search" : language === "zh" ? "搜索" : "検索"}
        </span>
      </Button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-4 border-b flex items-center gap-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={
                  language === "ko"
                    ? "전체 검색..."
                    : language === "en"
                      ? "Search all..."
                      : language === "zh"
                        ? "搜索全部..."
                        : "すべて検索..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-none focus-visible:ring-0"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                  setQuery("")
                  setResults([])
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto p-4">
              {isSearching && (
                <div className="text-center py-8 text-gray-500">
                  {language === "ko"
                    ? "검색 중..."
                    : language === "en"
                      ? "Searching..."
                      : language === "zh"
                        ? "搜索中..."
                        : "検索中..."}
                </div>
              )}
              {!isSearching && results.length === 0 && query.trim() && (
                <div className="text-center py-8 text-gray-500">
                  {language === "ko"
                    ? "검색 결과가 없습니다"
                    : language === "en"
                      ? "No results found"
                      : language === "zh"
                        ? "未找到结果"
                        : "結果が見つかりません"}
                </div>
              )}
              {!isSearching && results.length === 0 && !query.trim() && (
                <div className="text-center py-8 text-gray-400">
                  {language === "ko"
                    ? "검색어를 입력하세요"
                    : language === "en"
                      ? "Enter search query"
                      : language === "zh"
                        ? "输入搜索词"
                        : "検索語を入力"}
                </div>
              )}
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 rounded cursor-pointer border-b last:border-b-0"
                  onClick={() => {
                    onResultClick(result.type as Section, result.item)
                    setIsOpen(false)
                    setQuery("")
                    setResults([])
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      {getSectionLabel(result.type)}
                    </span>
                    <span className="font-medium">{result.title}</span>
                  </div>
                  {result.preview && <p className="text-sm text-gray-600 truncate">{result.preview}...</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ForestNotePage() {
  const { user, logout, loading } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [currentSection, setCurrentSection] = useState<Section>("home")
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [storageUsed, setStorageUsed] = useState(0)
  const isCalculatingRef = useRef(false)
  const [needsConsent, setNeedsConsent] = useState(false)
  const [isCheckingConsent, setIsCheckingConsent] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [showTermsDialog, setShowTermsDialog] = useState(false)

  const ADMIN_EMAILS = ["chanse1984@hanmail.net", "lee381111@gmail.com"]
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false
  const STORAGE_LIMIT = isAdmin ? 1000 * 1024 * 1024 : 500 * 1024 * 1024
  const STORAGE_LIMIT_MB = STORAGE_LIMIT / 1024 / 1024

  const TEMPORARY_DISABLE_LOGIN = true // 애드센스 승인용 임시 설정
  const TEMP_USER_ID = "00000000-0000-0000-0000-000000000000" // UUID 형식

  const tempUser = TEMPORARY_DISABLE_LOGIN
    ? {
        id: TEMP_USER_ID,
        email: "guest@forestnote.app",
      }
    : user
  const effectiveUser = TEMPORARY_DISABLE_LOGIN ? tempUser : user

  console.log("[v0] User email:", effectiveUser?.email, "Is admin:", isAdmin, "Storage limit:", STORAGE_LIMIT_MB, "MB")

  useEffect(() => {
    const calculateStorage = async () => {
      if (!effectiveUser || isCalculatingRef.current) return
      isCalculatingRef.current = true

      try {
        const supabase = createClient()

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("storage_used")
          .eq("user_id", effectiveUser.id)
          .single()

        if (profileError) {
          console.warn("[v0] Failed to fetch storage from profile, using cached value:", profileError.message)
          // Keep existing storageUsed value instead of setting to 0
          return
        }

        const profileStorageUsed = profile?.storage_used || 0

        console.log(
          "[v0] Storage used from profile:",
          profileStorageUsed,
          "bytes",
          "(" + (profileStorageUsed / 1024 / 1024).toFixed(2) + " MB)",
        )

        setStorageUsed(profileStorageUsed)
      } catch (error) {
        console.warn("[v0] Storage calculation error (network issue?):", error)
        // Don't reset storageUsed to 0 on network errors
      } finally {
        isCalculatingRef.current = false
      }
    }

    calculateStorage()

    const interval = setInterval(calculateStorage, 60000) // Every 60 seconds

    return () => clearInterval(interval)
  }, [effectiveUser])

  useEffect(() => {
    const loadEvents = async () => {
      if (!effectiveUser) return
      try {
        const schedules = await loadSchedules(effectiveUser.id)
        setUpcomingEvents(schedules)
      } catch (error) {
        setUpcomingEvents([])
      }
    }

    loadEvents()

    const handleScheduleUpdate = () => {
      loadEvents()
    }

    window.addEventListener("scheduleUpdate", handleScheduleUpdate)
    return () => {
      window.removeEventListener("scheduleUpdate", handleScheduleUpdate)
    }
  }, [effectiveUser])

  useEffect(() => {
    console.log("[v0] Auth state:", { user: effectiveUser?.email, loading })
  }, [effectiveUser, loading])

  useEffect(() => {
    const checkConsent = async () => {
      if (!effectiveUser || isCheckingConsent || loading) return

      console.log("[v0] Starting consent check for user:", effectiveUser.id)
      setIsCheckingConsent(true)
      try {
        const hasConsent = await checkUserConsent(effectiveUser.id)
        console.log("[v0] User consent check result:", hasConsent ? "HAS CONSENT" : "NEEDS CONSENT")
        setNeedsConsent(!hasConsent)
      } catch (error) {
        console.error("[v0] Consent check error:", error)
        setNeedsConsent(false)
      } finally {
        setIsCheckingConsent(false)
      }
    }

    checkConsent()
  }, [effectiveUser, loading])

  const handleConsentAccept = () => {
    setNeedsConsent(false)
  }

  const handleConsentDecline = async () => {
    await logout()
    setNeedsConsent(false)
  }

  const handleSectionClick = (sectionId: Section) => {
    console.log("[v0] Section button clicked:", sectionId)
    console.log("[v0] Current user:", effectiveUser)
    console.log("[v0] TEMP MODE:", TEMPORARY_DISABLE_LOGIN)
    setCurrentSection(sectionId)
    console.log("[v0] currentSection state set to:", sectionId)
  }

  const sections: { id: Section; label: string; icon: any; color: string }[] = [
    { id: "notes", label: getTranslation(language, "notes"), icon: FileText, color: "amber" },
    { id: "schedule", label: getTranslation(language, "schedule"), icon: CalendarIcon, color: "red" },
    { id: "todo", label: getTranslation(language, "todo"), icon: CheckSquare, color: "purple" },
    { id: "diary", label: getTranslation(language, "diary"), icon: BookOpen, color: "green" },
    { id: "travel", label: getTranslation(language, "travel"), icon: Plane, color: "blue" },
    { id: "vehicle", label: getTranslation(language, "vehicle"), icon: Car, color: "indigo" },
    { id: "health", label: getTranslation(language, "health"), icon: Heart, color: "rose" },
    {
      id: "budget",
      label: language === "ko" ? "가계부" : language === "en" ? "Budget" : language === "zh" ? "家庭账本" : "家計簿",
      icon: Wallet,
      color: "yellow",
    },
    {
      id: "businessCard",
      label: language === "ko" ? "명함" : language === "en" ? "Business Card" : language === "zh" ? "名片" : "名刺",
      icon: CreditCard,
      color: "cyan",
    },
    {
      id: "weather",
      label: language === "ko" ? "날씨" : language === "en" ? "Weather" : language === "zh" ? "天气" : "天気",
      icon: Cloud,
      color: "sky",
    },
    { id: "radio", label: getTranslation(language, "radio"), icon: Radio, color: "teal" },
    {
      id: "aiAssistant",
      label:
        language === "ko"
          ? "AI 비서"
          : language === "en"
            ? "AI Assistant"
            : language === "zh"
              ? "AI 助手"
              : "AI アシスタント",
      icon: Bot,
      color: "blue",
    },
    { id: "settings", label: getTranslation(language, "settings"), icon: Settings, color: "emerald" },
  ]

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 MB"
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const storagePercentage = (storageUsed / STORAGE_LIMIT) * 100

  if (!TEMPORARY_DISABLE_LOGIN && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{getTranslation(language, "loading")}</p>
        </div>
      </div>
    )
  }

  if (!TEMPORARY_DISABLE_LOGIN && !effectiveUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        {/* Header with Language Selector */}
        {!loading && (
          <header className="flex justify-between items-center p-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌲</span>
              <h1 className="text-2xl font-bold text-emerald-700">{getTranslation(language, "title")}</h1>
            </div>
            <LanguageSelector language={language} onChange={setLanguage} />
          </header>
        )}

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-green-800 mb-4">
              {language === "ko"
                ? "🌲 Forest Note"
                : language === "en"
                  ? "🌲 Forest Note"
                  : language === "zh"
                    ? "🌲 森林笔记"
                    : "🌲 フォレストノート"}
            </h1>
            <p className="text-xl text-green-700 mb-8">
              {language === "ko"
                ? "하루를 정리하는 스마트한 방법"
                : language === "en"
                  ? "Smart way to organize your day"
                  : language === "zh"
                    ? "整理您一天的智能方式"
                    : "あなたの一日を整理するスマートな方法"}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Feature 1: Notes */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {language === "ko" ? "노트" : language === "en" ? "Notes" : language === "zh" ? "笔记" : "ノート"}
              </h3>
              <p className="text-green-600">
                {language === "ko"
                  ? "생각과 아이디어를 자유롭게 기록하세요. 서식 편집, 이미지 첨부, 카테고리 분류 기능을 제공합니다."
                  : language === "en"
                    ? "Record your thoughts and ideas freely. Text formatting, image attachments, and categorization available."
                    : language === "zh"
                      ? "自由记录您的想法和创意。提供格式编辑、图片附件和分类功能。"
                      : "自由に思考とアイデアを記録。書式編集、画像添付、カテゴリ分類機能を提供。"}
              </p>
            </div>

            {/* Feature 2: Schedule */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {language === "ko"
                  ? "일정"
                  : language === "en"
                    ? "Schedule"
                    : language === "zh"
                      ? "日程"
                      : "スケジュール"}
              </h3>
              <p className="text-green-600">
                {language === "ko"
                  ? "중요한 일정을 놓치지 마세요. 시간별 알림, 반복 일정, 카테고리별 색상 구분이 가능합니다."
                  : language === "en"
                    ? "Never miss important events. Time-based alerts, recurring schedules, and color coding by category."
                    : language === "zh"
                      ? "不要错过重要日程。提供时间提醒、重复日程和按类别分色功能。"
                      : "重要な予定を見逃さない。時間通知、繰り返し予定、カテゴリ別色分け。"}
              </p>
            </div>

            {/* Feature 3: Todos */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {language === "ko" ? "할 일" : language === "en" ? "To-Do" : language === "zh" ? "待办" : "やること"}
              </h3>
              <p className="text-green-600">
                {language === "ko"
                  ? "해야 할 일을 체계적으로 관리하세요. 음성 입력, 우선순위 설정, 진행 상태 추적 기능이 있습니다."
                  : language === "en"
                    ? "Manage your tasks systematically. Voice input, priority settings, and progress tracking available."
                    : language === "zh"
                      ? "系统地管理您的任务。提供语音输入、优先级设置和进度跟踪功能。"
                      : "タスクを体系的に管理。音声入力、優先度設定、進捗追跡機能あり。"}
              </p>
            </div>

            {/* Feature 4: Vehicle */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {language === "ko"
                  ? "차량 관리"
                  : language === "en"
                    ? "Vehicle"
                    : language === "zh"
                      ? "车辆管理"
                      : "車両管理"}
              </h3>
              <p className="text-green-600">
                {language === "ko"
                  ? "차량 정보와 정비 기록을 한눈에 관리하세요. 예방 정비 일정, 정비 이력, 사진 첨부가 가능합니다."
                  : language === "en"
                    ? "Manage vehicle info and maintenance records at a glance. Preventive maintenance schedules, history, and photo attachments."
                    : language === "zh"
                      ? "一目了然地管理车辆信息和维修记录。提供预防性保养计划、历史记录和照片附件。"
                      : "車両情報とメンテナンス記録を一目で管理。予防メンテナンス、履歴、写真添付可能。"}
              </p>
            </div>

            {/* Feature 5: AI Assistant */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {language === "ko"
                  ? "AI 비서"
                  : language === "en"
                    ? "AI Assistant"
                    : language === "zh"
                      ? "AI助手"
                      : "AIアシスタント"}
              </h3>
              <p className="text-green-600">
                {language === "ko"
                  ? "똑똑한 AI가 일정과 노트를 분석해 답변합니다. 자연어로 질문하면 필요한 정보를 찾아줍니다."
                  : language === "en"
                    ? "Smart AI analyzes your schedules and notes to answer questions. Ask naturally and get the info you need."
                    : language === "zh"
                      ? "智能AI分析您的日程和笔记并回答问题。用自然语言提问即可获取所需信息。"
                      : "スマートAIがスケジュールとノートを分析して回答。自然言語で質問すれば必要な情報を提供。"}
              </p>
            </div>

            {/* Feature 6: More */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {language === "ko"
                  ? "그 외 기능"
                  : language === "en"
                    ? "More Features"
                    : language === "zh"
                      ? "更多功能"
                      : "その他の機能"}
              </h3>
              <p className="text-green-600">
                {language === "ko"
                  ? "날씨, 명함 관리, 라디오, 통계 등 생활에 필요한 다양한 기능을 제공합니다."
                  : language === "en"
                    ? "Weather, business cards, radio, statistics, and more useful features for daily life."
                    : language === "zh"
                      ? "天气、名片管理、收音机、统计等日常生活所需的各种功能。"
                      : "天気、名刺管理、ラジオ、統計など生活に必要な様々な機能を提供。"}
              </p>
            </div>
          </div>

          {/* Footer with Privacy Policy and Terms */}
          <div className="mt-12 text-center text-sm text-green-600 space-x-4">
            <button onClick={() => setShowPrivacyDialog(true)} className="hover:text-green-800 underline">
              {language === "ko"
                ? "개인정보처리방침"
                : language === "en"
                  ? "Privacy Policy"
                  : language === "zh"
                    ? "隐私政策"
                    : "プライバシーポリシー"}
            </button>
            <span>|</span>
            <button onClick={() => setShowTermsDialog(true)} className="hover:text-green-800 underline">
              {language === "ko"
                ? "이용약관"
                : language === "en"
                  ? "Terms of Service"
                  : language === "zh"
                    ? "使用条款"
                    : "利用規約"}
            </button>
          </div>
        </div>

        {/* Privacy and Terms dialogs */}
        <PrivacyPolicyDialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog} language={language} />
        <TermsOfServiceDialog open={showTermsDialog} onOpenChange={setShowTermsDialog} language={language} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header with Language Selector */}
      {!loading && (
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌲</span>
            <h1 className="text-2xl font-bold text-emerald-700">{getTranslation(language, "title")}</h1>
          </div>
          <LanguageSelector language={language} onChange={setLanguage} />
        </header>
      )}

      {/* Main Content */}
      <div className="p-6 space-y-6">
        <AnnouncementBanner language={language} />

        <div className="absolute inset-0 opacity-30">
          <ForestCanvas />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 text-center">
              🌲 {getTranslation(language, "title")}
            </h1>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <NotificationCenter language={language} />
              <LanguageSelector language={language} onChange={setLanguage} />
              <GlobalSearch
                language={language}
                onResultClick={(section, item) => {
                  setCurrentSection(section)
                }}
              />
              {!TEMPORARY_DISABLE_LOGIN && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-black flex items-center gap-1 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm hidden sm:inline">
                    {language === "ko"
                      ? "로그아웃"
                      : language === "en"
                        ? "Logout"
                        : language === "zh"
                          ? "登出"
                          : "ログアウト"}
                  </span>
                </Button>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {language === "ko"
                  ? "저장소 사용량"
                  : language === "en"
                    ? "Storage Used"
                    : language === "zh"
                      ? "存储使用"
                      : "ストレージ使用"}
              </span>
              <span className="text-sm font-bold text-emerald-700">
                {formatBytes(storageUsed)} / {formatBytes(STORAGE_LIMIT)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  storagePercentage > 90 ? "bg-red-500" : storagePercentage > 70 ? "bg-yellow-500" : "bg-emerald-600"
                }`}
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              />
            </div>
            {storagePercentage > 90 && (
              <p className="text-xs text-red-600 mt-1">
                {language === "ko"
                  ? "저장소가 거의 찼습니다!"
                  : language === "en"
                    ? "Storage is almost full!"
                    : language === "zh"
                      ? "存储空间几乎已满！"
                      : "ストレージがほぼ満杯です！"}
              </p>
            )}
          </div>

          <div className="shadow-md rounded-lg overflow-hidden">
            <CalendarWidget
              events={upcomingEvents}
              onDateClick={(date) => setCurrentSection("schedule")}
              language={language}
            />
          </div>

          {/* Conditional rendering of home screen and individual sections */}
          {currentSection === "home" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sections.map((item) => {
                const lightBg =
                  item.color === "teal"
                    ? "bg-teal-50"
                    : item.color === "emerald"
                      ? "bg-emerald-50"
                      : item.color === "green"
                        ? "bg-green-50"
                        : item.color === "blue"
                          ? "bg-blue-50"
                          : item.color === "indigo"
                            ? "bg-indigo-50"
                            : item.color === "rose"
                              ? "bg-rose-50"
                              : item.color === "cyan"
                                ? "bg-cyan-50"
                                : item.color === "purple"
                                  ? "bg-purple-50"
                                  : item.color === "amber"
                                    ? "bg-amber-50"
                                    : item.color === "yellow"
                                      ? "bg-yellow-50"
                                      : "bg-gray-50"

                const textColor = "text-gray-900"
                const iconColor =
                  item.color === "teal"
                    ? "text-teal-700"
                    : item.color === "emerald"
                      ? "text-emerald-700"
                      : item.color === "green"
                        ? "text-green-700"
                        : item.color === "blue"
                          ? "text-blue-700"
                          : item.color === "indigo"
                            ? "text-indigo-700"
                            : item.color === "rose"
                              ? "text-rose-700"
                              : item.color === "cyan"
                                ? "text-cyan-700"
                                : item.color === "purple"
                                  ? "text-purple-700"
                                  : item.color === "amber"
                                    ? "text-amber-700"
                                    : item.color === "yellow"
                                      ? "text-yellow-700"
                                      : "text-gray-700"

                return (
                  <Card
                    key={item.id}
                    className={`p-6 cursor-pointer hover:scale-105 transition-transform backdrop-blur flex flex-col items-center justify-center shadow-md hover:shadow-lg ${lightBg}`}
                    onClick={() => handleSectionClick(item.id as Section)}
                  >
                    <item.icon className={`h-8 w-8 mb-4 ${iconColor}`} />
                    <h3 className={`font-semibold text-lg text-center ${textColor}`}>{item.label}</h3>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div>
              {console.log("[v0] Rendering section:", currentSection)}
              {currentSection === "notes" && <NotesSection user={effectiveUser} />}
              {currentSection === "schedule" && <ScheduleSection user={effectiveUser} />}
              {currentSection === "todo" && <TodoSection user={effectiveUser} />}
              {currentSection === "diary" && <DiarySection user={effectiveUser} />}
              {currentSection === "travel" && <TravelSection user={effectiveUser} />}
              {currentSection === "vehicle" && <VehicleSection user={effectiveUser} />}
              {currentSection === "health" && <HealthSection user={effectiveUser} />}
              {currentSection === "statistics" && <StatisticsSection user={effectiveUser} />}
              {currentSection === "budget" && <BudgetSection user={effectiveUser} />}
              {currentSection === "businessCard" && <BusinessCardSection user={effectiveUser} />}
              {currentSection === "weather" && <WeatherSection user={effectiveUser} />}
              {currentSection === "radio" && <RadioSection user={effectiveUser} />}
              {currentSection === "settings" && <SettingsSection user={effectiveUser} />}
              {currentSection === "aiAssistant" && <AiAssistantSection user={effectiveUser} />}
            </div>
          )}

          <StorageQuotaCard language={language} user={effectiveUser} />
        </div>
      </div>
    </div>
  )
}
