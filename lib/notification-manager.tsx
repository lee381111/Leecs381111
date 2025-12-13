import type { Medication } from "./types"

interface AlarmConfig {
  id: string
  title: string
  message: string
  scheduleTime: Date
  type: "schedule" | "health" | "vehicle" | "maintenance"
}

class NotificationManager {
  private alarms: Map<string, NodeJS.Timeout> = new Map()
  private notificationSound: HTMLAudioElement | null = null
  private popupElement: HTMLDivElement | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.notificationSound = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LdjHAU2j9TwyXkrBSd3xO3akz8IFly05+mnVhMJQ5zh8L1wIAUqgM3y2Io2Bxpqve/nmk0MDU6k4PC5ZBsGNo7U88p6KgUnd8Ts3ZI+Bxdct+fqqFcUCkKb4O+9cB8EKn/M8dmKNgcbarrv6JlNDA1NpODxumYbBjSN0fPLeisEKHjB7eGRPgcXXLjn32pXFAlCmN7uvXAfBSl9yvDZijYHGmm678CXTgwNTKPf8bpmGwUzjdHz03wqBCl4we3gkj4HFlm25d5pVhIKQZje7r1wHwQpfcrw2Yo2Bxppue/gmE4MDU2k4PG6ZhsFM43R89N8KgQoeMHt4JI+BxdcuOfeaVYTCkGY3u69cB8FKX3K8NmKNgcaabrw35dODA1Mo9/xumYbBTON0fPTfCoEKXjB7eCRPgcWWLbl3mlWEgpBmN7uvXAfBSl9yvDZijYHGmm678CXTgwMTKPf8bpmGwU0jdHz03wqBCl4we3gkT4HFlm25d5oVhIKQZje7r1wHwUpfcrw2Yo2Bxppuu+/l04MDUyj3/G6ZhsFM43R89N8KgQpeMHt4JE+BxZZtuXeaFYSCkGY3u69cB8FKX3K8NmKNgcaabrwv5dODA1Mo9/xumYbBTSN0fPTfCoEKXjB7eCRPgcWWbbl3mlWEgpBmN7uvXAfBSl9yvDZijYHGmm678CXTgwNTKPf8bpmGwU0jdHz03wqBCl4we3gkj4HFlm25d5oVhIKQZje7r1wHwUpfcrw2Yo2Bxppuu+/l04MDU2k4fG6ZhsFM43R89N8KgQoeMHt4JE+BxZZtuXfaVYSCkGY3u69cB8FKX3K8A==",
      )
      this.notificationSound.volume = 0.7
      this.notificationSound.loop = false
    }
  }

  async requestPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }
  }

  scheduleAlarm(config: AlarmConfig) {
    const now = Date.now()
    const timeUntilAlarm = config.scheduleTime.getTime() - now

    if (timeUntilAlarm <= 0) {
      console.log("[v0] Alarm time has already passed")
      return
    }

    this.cancelAlarm(config.id)

    const timeout = setTimeout(() => {
      this.showNotification(config.title, config.message)
      this.alarms.delete(config.id)
    }, timeUntilAlarm)

    this.alarms.set(config.id, timeout)

    localStorage.setItem(
      `alarm_${config.id}`,
      JSON.stringify({
        ...config,
        scheduleTime: config.scheduleTime.toISOString(),
      }),
    )

    console.log("[v0] Alarm scheduled:", config.id, "in", timeUntilAlarm / 1000, "seconds")
  }

  cancelAlarm(id: string) {
    const timeout = this.alarms.get(id)
    if (timeout) {
      clearTimeout(timeout)
      this.alarms.delete(id)
    }
    localStorage.removeItem(`alarm_${id}`)
    console.log("[v0] Alarm cancelled:", id)
  }

  showNotification(title: string, body: string) {
    if (this.notificationSound) {
      this.notificationSound.currentTime = 0
      let playCount = 0
      const maxPlays = 3 // Play 3 times

      const playNext = () => {
        if (playCount < maxPlays) {
          this.notificationSound!.currentTime = 0
          this.notificationSound!.play().catch((err) => {
            console.log("[v0] Could not play notification sound:", err)
          })
          playCount++
        }
      }

      this.notificationSound.addEventListener("ended", playNext, { once: false })
      playNext()

      // Clean up after all plays
      setTimeout(() => {
        this.notificationSound?.removeEventListener("ended", playNext)
      }, 10000)
    }

    this.showInAppPopup(title, body)

    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: "/icon.svg",
        requireInteraction: true,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    } else {
      alert(`${title}\n\n${body}`)
    }
  }

  private showInAppPopup(title: string, body: string) {
    if (this.popupElement) {
      document.body.removeChild(this.popupElement)
    }

    this.popupElement = document.createElement("div")
    this.popupElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 3px solid #10b981;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      min-width: 300px;
      max-width: 500px;
      animation: alarmPulse 1s infinite;
    `

    const style = document.createElement("style")
    style.textContent = `
      @keyframes alarmPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.05); }
      }
    `
    document.head.appendChild(style)

    this.popupElement.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">⏰</div>
        <h2 style="margin: 0 0 12px 0; color: #10b981; font-size: 24px;">${title}</h2>
        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">${body}</p>
        <button id="alarm-dismiss" style="
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        ">확인</button>
      </div>
    `

    document.body.appendChild(this.popupElement)

    const dismissButton = document.getElementById("alarm-dismiss")
    dismissButton?.addEventListener("click", () => {
      if (this.popupElement) {
        document.body.removeChild(this.popupElement)
        this.popupElement = null
      }
    })

    // Auto dismiss after 30 seconds
    setTimeout(() => {
      if (this.popupElement) {
        document.body.removeChild(this.popupElement)
        this.popupElement = null
      }
    }, 30000)
  }

  restoreAlarms() {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith("alarm_")) {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const config = JSON.parse(data)
            config.scheduleTime = new Date(config.scheduleTime)

            if (config.scheduleTime.getTime() > Date.now()) {
              this.scheduleAlarm(config)
            } else {
              localStorage.removeItem(key)
            }
          }
        } catch (error) {
          console.error("[v0] Failed to restore alarm:", key, error)
        }
      }
    })
  }
}

export const notificationManager = new NotificationManager()

export function scheduleNotification(id: string, title: string, message: string, time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  const now = new Date()
  const scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)

  if (scheduleTime.getTime() < now.getTime()) {
    scheduleTime.setDate(scheduleTime.getDate() + 1)
  }

  notificationManager.scheduleAlarm({
    id,
    title,
    message,
    scheduleTime,
    type: "health",
  })
}

export function cancelNotification(id: string) {
  notificationManager.cancelAlarm(id)
}

export function setupMedicationAlarms(medications: Medication[]) {
  medications.forEach((med) => {
    if (med.alarmEnabled && med.isActive) {
      med.times.forEach((time) => {
        scheduleNotification(`med_${med.id}_${time}`, `💊 복약 시간`, `${med.name} ${med.dosage} 복용 시간입니다`, time)
      })
    }
  })
}

export function getMedicationCompletions(medId: string, date: string): string[] {
  const completions = JSON.parse(localStorage.getItem("medication_completions") || "{}")
  return completions[medId]?.[date] || []
}

export function toggleMedicationCompletion(medId: string, time: string, date: string) {
  const completions = JSON.parse(localStorage.getItem("medication_completions") || "{}")
  if (!completions[medId]) {
    completions[medId] = {}
  }
  if (!completions[medId][date]) {
    completions[medId][date] = []
  }

  const index = completions[medId][date].indexOf(time)
  if (index > -1) {
    completions[medId][date].splice(index, 1)
  } else {
    completions[medId][date].push(time)
    completions[medId][date].sort()
  }

  localStorage.setItem("medication_completions", JSON.stringify(completions))
  window.dispatchEvent(new Event("storage"))

  console.log(`[v0] Medication ${medId} completion toggled for ${time} on ${date}`)
}
