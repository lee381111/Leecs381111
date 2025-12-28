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

class NotificationManager {
  private alarms: Map<string, NodeJS.Timeout> = new Map()
  private notificationSound: HTMLAudioElement | null = null
  private popupElement: HTMLDivElement | null = null
  private shownAlarms: Set<string> = new Set()

  constructor() {
    if (typeof window !== "undefined") {
      this.notificationSound = new Audio("/notification.mp3")
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
      `
      document.body.appendChild(this.popupElement)
    }
  }

  requestPermission() {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }
    }
  }

  restoreAlarms() {
    console.log("[v0] Restoring alarms from storage...")
    // Future: Load alarms from localStorage if needed
  }

  scheduleAlarm(config: AlarmConfig) {
    const now = Date.now()
    const delay = config.scheduleTime.getTime() - now

    console.log(`[v0] Scheduling alarm: ${config.title}`)
    console.log(`[v0] Alarm time: ${config.scheduleTime.toLocaleString()}`)
    console.log(`[v0] Delay: ${Math.round(delay / 1000 / 60)} minutes`)

    if (delay <= 0) {
      console.log(`[v0] Alarm time has passed, showing immediately`)
      this.showAlarm(config)
      return
    }

    this.cancelAlarm(config.id)

    const timeout = setTimeout(() => {
      console.log(`[v0] Triggering alarm: ${config.title}`)
      this.showAlarm(config)
    }, delay)

    this.alarms.set(config.id, timeout)
  }

  showAlarm(config: AlarmConfig) {
    if (this.shownAlarms.has(config.id)) {
      console.log(`[v0] Alarm already shown: ${config.id}`)
      return
    }

    console.log(`[v0] Showing alarm: ${config.title}`)

    // Play sound 3 times
    if (this.notificationSound) {
      let count = 0
      const playSound = () => {
        this.notificationSound?.play().catch(console.error)
        count++
        if (count < 3) {
          setTimeout(playSound, 1000)
        }
      }
      playSound()
    }

    // Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(config.title, {
        body: config.message,
        icon: "/icon.png",
      })
    }

    // Show popup
    if (this.popupElement) {
      this.popupElement.innerHTML = `
        <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #1a1a1a;">${config.title}</h2>
        <p style="margin: 0 0 16px 0; color: #666;">${config.message}</p>
        <button onclick="this.parentElement.style.display='none'" 
                style="width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
          확인
        </button>
      `
      this.popupElement.style.display = "block"
    }

    this.shownAlarms.add(config.id)
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
      id: `med_${medication.id}_${time}`,
      title: `💊 ${medication.name} 복용 시간`,
      message: `${medication.name}을(를) 복용하세요`,
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
