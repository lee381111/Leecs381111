"use client"

import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import {
  BarChart3,
  TrendingUp,
  Calendar,
  MapPin,
  BookOpen,
  FileText,
  CheckCircle2,
  Car,
  Wrench,
  Heart,
  Pill,
} from "lucide-react"
import type {
  ScheduleEvent, // Schedule에서 ScheduleEvent로 변경
  Note,
  DiaryEntry,
  TravelLocation,
  Vehicle,
  VehicleMaintenance,
  HealthRecord,
  Medication,
} from "@/components/personal-organizer-app"

type StatisticsSectionProps = {
  schedules: ScheduleEvent[] // Schedule[]에서 ScheduleEvent[]로 변경
  notes: Note[]
  diaries: DiaryEntry[]
  travelLocations: TravelLocation[]
  vehicles: Vehicle[]
  vehicleMaintenance: VehicleMaintenance[]
  healthRecords: HealthRecord[]
  medications: Medication[]
}

export function StatisticsSection({
  schedules,
  notes,
  diaries,
  travelLocations,
  vehicles,
  vehicleMaintenance,
  healthRecords,
  medications,
}: StatisticsSectionProps) {
  const { t } = useLanguage()

  // Calculate statistics
  const totalSchedules = schedules.length
  const completedSchedules = schedules.filter((s) => s.completed).length
  const pendingSchedules = totalSchedules - completedSchedules
  const completionRate = totalSchedules > 0 ? Math.round((completedSchedules / totalSchedules) * 100) : 0

  const totalNotes = notes.length
  const lockedNotes = notes.filter((n) => n.isLocked).length

  const totalDiaries = diaries.length
  const lockedDiaries = diaries.filter((d) => d.isLocked).length

  // Count mood emojis
  const moodCounts: { [key: string]: number } = {}
  diaries.forEach((d) => {
    if (d.moodEmoji) {
      moodCounts[d.moodEmoji] = (moodCounts[d.moodEmoji] || 0) + 1
    }
  })
  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Count weather emojis
  const weatherCounts: { [key: string]: number } = {}
  diaries.forEach((d) => {
    if (d.weatherEmoji) {
      weatherCounts[d.weatherEmoji] = (weatherCounts[d.weatherEmoji] || 0) + 1
    }
  })
  const topWeather = Object.entries(weatherCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const totalTravelLocations = travelLocations.length

  // Count travel location types
  const locationTypeCounts: { [key: string]: number } = {}
  travelLocations.forEach((loc) => {
    if (loc.locationType) {
      locationTypeCounts[loc.locationType] = (locationTypeCounts[loc.locationType] || 0) + 1
    }
  })
  const topLocationTypes = Object.entries(locationTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Get location type translation
  const getLocationTypeTranslation = (type: string) => {
    const typeMap: { [key: string]: string } = {
      city: t("typeCity"),
      nature: t("typeNature"),
      beach: t("typeBeach"),
      mountain: t("typeMountain"),
      historical: t("typeHistorical"),
      themePark: t("typeThemePark"),
      cafe: t("typeCafe"),
      restaurant: t("typeRestaurant"),
      other: t("typeOther"),
    }
    return typeMap[type] || type
  }

  // Calculate this month's activity
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const thisMonthDiaries = diaries.filter((d) => {
    const date = new Date(d.date)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length

  const thisMonthNotes = notes.filter((n) => {
    const date = new Date(n.createdAt)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length

  const thisMonthSchedules = schedules.filter((s) => {
    const date = new Date(s.date)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length

  const thisMonthTravel = travelLocations.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length

  const thisMonthMaintenance = vehicleMaintenance.filter((m) => {
    const date = new Date(m.date)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length

  // Health statistics calculations
  const totalHealthRecords = healthRecords.length
  const totalMedications = medications.length

  // Calculate active medications (within start and end date)
  const today = new Date().toISOString().split("T")[0]
  const activeMedications = medications.filter((m) => {
    const isAfterStart = !m.startDate || m.startDate <= today
    const isBeforeEnd = !m.endDate || m.endDate >= today
    return isAfterStart && isBeforeEnd
  }).length

  // Calculate this month's health activity
  const thisMonthHealthRecords = healthRecords.filter((h) => {
    const date = new Date(h.date)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length

  // Calculate average health metrics (last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recentHealthRecords = healthRecords.filter((h) => new Date(h.date) >= thirtyDaysAgo)

  const avgBloodPressureSystolic =
    recentHealthRecords.filter((h) => h.bloodPressureSystolic).length > 0
      ? Math.round(
          recentHealthRecords.reduce((sum, h) => sum + (h.bloodPressureSystolic || 0), 0) /
            recentHealthRecords.filter((h) => h.bloodPressureSystolic).length,
        )
      : null

  const avgBloodPressureDiastolic =
    recentHealthRecords.filter((h) => h.bloodPressureDiastolic).length > 0
      ? Math.round(
          recentHealthRecords.reduce((sum, h) => sum + (h.bloodPressureDiastolic || 0), 0) /
            recentHealthRecords.filter((h) => h.bloodPressureDiastolic).length,
        )
      : null

  const avgBloodSugar =
    recentHealthRecords.filter((h) => h.bloodSugar).length > 0
      ? Math.round(
          recentHealthRecords.reduce((sum, h) => sum + (h.bloodSugar || 0), 0) /
            recentHealthRecords.filter((h) => h.bloodSugar).length,
        )
      : null

  const avgPulse =
    recentHealthRecords.filter((h) => h.pulse).length > 0
      ? Math.round(
          recentHealthRecords.reduce((sum, h) => sum + (h.pulse || 0), 0) /
            recentHealthRecords.filter((h) => h.pulse).length,
        )
      : null

  // Vehicle statistics calculations
  const totalVehicles = vehicles.length
  const totalMaintenanceRecords = vehicleMaintenance.length
  const totalMaintenanceCost = vehicleMaintenance.reduce((sum, m) => sum + (m.cost || 0), 0)

  // Count maintenance by category
  const maintenanceCategoryCounts: { [key: string]: number } = {}
  const maintenanceCategoryCosts: { [key: string]: number } = {}
  vehicleMaintenance.forEach((m) => {
    if (m.category) {
      maintenanceCategoryCounts[m.category] = (maintenanceCategoryCounts[m.category] || 0) + 1
      maintenanceCategoryCosts[m.category] = (maintenanceCategoryCosts[m.category] || 0) + (m.cost || 0)
    }
  })
  const topMaintenanceCategories = Object.entries(maintenanceCategoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Get upcoming maintenance (next service date within 30 days)
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const upcomingMaintenance = vehicleMaintenance.filter((m) => {
    if (!m.next_service_date) return false
    const nextDate = new Date(m.next_service_date)
    return nextDate >= now && nextDate <= thirtyDaysFromNow
  })

  // Get category translation
  const getCategoryTranslation = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      engine: t("categoryEngine"),
      transmission: t("categoryTransmission"),
      brakes: t("categoryBrakes"),
      tires: t("categoryTires"),
      battery: t("categoryBattery"),
      oilChange: t("categoryOilChange"),
      filters: t("categoryFilters"),
      suspension: t("categorySuspension"),
      electrical: t("categoryElectrical"),
      bodyPaint: t("categoryBodyPaint"),
      interior: t("categoryInterior"),
      other: t("categoryOther"),
    }
    return categoryMap[category] || category
  }

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-lg">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{t("statistics")}</h2>
      </div>

      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("schedule")}</p>
              <p className="text-2xl font-bold">{totalSchedules}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("notes")}</p>
              <p className="text-2xl font-bold">{totalNotes}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("diary")}</p>
              <p className="text-2xl font-bold">{totalDiaries}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
              <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("travel")}</p>
              <p className="text-2xl font-bold">{totalTravelLocations}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Vehicle Overview Statistics */}
      {totalVehicles > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-100 p-3 dark:bg-cyan-900">
                <Car className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("vehicle")}</p>
                <p className="text-2xl font-bold">{totalVehicles}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                <Wrench className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("maintenanceHistory")}</p>
                <p className="text-2xl font-bold">{totalMaintenanceRecords}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Health Overview Statistics */}
      {(totalHealthRecords > 0 || totalMedications > 0) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-rose-100 p-3 dark:bg-rose-900">
                <Heart className="h-5 w-5 text-rose-600 dark:text-rose-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("healthRecords")}</p>
                <p className="text-2xl font-bold">{totalHealthRecords}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900">
                <Pill className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("totalMedications")}</p>
                <p className="text-2xl font-bold">{totalMedications}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                <Pill className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("activeMedications")}</p>
                <p className="text-2xl font-bold">{activeMedications}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Schedule Completion */}
      <Card className="p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          {t("scheduleCompletion")}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{t("completed")}</span>
            <span className="font-semibold text-green-600">
              {completedSchedules} / {totalSchedules}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-green-600 transition-all" style={{ width: `${completionRate}%` }} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("completionRate")}</span>
            <span className="font-semibold">{completionRate}%</span>
          </div>
        </div>
      </Card>

      {/* This Month Activity */}
      <Card className="p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          {t("thisMonthActivity")}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{t("diary")}</p>
            <p className="text-xl font-bold">{thisMonthDiaries}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{t("notes")}</p>
            <p className="text-xl font-bold">{thisMonthNotes}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{t("schedule")}</p>
            <p className="text-xl font-bold">{thisMonthSchedules}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{t("travel")}</p>
            <p className="text-xl font-bold">{thisMonthTravel}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{t("maintenanceHistory")}</p>
            <p className="text-xl font-bold">{thisMonthMaintenance}</p>
          </div>
          {/* Health records to this month activity */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{t("healthRecords")}</p>
            <p className="text-xl font-bold">{thisMonthHealthRecords}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Moods */}
        {topMoods.length > 0 && (
          <Card className="p-4">
            <h3 className="mb-3 font-semibold">{t("topMoods")}</h3>
            <div className="space-y-2">
              {topMoods.map(([emoji, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} {t("times")}
                    </span>
                  </div>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-purple-600 transition-all"
                      style={{ width: `${(count / totalDiaries) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Top Weather */}
        {topWeather.length > 0 && (
          <Card className="p-4">
            <h3 className="mb-3 font-semibold">{t("topWeather")}</h3>
            <div className="space-y-2">
              {topWeather.map(([emoji, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} {t("times")}
                    </span>
                  </div>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${(count / totalDiaries) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Top Location Types */}
        {topLocationTypes.length > 0 && (
          <Card className="p-4">
            <h3 className="mb-3 font-semibold">{t("topLocationTypes")}</h3>
            <div className="space-y-2">
              {topLocationTypes.map(([type, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{getLocationTypeTranslation(type)}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} {t("times")}
                    </span>
                  </div>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-orange-600 transition-all"
                      style={{ width: `${(count / totalTravelLocations) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Vehicle Maintenance Statistics */}
        {totalMaintenanceRecords > 0 && (
          <>
            {/* Top Maintenance Categories */}
            <Card className="p-4">
              <h3 className="mb-3 font-semibold">{t("topMaintenanceCategories")}</h3>
              <div className="space-y-2">
                {topMaintenanceCategories.map(([category, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{getCategoryTranslation(category)}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} {t("times")}
                      </span>
                    </div>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-cyan-600 transition-all"
                        style={{ width: `${(count / totalMaintenanceRecords) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Total Maintenance Cost */}
            <Card className="p-4">
              <h3 className="mb-3 font-semibold">{t("totalMaintenanceCost")}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("totalCost")}</span>
                  <span className="text-2xl font-bold">
                    {totalMaintenanceCost.toLocaleString()} {t("currency")}
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(maintenanceCategoryCosts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([category, cost], index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{getCategoryTranslation(category)}</span>
                        <span className="font-semibold">
                          {cost.toLocaleString()} {t("currency")}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </Card>

            {/* Upcoming Maintenance */}
            {upcomingMaintenance.length > 0 && (
              <Card className="p-4 md:col-span-2">
                <h3 className="mb-3 font-semibold">{t("upcomingMaintenanceAlert")}</h3>
                <div className="space-y-2">
                  {upcomingMaintenance.slice(0, 5).map((maintenance, index) => {
                    const vehicle = vehicles.find((v) => v.id === maintenance.vehicle_id)
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-amber-50 p-3 dark:bg-amber-950"
                      >
                        <div>
                          <p className="font-medium">{vehicle?.name || t("vehicle")}</p>
                          <p className="text-sm text-muted-foreground">
                            {getCategoryTranslation(maintenance.category)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {maintenance.next_service_date
                              ? new Date(maintenance.next_service_date).toLocaleDateString()
                              : ""}
                          </p>
                          {maintenance.next_service_mileage && (
                            <p className="text-xs text-muted-foreground">
                              {maintenance.next_service_mileage.toLocaleString()} km
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </>
        )}

        {/* Health Statistics */}
        {recentHealthRecords.length > 0 && (
          <Card className="p-4 md:col-span-2">
            <h3 className="mb-3 font-semibold">{t("recentHealthTrends")}</h3>
            <p className="mb-3 text-xs text-muted-foreground">{t("last30DaysAverage")}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {avgBloodPressureSystolic && avgBloodPressureDiastolic && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">{t("averageBloodPressure")}</p>
                  <p className="text-lg font-bold">
                    {avgBloodPressureSystolic}/{avgBloodPressureDiastolic}
                  </p>
                  <p className="text-xs text-muted-foreground">mmHg</p>
                </div>
              )}
              {avgBloodSugar && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">{t("averageBloodSugar")}</p>
                  <p className="text-lg font-bold">{avgBloodSugar}</p>
                  <p className="text-xs text-muted-foreground">mg/dL</p>
                </div>
              )}
              {avgPulse && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">{t("averagePulse")}</p>
                  <p className="text-lg font-bold">{avgPulse}</p>
                  <p className="text-xs text-muted-foreground">bpm</p>
                </div>
              )}
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">{t("activeMedications")}</p>
                <p className="text-lg font-bold">{activeMedications}</p>
                <p className="text-xs text-muted-foreground">{t("medications")}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Privacy Statistics */}
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">{t("privacyStats")}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("lockedNotes")}</span>
              <span className="font-semibold">
                {lockedNotes} / {totalNotes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("lockedDiaries")}</span>
              <span className="font-semibold">
                {lockedDiaries} / {totalDiaries}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
