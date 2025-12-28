interface AlarmConfig {
  id: string
  title: string
  message: string
  scheduleTime: Date
  type: "schedule" | "health" | "vehicle" | "maintenance"
}

interface MedicationCompletion {
  date: string
  times: string[]
}

const SHOWN_ALARMS_KEY = "shown_alarms"

class NotificationManager {
  private alarms: Map<string, NodeJS.Timeout> = new Map()
  private notificationSound: HTMLAudioElement | null = null
  private popupElement: HTMLDivElement | null = null
  private shownAlarms: Set<string> = new Set()
  private checkInterval: NodeJS.Timeout | null = null
  private audioReady = false

  constructor() {
    if (typeof window !== "undefined") {
      this.loadShownAlarms()

      this.notificationSound = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAU+ltryxnMpBSuAzvLZiTYIG2S57OihUBALTKXh8bllHAU2jtXyyn0vBSh+zPDckj0JE12y6OmoWBYKQ5zd8sFuJAU1iNPz0oM0BiJsv+/mnEsPDlOq5O+zYBoGPJnY8st6LgUuhM/y24k3CBlntOrpoVMRC0mi4PG7aB8GM43T8tGAMgYfbL/u55xLD",
      )
      this.notificationSound.volume = 1.0
      this.notificationSound.load()

      const enableAudio = () => {
        if (!this.audioReady && this.notificationSound) {
          this.notificationSound
            .play()
            .then(() => {
              this.notificationSound!.pause()
              this.notificationSound!.currentTime = 0
              this.audioReady = true
              console.log("[v0] ✅ Audio ready for alarms")
            })
            .catch((err) => {
              console.log("[v0] ⚠️ Audio preparation failed:", err)
            })
          document.removeEventListener("click", enableAudio)
          document.removeEventListener("touchstart", enableAudio)
          document.removeEventListener("keydown", enableAudio)
        }
      }

      document.addEventListener("click", enableAudio)
      document.addEventListener("touchstart", enableAudio)
      document.addEventListener("keydown", enableAudio)

      this.popupElement = document.createElement("div")
      this.popupElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        display: none;
        min-width: 300px;
        max-width: 400px;
      `
      document.body.appendChild(this.popupElement)

      this.startAlarmCheck()
      this.cleanupOldShownAlarms()
    }
  }

  private loadShownAlarms() {
    try {
      const stored = localStorage.getItem(SHOWN_ALARMS_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        this.shownAlarms = new Set(data)
        console.log(`[v0] Loaded ${this.shownAlarms.size} previously shown alarms`)
      }
    } catch (err) {
      console.error("[v0] Error loading shown alarms:", err)
    }
  }

  private saveShownAlarms() {
    try {
      const data = Array.from(this.shownAlarms)
      localStorage.setItem(SHOWN_ALARMS_KEY, JSON.stringify(data))
    } catch (err) {
      console.error("[v0] Error saving shown alarms:", err)
    }
  }

  private cleanupOldShownAlarms() {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const toDelete: string[] = []

    this.shownAlarms.forEach((id) => {
      // Extract timestamp from alarm ID if it contains a timestamp
      const match = id.match(/(\d{4}-\d{2}-\d{2})/)
      if (match) {
        const alarmDate = new Date(match[1])
        if (alarmDate.getTime() < sevenDaysAgo) {
          toDelete.push(id)
        }
      }
    })

    toDelete.forEach((id) => this.shownAlarms.delete(id))
    if (toDelete.length > 0) {
      this.saveShownAlarms()
      console.log(`[v0] Cleaned up ${toDelete.length} old shown alarms`)
    }
  }

  private startAlarmCheck() {
    if (this.checkInterval) return

    this.checkInterval = setInterval(() => {
      const now = Date.now()
      this.alarms.forEach((timeout, id) => {
        const alarmTime = new Date(timeout as any).getTime()
        if (now >= alarmTime - 5000 && now <= alarmTime + 5000) {
          const config = {
            id: id,
            title: "Alarm",
            message: "Time for your alarm!",
            scheduleTime: new Date(timeout as any),
            type: "schedule",
          }
          this.showAlarm(config)
        }
      })
    }, 5000)
  }

  requestPermission() {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          console.log("[v0] Notification permission:", permission)
        })
      }
    }
  }

  restoreAlarms() {
    console.log("[v0] Restoring alarms from storage...")
    this.requestPermission()
  }

  scheduleAlarm(config: AlarmConfig) {
    const now = Date.now()
    const delay = config.scheduleTime.getTime() - now

    if (this.shownAlarms.has(config.id)) {
      console.log(`[v0] ⏭️ Skipping already shown alarm: ${config.id}`)
      return
    }

    if (delay < -5 * 60 * 1000) {
      console.log(`[v0] ⏭️ Skipping past alarm: ${config.title} (${Math.round(delay / 1000 / 60)} minutes ago)`)
      return
    }

    console.log(`[v0] ========== Scheduling alarm ==========`)
    console.log(`[v0] Title: ${config.title}`)
    console.log(`[v0] Alarm time: ${config.scheduleTime.toLocaleString()}`)
    console.log(`[v0] Current time: ${new Date().toLocaleString()}`)
    console.log(`[v0] Delay: ${Math.round(delay / 1000)} seconds (${Math.round(delay / 1000 / 60)} minutes)`)

    if (delay <= 0 && delay > -5 * 60 * 1000) {
      console.log(`[v0] ⚠️ Alarm time just passed, showing immediately`)
      this.showAlarm(config)
      return
    }

    this.cancelAlarm(config.id)

    const timeout = setTimeout(() => {
      console.log(`[v0] ⏰ ALARM TRIGGERED: ${config.title}`)
      this.showAlarm(config)
    }, delay)

    this.alarms.set(config.id, timeout)
    console.log(`[v0] ✅ Alarm scheduled successfully. Active alarms: ${this.alarms.size}`)
  }

  showAlarm(config: AlarmConfig) {
    if (this.shownAlarms.has(config.id)) {
      console.log(`[v0] ⚠️ Alarm already shown: ${config.id}`)
      return
    }

    console.log(`[v0] 🔔 SHOWING ALARM: ${config.title}`)
    this.shownAlarms.add(config.id)
    this.saveShownAlarms()

    if (this.notificationSound && this.audioReady) {
      let count = 0
      const playSound = () => {
        if (this.notificationSound && count < 3) {
          this.notificationSound.currentTime = 0
          this.notificationSound
            .play()
            .then(() => {
              console.log(`[v0] 🔊 Sound played ${count + 1}/3`)
            })
            .catch((err) => {
              console.error(`[v0] ❌ Sound play error:`, err)
            })
          count++
          if (count < 3) {
            setTimeout(playSound, 1000)
          }
        }
      }
      playSound()
    } else {
      console.log("[v0] ⚠️ Audio not ready. Click anywhere on the page first to enable sound.")
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification(config.title, {
            body: config.message,
            icon: "/icon.png",
            requireInteraction: true,
          })
          console.log("[v0] ✅ Browser notification shown")
        } catch (err) {
          console.error("[v0] ❌ Notification error:", err)
        }
      }
    }

    if (this.popupElement) {
      this.popupElement.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔔</div>
          <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #1a1a1a; font-weight: 600;">${config.title}</h2>
          <p style="margin: 0 0 16px 0; color: #666; font-size: 16px;">${config.message}</p>
          <button id="alarm-close-btn"
                  style="width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500; transition: background 0.2s;"
                  onmouseover="this.style.background='#2563eb'"
                  onmouseout="this.style.background='#3b82f6'">
            확인
          </button>
        </div>
      `
      this.popupElement.style.display = "block"

      const closeBtn = document.getElementById("alarm-close-btn")
      if (closeBtn) {
        closeBtn.onclick = () => {
          this.hidePopup()
          if (this.notificationSound) {
            this.notificationSound.pause()
            this.notificationSound.currentTime = 0
          }
        }
      }

      console.log("[v0] ✅ Popup displayed")

      setTimeout(() => {
        this.hidePopup()
      }, 30000)
    }
  }

  cancelAlarm(id: string) {
    const timeout = this.alarms.get(id)
    if (timeout) {
      clearTimeout(timeout)
      this.alarms.delete(id)
      console.log(`[v0] Cancelled alarm: ${id}`)
    }
  }

  hidePopup() {
    if (this.popupElement) {
      this.popupElement.style.display = "none"
    }
  }
}

export const notificationManager = new NotificationManager()

const MEDICATION_COMPLETIONS_KEY = "medication_completions"

export function setupMedicationAlarms(medication: any) {
  if (!medication.alarmEnabled || !medication.times) return

  medication.times.forEach((time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const now = new Date()
    const alarmDate = new Date()
    alarmDate.setHours(hours, minutes, 0, 0)

    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1)
    }

    notificationManager.scheduleAlarm({
      id: `medication_${medication.id}_${time}`,
      title: "복약 시간",
      message: `${medication.name} 복용 시간입니다`,
      scheduleTime: alarmDate,
      type: "health",
    })
  })
}

export function cancelNotification(id: string) {
  notificationManager.cancelAlarm(id)
}

export function getMedicationCompletions(medicationId: string, date: string): string[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(MEDICATION_COMPLETIONS_KEY)
  if (!data) return []

  try {
    const completions = JSON.parse(data)
    const key = `${medicationId}_${date}`
    return completions[key] || []
  } catch {
    return []
  }
}

export function toggleMedicationCompletion(medicationId: string, time: string, date: string) {
  if (typeof window === "undefined") return

  const data = localStorage.getItem(MEDICATION_COMPLETIONS_KEY)
  const completions = data ? JSON.parse(data) : {}
  const key = `${medicationId}_${date}`

  if (!completions[key]) {
    completions[key] = []
  }

  const index = completions[key].indexOf(time)
  if (index > -1) {
    completions[key].splice(index, 1)
  } else {
    completions[key].push(time)
  }

  localStorage.setItem(MEDICATION_COMPLETIONS_KEY, JSON.stringify(completions))
}
