"use client"

import type React from "react"
import { Suspense } from "react"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ForestCanvas } from "@/components/forest-canvas"
import {
  FileText,
  BookOpen,
  CalendarIcon,
  Cloud,
  Radio,
  Plane,
  Car,
  Heart,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  X,
  User,
  Wallet,
} from "lucide-react"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import {
  loadSchedules,
  loadNotes,
  loadDiaries,
  loadTravelRecords,
  loadHealthRecords,
  loadMedications,
  loadVehicles,
  loadVehicleMaintenanceRecords,
} from "@/lib/storage"
import { NotificationCenter } from "@/components/notification-center"

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
const SettingsSection = dynamic(
  () => import("@/components/settings-section").then((m) => ({ default: m.SettingsSection })),
  {
    loading: () => <LoadingSection />,
  },
)
const BusinessCardSection = dynamic(
  () => import("@/components/business-card-section").then((m) => ({ default: m.BusinessCardSection })),
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
  | "weather"
  | "radio"
  | "travel"
  | "vehicle"
  | "health"
  | "budget"
  | "statistics"
  | "businessCard"
  | "settings"

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

const ForestNotePage = () => {
  const { user, signOut, loading } = useAuth()
  const [currentSection, setCurrentSection] = useState<Section>("home")
  const [language, setLanguage] = useState<Language>("ko")
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [storageUsed, setStorageUsed] = useState(0)
  const isCalculatingRef = useRef(false)
  const [allNotes, setAllNotes] = useState<any[]>([])
  const [allDiaries, setAllDiaries] = useState<any[]>([])
  const [allSchedules, setAllSchedules] = useState<any[]>([])
  const [allTravels, setAllTravels] = useState<any[]>([])
  const [allVehicles, setAllVehicles] = useState<any[]>([])
  const [allHealthRecords, setAllHealthRecords] = useState<any[]>([])

  useEffect(() => {
    console.log(
      "[v0] State updated - Notes:",
      allNotes.length,
      "Schedules:",
      allSchedules.length,
      "Diaries:",
      allDiaries.length,
      "Storage:",
      storageUsed,
      "bytes",
    )
  }, [allNotes, allSchedules, allDiaries, allTravels, allVehicles, allHealthRecords, storageUsed])

  const ADMIN_EMAILS = ["chanse1984@hanmail.net", "lee381111@gmail.com"] // 관리자 이메일 목록
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false
  const STORAGE_LIMIT = isAdmin ? 1000 * 1024 * 1024 : 500 * 1024 * 1024 // Admin: 1000MB, Others: 500MB

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
      if (!user) {
        setStorageUsed(0)
        return
      }

      if (isCalculatingRef.current) {
        console.log("[v0] Storage calculation already in progress, skipping")
        return
      }

      isCalculatingRef.current = true

      try {
        const fetchWithFallback = async (fn: () => Promise<any[]>, name: string): Promise<any[]> => {
          try {
            const result = await fn()
            console.log(`[v0] Loaded ${name}:`, result.length, "items")
            return Array.isArray(result) ? result : []
          } catch (error) {
            console.warn(`[v0] Failed to load ${name}, using empty array:`, error)
            return []
          }
        }

        const [notes, diaries, schedules, travels, health, medications, vehicles, maintenance] = await Promise.all([
          fetchWithFallback(() => loadNotes(user.id), "notes"),
          fetchWithFallback(() => loadDiaries(user.id), "diaries"),
          fetchWithFallback(() => loadSchedules(user.id), "schedules"),
          fetchWithFallback(() => loadTravelRecords(user.id), "travels"),
          fetchWithFallback(() => loadHealthRecords(user.id), "health"),
          fetchWithFallback(() => loadMedications(user.id), "medications"),
          fetchWithFallback(() => loadVehicles(user.id), "vehicles"),
          fetchWithFallback(() => loadVehicleMaintenanceRecords(user.id), "maintenance"),
        ])

        setAllNotes(notes)
        setAllDiaries(diaries)
        setAllSchedules(schedules)
        setAllTravels(travels)
        setAllVehicles(vehicles)
        setAllHealthRecords(health)

        const jsonData = JSON.stringify({
          notes: Array.isArray(notes) ? notes : [],
          diaries: Array.isArray(diaries) ? diaries : [],
          schedules: Array.isArray(schedules) ? schedules : [],
          travels: Array.isArray(travels) ? travels : [],
          health: Array.isArray(health) ? health : [],
          medications: Array.isArray(medications) ? medications : [],
          vehicles: Array.isArray(vehicles) ? vehicles : [],
          maintenance: Array.isArray(maintenance) ? maintenance : [],
        })
        const totalSize = new Blob([jsonData]).size

        console.log("[v0] JSON data size:", totalSize, "bytes")

        let mediaCount = 0

        if (Array.isArray(notes)) {
          notes.forEach((note: any) => {
            const urls = note.attachments || []
            const count = Array.isArray(urls) ? urls.length : 0
            mediaCount += count
          })
        }

        if (Array.isArray(diaries)) {
          diaries.forEach((diary: any) => {
            const urls = diary.mediaUrls || diary.attachments || []
            const count = Array.isArray(urls) ? urls.length : 0
            mediaCount += count
          })
        }

        if (Array.isArray(travels)) {
          travels.forEach((travel: any) => {
            const urls = travel.attachments || []
            const count = Array.isArray(urls) ? urls.length : 0
            mediaCount += count
          })
        }

        const estimatedMediaSize = mediaCount * 500 * 1024 // 500KB per media

        console.log("[v0] Media count:", mediaCount, "files")
        console.log("[v0] Estimated media size:", estimatedMediaSize, "bytes")

        const finalSize = totalSize + estimatedMediaSize
        console.log("[v0] Total storage used:", finalSize, "bytes", "(" + (finalSize / 1024 / 1024).toFixed(2) + " MB)")

        setStorageUsed(finalSize)
      } catch (error) {
        console.error("[v0] Storage calculation error:", error)
        setStorageUsed(0)
      } finally {
        isCalculatingRef.current = false
      }
    }

    calculateStorage()

    if (currentSection === "home") {
      calculateStorage()
    }

    const interval = setInterval(calculateStorage, 60000) // Every 60 seconds

    return () => clearInterval(interval)
  }, [user, currentSection])

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

  const menuItems = [
    {
      id: "schedule",
      label: getTranslation(language, "schedule"),
      icon: CalendarIcon,
      color: "teal",
      count: allSchedules.length,
    },
    { id: "notes", label: getTranslation(language, "notes"), icon: FileText, color: "emerald", count: allNotes.length },
    { id: "diary", label: getTranslation(language, "diary"), icon: BookOpen, color: "green", count: allDiaries.length },
    { id: "travel", label: getTranslation(language, "travel"), icon: Plane, color: "blue", count: allTravels.length },
    {
      id: "vehicle",
      label: getTranslation(language, "vehicle"),
      icon: Car,
      color: "indigo",
      count: allVehicles.length,
    },
    {
      id: "health",
      label: getTranslation(language, "health"),
      icon: Heart,
      color: "rose",
      count: allHealthRecords.length,
    },
    {
      id: "budget",
      label: language === "ko" ? "가계부" : language === "en" ? "Budget" : language === "zh" ? "家庭账本" : "家計簿",
      icon: Wallet,
      color: "yellow",
      count: 0, // Budget doesn't have allBudgetItems loaded
    },
    {
      id: "businessCard",
      label: language === "ko" ? "명함" : language === "en" ? "Business Card" : language === "zh" ? "名片" : "名刺",
      icon: User,
      color: "violet",
      count: 0, // Business cards not loaded in main
    },
    { id: "weather", label: getTranslation(language, "weather"), icon: Cloud, color: "cyan", count: 0 },
    { id: "radio", label: getTranslation(language, "radio"), icon: Radio, color: "purple", count: 0 },
    { id: "statistics", label: getTranslation(language, "statistics"), icon: BarChart3, color: "amber", count: 0 },
  ]

  console.log(
    "[v0] Rendering menu items with counts:",
    menuItems.map((item) => `${item.label}: ${item.count}`).join(", "),
  )

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 MB"
    const mb = bytes / 1024 / 1024
    if (mb < 1) {
      // Show KB instead of 0.00 MB for small sizes
      const kb = bytes / 1024
      return `${kb.toFixed(0)} KB`
    }
    return `${mb.toFixed(2)} MB`
  }

  const storagePercentage = (storageUsed / STORAGE_LIMIT) * 100

  if (currentSection === "notes") {
    return <NotesSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "diary") {
    return <DiarySection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "schedule") {
    return <ScheduleSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "weather") {
    return <WeatherSection onBack={() => setCurrentSection("home")} language={language} />
  }

  if (currentSection === "radio") {
    return <RadioSection onBack={() => setCurrentSection("home")} language={language} user={user} />
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

  return (
    <div className="min-h-screen bg-[rgb(220,252,231)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <ForestCanvas />
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 whitespace-nowrap flex-1 text-center">
            🌲 {getTranslation(language, "title")}
          </h1>
          <div className="flex flex-col gap-2 items-end flex-shrink-0">
            <div className="flex items-center gap-2">
              <NotificationCenter language={language} />
              <LanguageSelector language={language} onChange={setLanguage} />
            </div>
            <div className="flex items-center gap-2">
              <GlobalSearch
                language={language}
                onResultClick={(section, item) => {
                  setCurrentSection(section)
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    console.log("[v0] Logout button clicked")
                    await signOut()
                    console.log("[v0] Logout successful")
                  } catch (error) {
                    console.error("[v0] Logout error:", error)
                  }
                }}
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => {
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
                {item.count > 0 && <p className={`text-sm mt-2 ${iconColor}`}>{item.count}개</p>}
              </Card>
            )
          })}

          <Card
            className="p-6 cursor-pointer hover:scale-105 transition-transform bg-gray-50 flex flex-col items-center justify-center shadow-md hover:shadow-lg"
            onClick={() => setCurrentSection("settings")}
          >
            <Settings className="h-8 w-8 text-gray-700 mb-4" />
            <h3 className="font-semibold text-lg text-center text-gray-900">
              {language === "ko" ? "설정" : language === "en" ? "Settings" : language === "zh" ? "设置" : "設定"}
            </h3>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-700">
          <p>
            {language === "ko"
              ? "숲처럼 평화로운 당신의 기록"
              : language === "en"
                ? "Your peaceful records like a forest"
                : language === "zh"
                  ? "像森林一样平静的记录"
                  : "森のように穏やかな記録"}
          </p>
        </div>
      </div>
    </div>
  )
}

const LoginForm = ({
  language,
  onLanguageChange,
}: {
  language: Language
  onLanguageChange: (lang: Language) => void
}) => {
  const { signIn, signUp } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (isRegister) {
        await signUp(email, password)
        alert(
          language === "ko"
            ? "회원가입이 완료되었습니다. 이메일을 확인해주세요."
            : language === "en"
              ? "Registration complete. Please check your email."
              : language === "zh"
                ? "注册完成。请检查您的电子邮件。"
                : "登録完了。メールを確認してください。",
        )
        setIsRegister(false)
        setEmail("")
        setPassword("")
      } else {
        console.log("[v0] Attempting login...")
        await signIn(email, password)
        console.log("[v0] Login successful")
      }
    } catch (error: any) {
      console.error("[v0] Login error:", error)
      let errorMessage = ""

      if (error.message?.includes("Invalid login credentials")) {
        errorMessage =
          language === "ko"
            ? "이메일 또는 비밀번호가 올바르지 않습니다."
            : language === "en"
              ? "Incorrect email or password."
              : language === "zh"
                ? "电子邮件或密码不正确。"
                : "メールアドレスまたはパスワードが正しくありません。"
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage =
          language === "ko"
            ? "이메일 인증이 필요합니다. 이메일을 확인해주세요."
            : language === "en"
              ? "Email confirmation required. Please check your email."
              : language === "zh"
                ? "需要确认电子邮件。请检查您的电子邮件。"
                : "メールの確認が必要です。メールを確認してください。"
      } else {
        errorMessage = error.message || (language === "ko" ? "오류가 발생했습니다." : "An error occurred")
      }

      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6 w-full max-w-md bg-white/90 backdrop-blur">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-800">🌲 {getTranslation(language, "title")}</h2>
        <LanguageSelector language={language} onChange={onLanguageChange} />
      </div>
      <h3 className="text-xl font-semibold mb-4">
        {isRegister ? (language === "ko" ? "회원가입" : "Register") : language === "ko" ? "로그인" : "Login"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {language === "ko" ? "이메일" : language === "en" ? "Email" : language === "zh" ? "电子邮件" : "メール"}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {language === "ko"
              ? "비밀번호"
              : language === "en"
                ? "Password"
                : language === "zh"
                  ? "密码"
                  : "パスワード"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
            minLength={6}
            disabled={isSubmitting}
          />
          {isRegister && (
            <p className="text-xs text-gray-500 mt-1">
              {language === "ko"
                ? "비밀번호는 최소 6자 이상이어야 합니다."
                : language === "en"
                  ? "Password must be at least 6 characters."
                  : language === "zh"
                    ? "密码必须至少6个字符。"
                    : "パスワードは6文字以上である必要があります。"}
            </p>
          )}
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              {language === "ko" ? "처리 중..." : "Processing..."}
            </span>
          ) : isRegister ? (
            language === "ko" ? (
              "가입하기"
            ) : (
              "Sign Up"
            )
          ) : language === "ko" ? (
            "로그인"
          ) : (
            "Login"
          )}
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={() => {
            setIsRegister(!isRegister)
            setError("")
          }}
          className="w-full"
          disabled={isSubmitting}
        >
          {isRegister
            ? language === "ko"
              ? "이미 계정이 있으신가요?"
              : "Already have an account?"
            : language === "ko"
              ? "계정이 없으신가요?"
              : "Don't have an account?"}
        </Button>
      </form>
      <div className="mt-6 pt-4 border-t text-center text-sm text-gray-600">
        <p>
          {language === "ko"
            ? "개인당 500MB 무료 저장소 제공"
            : language === "en"
              ? "500MB free storage per user"
              : language === "zh"
                ? "每位用户500MB免费存储"
                : "ユーザーあたり500MB無料ストレージ"}
        </p>
      </div>
    </Card>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-emerald-800">로딩 중...</p>
          </div>
        </div>
      }
    >
      <ForestNotePage />
    </Suspense>
  )
}
