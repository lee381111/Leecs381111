"use client"

import { useLanguage } from "@/lib/language-context"

interface SettingsSectionProps {
  schedules: any[]
  notes: any[]
  diaries: any[]
  travelLocations: any[]
  vehicles: any[]
  maintenanceRecords: any[]
  healthRecords: any[]
  medications: any[]
  medicationLogs: any[]
  radioStations: any[]
  userId?: string
  onDataRestored?: () => void
}

export function SettingsSection(props: SettingsSectionProps) {
  const { t } = useLanguage()

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">설정 (Settings)</h2>
      <p className="mt-4 text-muted-foreground">설정 페이지가 정상적으로 로드되었습니다.</p>
      <p className="mt-2 text-sm">Translation test: {t("dataExport")}</p>
    </div>
  )
}
