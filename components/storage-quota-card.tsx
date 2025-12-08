"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Crown, Zap } from "lucide-react"
import { getUserStorageInfo, formatBytes, type StorageInfo } from "@/lib/storage-quota"
import { getTranslation } from "@/lib/i18n"
import { isPiEnvironment } from "@/lib/pi-utils"

interface StorageQuotaCardProps {
  userId: string
  language: string
}

export function StorageQuotaCard({ userId, language }: StorageQuotaCardProps) {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const isPi = isPiEnvironment()

  useEffect(() => {
    loadStorageInfo()
  }, [userId])

  const loadStorageInfo = async () => {
    setLoading(true)
    const info = await getUserStorageInfo(userId)
    setStorageInfo(info)
    setLoading(false)
  }

  const handleUpgrade = async () => {
    // TODO: Implement Pi Payment for premium upgrade
    alert(getTranslation(language, "upgrade_coming_soon"))
  }

  if (loading) {
    return (
      <Card className="p-6 space-y-4 bg-card">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-2 bg-muted rounded" />
        </div>
      </Card>
    )
  }

  if (!storageInfo) return null

  const isNearLimit = storageInfo.percentage >= 80
  const isAtLimit = storageInfo.percentage >= 95

  return (
    <Card className="p-6 space-y-4 bg-card border-2 hover:border-emerald-500/50 transition-colors">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{getTranslation(language, "storage_usage")}</h2>
        {storageInfo.isPremium && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-xs font-semibold">
            <Crown className="h-3 w-3" />
            {getTranslation(language, "premium")}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{getTranslation(language, "used")}</span>
          <span className="font-semibold">
            {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.quota)}
          </span>
        </div>

        <Progress value={storageInfo.percentage} className="h-2" />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {storageInfo.percentage.toFixed(1)}% {getTranslation(language, "used_lowercase")}
          </span>
          <span>
            {formatBytes(storageInfo.remaining)} {getTranslation(language, "remaining")}
          </span>
        </div>

        {isAtLimit && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {getTranslation(language, "storage_full")}
            </p>
          </div>
        )}

        {isNearLimit && !isAtLimit && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              {getTranslation(language, "storage_warning")}
            </p>
          </div>
        )}

        {/* Show upgrade button for Pi free users */}
        {isPi && !storageInfo.isPremium && storageInfo.authType === "pi" && (
          <div className="pt-4 border-t">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/20">
                <Zap className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <p className="font-semibold text-sm">{getTranslation(language, "upgrade_to_premium")}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation(language, "premium_benefits")}</p>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    <li>• {getTranslation(language, "benefit_500mb")}</li>
                    <li>• {getTranslation(language, "benefit_no_ads")}</li>
                    <li>• {getTranslation(language, "benefit_priority_support")}</li>
                  </ul>
                </div>
              </div>
              <Button onClick={handleUpgrade} className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-blue-500">
                <Crown className="h-4 w-4" />
                {getTranslation(language, "upgrade_for_1_pi")}
              </Button>
            </div>
          </div>
        )}

        {/* Show info for email users */}
        {storageInfo.authType === "email" && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              {getTranslation(language, "email_user_storage_info")}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
