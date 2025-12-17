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
import { TermsConsentModal } from "@/components/terms-consent-modal"
import { LoginForm } from "@/components/login-form"
import { AIAssistantSection } from "@/components/ai-assistant-section"
import { AdsenseAd } from "@/components/adsense-ad"
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

  const ADMIN_EMAILS = ["chanse1984@hanmail.net", "lee381111@gmail.com"]
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false
  const STORAGE_LIMIT = isAdmin ? 1000 * 1024 * 1024 : 500 * 1024 * 1024

  console.log(
    "[v0] User email:",
    user?.email,
    "Is admin:",
    isAdmin,
    "Storage limit:",
    STORAGE_LIMIT / 1024 / 1024,
    "MB",
  )

  useEffect(() => {
    const calculateStorage = async () => {
      if (!user || isCalculatingRef.current) return
      isCalculatingRef.current = true

      try {
        const supabase = createClient()

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("storage_used")
          .eq("user_id", user.id)
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
  }, [user])

  useEffect(() => {
    const loadEvents = async () => {
      if (!user) return
      try {
        const schedules = await loadSchedules(user.id)
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
  }, [user])

  useEffect(() => {
    console.log("[v0] Auth state:", { user: user?.email, loading })
  }, [user, loading])

  useEffect(() => {
    const checkConsent = async () => {
      if (!user || isCheckingConsent || loading) return

      console.log("[v0] Starting consent check for user:", user.id)
      setIsCheckingConsent(true)
      try {
        const hasConsent = await checkUserConsent(user.id)
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
  }, [user, loading])

  const handleConsentAccept = () => {
    setNeedsConsent(false)
  }

  const handleConsentDecline = async () => {
    await logout()
    setNeedsConsent(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-800">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-6">
        <LoginForm language={language} onLanguageChange={setLanguage} />
      </div>
    )
  }

  if (needsConsent && user && !loading) {
    return (
      <TermsConsentModal
        userId={user.id}
        userEmail={user.email || ""}
        onConsent={handleConsentAccept}
        onDecline={handleConsentDecline}
      />
    )
  }

  if (currentSection === "notes") {
    return <NotesSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "diary") {
    return <DiarySection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "schedule") {
    return <ScheduleSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "todo") {
    return <TodoSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "weather") {
    return <WeatherSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "radio") {
    return <RadioSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "travel") {
    return <TravelSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "vehicle") {
    return <VehicleSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "health") {
    return <HealthSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "budget") {
    return <BudgetSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "statistics") {
    return <StatisticsSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "businessCard") {
    return <BusinessCardSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "settings") {
    return <SettingsSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "aiAssistant") {
    return <AIAssistantSection user={user} language={language} onBack={() => setCurrentSection("home")} />
  }

  return (
    <div className="min-h-screen bg-[rgb(220,252,231)] relative overflow-hidden">
      <AnnouncementBanner language={language} />

      <div className="absolute inset-0 opacity-30">
        <ForestCanvas />
      </div>

      <div className="relative z-10 p-6 space-y-6">
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
          </div>
        </div>

        <AdsenseAd slot="1234567890" format="horizontal" />

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

        <AdsenseAd slot="0987654321" format="rectangle" />

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
                onClick={() => setCurrentSection(item.id as Section)}
              >
                <item.icon className={`h-8 w-8 mb-4 ${iconColor}`} />
                <h3 className={`font-semibold text-lg text-center ${textColor}`}>{item.label}</h3>
              </Card>
            )
          })}
        </div>

        <AdsenseAd slot="1122334455" format="horizontal" />

        <StorageQuotaCard language={language} />
      </div>
    </div>
  )
}
