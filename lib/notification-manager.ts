type NotificationCallback = (notification: {
  id: string
  title: string
  message: string
  type: string
}) => void

interface AlarmData {
  id: string
  title: string
  message: string
  scheduleTime: Date
  type: string
}

class NotificationManager {
  private listeners: Set<NotificationCallback> = new Set()
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Set()

  Map()
  private alarms: Map<string, AlarmData> = new Map()
  private permissionGranted = false

  async requestPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("[v0] Notifications not supported")
      return false
    }

    if (Notification.permission === "granted") {
      this.permissionGranted = true
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      this.permissionGranted = permission === "granted"
      return this.permissionGranted
    }

    return false
  }

  scheduleAlarm(alarm: AlarmData) {
    const now = new Date()
    const delay = alarm.scheduleTime.getTime() - now.getTime()

    console.log("[v0] Scheduling alarm:", {
      id: alarm.id,
      title: alarm.title,
      delay: delay / 1000 / 60,
      minutes: delay / 1000 / 60,
    })

    if (delay > 0) {
      // Cancel existing alarm with same ID
      this.cancelAlarm(alarm.id)

      // Store alarm data
      this.alarms.set(alarm.id, alarm)
      this.saveAlarmsToStorage()

      // Schedule the notification
      const timeout = setTimeout(() => {
        console.log("[v0] Alarm triggered:", alarm.title)

        // Show browser notification
        if (this.permissionGranted && typeof window !== "undefined" && "Notification" in window) {
          try {
            new Notification(alarm.title, {
              body: alarm.message,
              icon: "/icon.png",
              badge: "/badge.png",
              tag: alarm.id,
            })
          } catch (error) {
            console.error("[v0] Failed to show notification:", error)
          }
        }

        // Notify internal listeners
        this.notify({
          id: alarm.id,
          title: alarm.title,
          message: alarm.message,
          type: alarm.type,
        })

        // Clean up
        this.scheduledNotifications.delete(alarm.id)
        this.alarms.delete(alarm.id)
        this.saveAlarmsToStorage()
      }, delay)

      this.scheduledNotifications.set(alarm.id, timeout)
    } else {
      console.log("[v0] Alarm time has passed, not scheduling:", alarm.title)
    }
  }

  cancelAlarm(id: string) {
    const timeout = this.scheduledNotifications.get(id)
    if (timeout) {
      clearTimeout(timeout)
      this.scheduledNotifications.delete(id)
    }
    this.alarms.delete(id)
    this.saveAlarmsToStorage()
  }

  restoreAlarms() {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem("scheduled_alarms")
      if (!stored) return

      const alarms: AlarmData[] = JSON.parse(stored)
      console.log("[v0] Restoring", alarms.length, "alarms from storage")

      alarms.forEach((alarm) => {
        // Convert string back to Date
        alarm.scheduleTime = new Date(alarm.scheduleTime)
        this.scheduleAlarm(alarm)
      })
    } catch (error) {
      console.error("[v0] Failed to restore alarms:", error)
    }
  }

  private saveAlarmsToStorage() {
    if (typeof window === "undefined") return

    try {
      const alarms = Array.from(this.alarms.values())
      localStorage.setItem("scheduled_alarms", JSON.stringify(alarms))
    } catch (error) {
      console.error("[v0] Failed to save alarms:", error)
    }
  }

  subscribe(callback: NotificationCallback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notify(notification: { id: string; title: string; message: string; type: string }) {
    this.listeners.forEach((callback) => callback(notification))
  }

  scheduleNotification(id: string, date: Date, title: string, message: string) {
    const now = new Date()
    const delay = date.getTime() - now.getTime()

    if (delay > 0) {
      const timeout = setTimeout(() => {
        this.notify({
          id,
          title,
          message,
          type: "schedule",
        })
        this.scheduledNotifications.delete(id)
      }, delay)

      this.scheduledNotifications.set(id, timeout)
    }
  }

  cancelNotification(id: string) {
    const timeout = this.scheduledNotifications.get(id)
    if (timeout) {
      clearTimeout(timeout)
      this.scheduledNotifications.delete(id)
    }
  }

  clearAll() {
    this.scheduledNotifications.forEach((timeout) => clearTimeout(timeout))
    this.scheduledNotifications.clear()
    this.alarms.clear()
    if (typeof window !== "undefined") {
      localStorage.removeItem("scheduled_alarms")
    }
  }
}

export const notificationManager = new NotificationManager()
