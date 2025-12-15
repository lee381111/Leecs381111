export function downloadICS(schedule: {
  title: string
  date: Date
  time: string
  alarm?: string
}) {
  const formatDate = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":")
    const dateTime = new Date(date)
    dateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
    return dateTime.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const startDateTime = formatDate(schedule.date, schedule.time)

  // Set end time to 1 hour after start
  const endDate = new Date(schedule.date)
  const [hours, minutes] = schedule.time.split(":")
  endDate.setHours(Number.parseInt(hours) + 1, Number.parseInt(minutes), 0, 0)
  const endDateTime = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Forest of Records//Schedule//EN",
    "BEGIN:VEVENT",
    `DTSTART:${startDateTime}`,
    `DTEND:${endDateTime}`,
    `SUMMARY:${schedule.title}`,
    `DESCRIPTION:${schedule.title}`,
    "STATUS:CONFIRMED",
  ]

  // Add alarm if specified
  if (schedule.alarm) {
    const [alarmHours, alarmMinutes] = schedule.alarm.split(":")
    const [scheduleHours, scheduleMinutes] = schedule.time.split(":")

    const alarmTime = Number.parseInt(alarmHours) * 60 + Number.parseInt(alarmMinutes)
    const scheduleTime = Number.parseInt(scheduleHours) * 60 + Number.parseInt(scheduleMinutes)
    const minutesBefore = scheduleTime - alarmTime

    if (minutesBefore > 0) {
      icsContent.push("BEGIN:VALARM")
      icsContent.push("ACTION:DISPLAY")
      icsContent.push(`DESCRIPTION:${schedule.title}`)
      icsContent.push(`TRIGGER:-PT${minutesBefore}M`)
      icsContent.push("END:VALARM")
    }
  }

  icsContent.push("END:VEVENT")
  icsContent.push("END:VCALENDAR")

  const icsString = icsContent.join("\r\n")
  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${schedule.title.replace(/[^a-z0-9]/gi, "_")}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
