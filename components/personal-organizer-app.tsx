"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { createClient } from "@/lib/supabase/client"
import {
  verifyMasterPassword,
  isMasterSessionValid,
  setMasterSession,
  clearMasterSession,
} from "@/lib/auth/master-password"
import { NotesSection } from "@/components/notes-section"
import { DiarySection } from "@/components/diary-section"
import { ScheduleSection } from "@/components/schedule-section"
import { TravelSection } from "@/components/travel-section"
import { VehicleSection } from "@/components/vehicle-section"
import { HealthSection } from "@/components/health-section"
import { RadioSection } from "@/components/radio-section"
import { StatisticsSection } from "@/components/statistics-section"
import { WeatherSection } from "@/components/weather-section"

type AuthStep = "checking" | "master-password" | "login" | "signup" | "authenticated"

export type Note = {
  id: string
  title: string
  content: string
  createdAt: Date
  isLocked: boolean
  password?: string
  attachments?: any[]
  tags?: string[]
  starred?: boolean
  user_id?: string
}

export type DiaryEntry = {
  id: string
  date: Date
  content: string
  mood?: string
  weather?: string
  user_id?: string
}

export type ScheduleEvent = {
  id: string
  title: string
  date: Date
  time: string
  description?: string
  alarm?: string
  completed?: boolean
  attachments?: any[]
  user_id?: string
}

export type TravelLocation = {
  id: string
  name: string
  location: string
  travel_date: Date
  notes?: string
  photos?: string[]
  user_id?: string
}

export type Vehicle = {
  id: string
  name: string
  model?: string
  year?: number
  license_plate?: string
  user_id?: string
}

export type VehicleMaintenance = {
  id: string
  vehicle_id: string
  date: Date
  type: string
  description?: string
  cost?: number
  mileage?: number
  user_id?: string
}

export type HealthRecord = {
  id: string
  date: string
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  bloodSugar?: number
  pulse?: number
  weight?: number
  temperature?: number
  steps?: number
  distanceKm?: number
  cost?: number
  medicineCost?: number
  notes?: string
  attachments?: any[]
  createdAt: Date
  user_id?: string | null
}

export type Medication = {
  id: string
  name: string
  dosage?: string
  frequency?: string
  startDate?: string
  endDate?: string
  time?: string
  alarmEnabled?: boolean
  notes?: string
  createdAt: Date
  user_id?: string | null
}

export type MedicationLog = {
  id: string
  medicationId: string
  takenAt: Date
  user_id?: string | null
}

export type RadioStation = {
  id: string
  name: string
  url: string
  genre?: string
  user_id?: string
}

export function PersonalOrganizerApp() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [authStep, setAuthStep] = useState<AuthStep>(() => {
    if (typeof window !== "undefined") {
      return isMasterSessionValid() ? "checking" : "master-password"
    }
    return "checking"
  })
  const [notes, setNotes] = useState<Note[]>([])
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([])
  const [travelLocations, setTravelLocations] = useState<TravelLocation[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehicleMaintenance, setVehicleMaintenance] = useState<VehicleMaintenance[]>([])
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([])
  const [radioStations, setRadioStations] = useState<RadioStation[]>([])

  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [masterPassword, setMasterPassword] = useState("")
  const [masterPasswordError, setMasterPasswordError] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (authStep !== "checking") {
      return
    }

    let isMounted = true

    const checkAuthStatus = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (!isMounted) return

        if (sessionError) {
          setAuthStep("login")
          return
        }

        if (!session) {
          setAuthStep("login")
          return
        }

        setAuthStep("authenticated")
        setUserId(session.user.id)

        // Load user data
        const { data: notesData } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        if (notesData && isMounted) {
          const loadedNotes: Note[] = notesData.map((note: any) => ({
            id: note.id,
            title: note.title,
            content: note.content,
            createdAt: new Date(note.created_at),
            isLocked: note.is_locked || false,
            password: note.password || undefined,
            attachments: note.attachments || undefined,
            tags: note.tags || undefined,
            starred: note.starred || false,
            user_id: note.user_id,
          }))
          setNotes(loadedNotes)
        }

        // Load medications data
        const { data: medicationsData } = await supabase
          .from("medications")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        if (medicationsData && isMounted) {
          const loadedMedications: Medication[] = medicationsData.map((medication: any) => ({
            id: medication.id,
            name: medication.name,
            dosage: medication.dosage || undefined,
            frequency: medication.frequency || undefined,
            startDate: medication.start_date || undefined,
            endDate: medication.end_date || undefined,
            time: medication.time || undefined,
            alarmEnabled: medication.alarm_enabled || false,
            notes: medication.notes || undefined,
            createdAt: new Date(medication.created_at),
            user_id: medication.user_id,
          }))
          setMedications(loadedMedications)
        }

        // Load medication logs data
        const { data: medicationLogsData } = await supabase
          .from("medication_logs")
          .select("*")
          .eq("user_id", session.user.id)
          .order("taken_at", { ascending: false })

        if (medicationLogsData && isMounted) {
          const loadedMedicationLogs: MedicationLog[] = medicationLogsData.map((log: any) => ({
            id: log.id,
            medicationId: log.medication_id,
            takenAt: new Date(log.taken_at),
            user_id: log.user_id,
          }))
          setMedicationLogs(loadedMedicationLogs)
        }
      } catch (error) {
        if (isMounted) {
          setAuthStep("login")
        }
      }
    }

    checkAuthStatus()

    return () => {
      isMounted = false
    }
  }, [authStep])

  const handleMasterPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMasterPasswordError("")

    if (verifyMasterPassword(masterPassword)) {
      setMasterSession()
      setAuthStep("login")
    } else {
      setMasterPasswordError(t("masterPasswordError"))
    }
  }

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsAuthLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) throw error

      setAuthStep("authenticated")
    } catch (error: any) {
      setAuthError(error.message || t("loginError"))
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleInlineSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsAuthLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (error) throw error

      setAuthError(t("signupSuccess"))
      setTimeout(() => setAuthStep("login"), 2000)
    } catch (error: any) {
      setAuthError(error.message || t("signupError"))
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearMasterSession()
    setAuthStep("master-password")
  }

  if (authStep === "checking") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto" />
          <p className="text-lg font-semibold text-gray-800">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (authStep === "master-password") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{t("unlockApp")}</CardTitle>
            <CardDescription className="text-center">{t("enterMasterPassword")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMasterPasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="master-password">{t("masterPassword")}</Label>
                <Input
                  id="master-password"
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder={t("enterMasterPassword")}
                  required
                />
              </div>

              {masterPasswordError && (
                <Alert variant="destructive">
                  <AlertDescription>{masterPasswordError}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {t("unlock")}
              </Button>

              <p className="text-sm text-center text-gray-600">
                {t("twoStepSecurity")}
                <br />
                {t("step1Master")} → {t("step2Account")}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (authStep === "login" || authStep === "signup") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{t("accountLogin")}</CardTitle>
            <CardDescription className="text-center">{t("loginToAccess")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authStep} onValueChange={(value) => setAuthStep(value as AuthStep)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t("login")}</TabsTrigger>
                <TabsTrigger value="signup">{t("signup")}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleInlineLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t("email")}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={t("enterEmail")}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t("password")}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={t("enterPassword")}
                      required
                    />
                  </div>

                  {authError && (
                    <Alert variant={authError.includes("success") ? "default" : "destructive"}>
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isAuthLoading}>
                    {isAuthLoading ? t("loading") : t("login")}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleInlineSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t("email")}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder={t("enterEmail")}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t("password")}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder={t("enterPassword")}
                      required
                    />
                  </div>

                  {authError && (
                    <Alert variant={authError.includes("success") ? "default" : "destructive"}>
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isAuthLoading}>
                    {isAuthLoading ? t("loading") : t("signup")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{t("personalOrganizerApp")}</h1>

          <div className="flex items-center gap-2">
            <Button variant={language === "ko" ? "default" : "outline"} size="sm" onClick={() => setLanguage("ko")}>
              한국어
            </Button>
            <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")}>
              English
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Single Scrollable Page */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Calendar Section - Always at the top */}
        <section id="schedule">
          <ScheduleSection scheduleEvents={scheduleEvents} setScheduleEvents={setScheduleEvents} userId={userId} />
        </section>

        {/* Notes Section */}
        <section id="notes">
          <NotesSection notes={notes} setNotes={setNotes} userId={userId} />
        </section>

        {/* Diary Section */}
        <section id="diary">
          <DiarySection diaries={diaryEntries} setDiaries={setDiaryEntries} userId={userId} />
        </section>

        {/* Travel Section */}
        <section id="travel">
          <TravelSection travelLocations={travelLocations} setTravelLocations={setTravelLocations} userId={userId} />
        </section>

        {/* Vehicle Section */}
        <section id="vehicle">
          <VehicleSection
            vehicles={vehicles}
            setVehicles={setVehicles}
            vehicleMaintenance={vehicleMaintenance}
            setVehicleMaintenance={setVehicleMaintenance}
            userId={userId}
          />
        </section>

        {/* Health Section */}
        <section id="health">
          <HealthSection
            healthRecords={healthRecords}
            setHealthRecords={setHealthRecords}
            medications={medications}
            setMedications={setMedications}
            medicationLogs={medicationLogs}
            setMedicationLogs={setMedicationLogs}
            userId={userId}
          />
        </section>

        {/* Statistics Section */}
        <section id="statistics">
          <StatisticsSection
            schedules={scheduleEvents}
            notes={notes}
            diaries={diaryEntries}
            travelLocations={travelLocations}
            vehicles={vehicles}
            vehicleMaintenance={vehicleMaintenance}
            healthRecords={healthRecords}
            medications={medications}
          />
        </section>

        {/* Weather Section */}
        <section id="weather">
          <WeatherSection />
        </section>

        {/* Radio Section */}
        <section id="radio">
          <RadioSection radioStations={radioStations} setRadioStations={setRadioStations} userId={userId} />
        </section>

        {/* Settings Section */}
        <section id="settings">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t("settingsEmpty")}</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
