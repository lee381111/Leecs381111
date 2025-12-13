"use client"

import { useState, useEffect } from "react"
import { X, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { loadActiveAnnouncements } from "@/lib/storage"
import type { Announcement } from "@/lib/types"
import { getTranslation, type Language } from "@/lib/i18n"

export function AnnouncementBanner({ language }: { language: string }) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const announcements = await loadActiveAnnouncements()
        if (announcements.length > 0) {
          const latest = announcements[0]

          // Check if user has dismissed this announcement
          const storedDismissed = localStorage.getItem(`announcement-dismissed-${latest.id}`)
          if (storedDismissed) {
            setDismissed(true)
            return
          }

          setAnnouncement(latest)
        }
      } catch (error) {
        console.error("[v0] Failed to load announcements:", error)
      }
    }

    loadAnnouncement()

    // Refresh announcements every 5 minutes
    const interval = setInterval(loadAnnouncement, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleDismiss = () => {
    if (announcement) {
      localStorage.setItem(`announcement-dismissed-${announcement.id}`, "true")
      setDismissed(true)
    }
  }

  if (!announcement || dismissed) return null

  const bgColor = {
    info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
    success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  }[announcement.type]

  const textColor = {
    info: "text-blue-800 dark:text-blue-200",
    warning: "text-yellow-800 dark:text-yellow-200",
    success: "text-green-800 dark:text-green-400",
  }[announcement.type]

  const iconColor = {
    info: "text-blue-600 dark:text-blue-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    success: "text-green-600 dark:text-green-400",
  }[announcement.type]

  const getMessage = () => {
    try {
      const parsed = JSON.parse(announcement.message)
      if (typeof parsed === "object" && parsed[language as Language]) {
        return parsed[language as Language]
      }
    } catch {
      // Not JSON, continue
    }

    // If message starts with 'announcement_', treat it as a translation key
    if (announcement.message.startsWith("announcement_")) {
      return getTranslation(language as Language, announcement.message as any)
    }

    // Otherwise, return the message as-is (for backward compatibility)
    return announcement.message
  }

  return (
    <div className={`${bgColor} border-b`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Megaphone className={`h-5 w-5 ${iconColor} flex-shrink-0`} />
            <p className={`text-sm font-medium ${textColor}`}>{getMessage()}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className={`${textColor} hover:bg-black/5 dark:hover:bg-white/5`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
