import { createClient } from "@/lib/supabase/client"
import type {
  Note,
  DiaryEntry,
  ScheduleEvent,
  TravelRecord,
  VehicleRecord,
  HealthRecord,
  Medication,
  Vehicle,
  VehicleMaintenanceRecord,
  BusinessCard,
  BudgetTransaction,
  TodoItem,
  MedicalContact,
  Announcement, // Added Announcement import
} from "./types"
import { checkStorageAvailable, updateStorageUsage } from "./storage-quota"

async function uploadAttachment(attachment: any, userId: string, bucket = "attachments"): Promise<string> {
  const supabase = createClient()

  // If already a URL (not base64), return as-is
  if (attachment.url && !attachment.url.startsWith("data:")) {
    return attachment.url
  }

  try {
    // Convert base64 to blob
    const dataUrl = attachment.data || attachment.url
    if (!dataUrl || !dataUrl.startsWith("data:")) {
      console.warn("[v0] Invalid attachment data:", attachment)
      return ""
    }

    const base64Data = dataUrl.split(",")[1]
    const mimeType = dataUrl.match(/data:([^;]+);/)?.[1] || "application/octet-stream"
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })

    const fileSize = blob.size
    const { available, info } = await checkStorageAvailable(userId, fileSize)

    if (!available) {
      if (info) {
        const authType = info.authType === "pi" ? "Pi" : "이메일"
        const remaining = (info.remaining / (1024 * 1024)).toFixed(2)
        const quota = (info.quota / (1024 * 1024)).toFixed(0)

        console.error(`[v0] Storage quota exceeded. Remaining: ${remaining}MB / ${quota}MB`)
        alert(
          `저장 용량이 부족합니다!\n\n` +
            `사용 가능: ${remaining}MB / ${quota}MB\n` +
            `인증 방식: ${authType}\n\n` +
            (info.authType === "pi" && !info.isPremium
              ? "프리미엄으로 업그레이드하면 500MB를 사용할 수 있습니다."
              : "파일을 삭제하거나 용량을 확보해주세요."),
        )
      }
      return ""
    }

    // Generate unique filename
    const ext = mimeType.split("/")[1] || "bin"
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, blob, {
      contentType: mimeType,
      upsert: false,
    })

    if (error) {
      console.error("[v0] Upload error:", error)
      // Return empty string instead of throwing - graceful degradation
      return ""
    }

    await updateStorageUsage(userId, fileSize)

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    console.error("[v0] Error processing attachment:", error)
    return ""
  }
}

// Notes
export async function saveNotes(notes: Note[], userId: string) {
  if (!userId) {
    throw new Error("User ID is required")
  }

  const supabase = createClient()

  try {
    const processedNotes = await Promise.all(
      notes.map(async (note) => {
        if (!note.attachments || note.attachments.length === 0) {
          return note
        }

        const processedAttachments = await Promise.all(
          note.attachments.map(async (attachment) => {
            const dataUrl = attachment.data || attachment.url || ""
            const isLarge = dataUrl.length > 100000

            if (isLarge) {
              const uploadedUrl = await uploadAttachment(attachment, userId, "notes-attachments")

              if (uploadedUrl) {
                return {
                  type: attachment.type,
                  name: attachment.name,
                  url: uploadedUrl,
                }
              }
            }

            return {
              type: attachment.type,
              name: attachment.name,
              url: attachment.url || attachment.data,
              data: attachment.data || attachment.url,
            }
          }),
        )

        return {
          ...note,
          attachments: processedAttachments.filter((a) => a.url),
        }
      }),
    )

    if (processedNotes.length > 0) {
      const dbNotes = processedNotes.map((note) => ({
        id: note.id,
        user_id: userId,
        title: note.title,
        content: note.content || "",
        category: note.tags.join(","),
        media_urls: note.attachments || [],
        created_at: note.createdAt,
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase.from("notes").upsert(dbNotes, { onConflict: "id" })

      if (error) {
        console.error("[v0] Database error:", error)
        throw error
      }

      const currentIds = processedNotes.map((n) => n.id)
      const { error: deleteError } = await supabase
        .from("notes")
        .delete()
        .eq("user_id", userId)
        .not("id", "in", `(${currentIds.join(",")})`)

      if (deleteError) {
        console.error("[v0] Error cleaning up old notes:", deleteError)
      }
    } else {
      await supabase.from("notes").delete().eq("user_id", userId)
    }
  } catch (error) {
    console.error("[v0] Failed to save notes:", error)
    throw error
  }
}

export async function loadNotes(userId: string): Promise<Note[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("[v0] Failed to load notes:", error.message)
    return []
  }

  const notes = (data || []).map((row) => {
    let attachments = []
    try {
      if (Array.isArray(row.media_urls)) {
        attachments = row.media_urls
      } else if (typeof row.media_urls === "string") {
        attachments = JSON.parse(row.media_urls)
      } else if (row.media_urls && typeof row.media_urls === "object") {
        attachments = [row.media_urls]
      }
    } catch (e) {
      console.error("Failed to parse attachments:", e)
      attachments = []
    }

    return {
      id: row.id,
      title: row.title,
      content: row.content,
      tags: row.category ? row.category.split(",").filter(Boolean) : [],
      attachments,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      user_id: row.user_id,
    }
  })

  return notes
}

// Diaries
export async function saveDiaries(diaries: DiaryEntry[], userId: string) {
  const supabase = createClient()

  await supabase.from("diary_entries").delete().eq("user_id", userId)

  if (diaries.length > 0) {
    const dbDiaries = diaries.map((diary) => ({
      id: diary.id,
      user_id: userId,
      title: diary.title || "",
      content: diary.content || diary.entry,
      mood: diary.mood || "",
      weather: diary.weather || "",
      media_urls: diary.attachments || [],
      created_at: diary.createdAt,
    }))

    const { error } = await supabase.from("diary_entries").insert(dbDiaries)
    if (error) throw error
  }
}

export async function loadDiaries(userId: string): Promise<DiaryEntry[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("diary_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []).map((row) => {
    let mediaUrls = []
    try {
      if (Array.isArray(row.media_urls)) {
        mediaUrls = row.media_urls
      } else if (typeof row.media_urls === "string") {
        mediaUrls = JSON.parse(row.media_urls)
      }
    } catch (e) {
      console.error("Failed to parse mediaUrls:", e)
      mediaUrls = []
    }

    return {
      id: row.id,
      date: row.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
      entry: row.content,
      title: row.title,
      content: row.content,
      mood: row.mood,
      weather: row.weather,
      mediaUrls,
      attachments: mediaUrls, // Also expose as attachments for consistency
      createdAt: row.created_at,
    }
  })
}

// Schedules
export async function saveSchedules(schedules: ScheduleEvent[], userId: string) {
  const supabase = createClient()

  if (schedules.length === 0) {
    // If no schedules, delete all user schedules
    const { error } = await supabase.from("schedules").delete().eq("user_id", userId)
    if (error) throw error
    return
  }

  // Get current schedule IDs
  const currentIds = schedules.map((s) => s.id).filter(Boolean)

  // Delete schedules that are no longer in the list
  if (currentIds.length > 0) {
    await supabase
      .from("schedules")
      .delete()
      .eq("user_id", userId)
      .not("id", "in", `(${currentIds.join(",")})`)
  } else {
    // If no IDs (all new schedules), delete all existing
    await supabase.from("schedules").delete().eq("user_id", userId)
  }

  const dbSchedules = schedules.map((schedule) => {
    let dateOnly = schedule.date
    if (dateOnly.includes("T")) {
      dateOnly = dateOnly.split("T")[0]
    }

    const startTime = `${dateOnly} ${schedule.time || "00:00"}:00`
    const endTime = schedule.endTime
      ? `${dateOnly} ${schedule.endTime}:00`
      : `${dateOnly} ${schedule.time || "00:00"}:00`

    const alarmTime =
      schedule.alarmMinutesBefore && schedule.time
        ? (() => {
            const eventDateTime = new Date(`${dateOnly}T${schedule.time}:00`)
            const alarmDateTime = new Date(eventDateTime.getTime() - schedule.alarmMinutesBefore * 60 * 1000)
            return `${alarmDateTime.getFullYear()}-${String(alarmDateTime.getMonth() + 1).padStart(2, "0")}-${String(alarmDateTime.getDate()).padStart(2, "0")} ${String(alarmDateTime.getHours()).padStart(2, "0")}:${String(alarmDateTime.getMinutes()).padStart(2, "0")}:00`
          })()
        : null

    return {
      id: schedule.id,
      user_id: userId,
      title: schedule.title,
      description: schedule.description || "",
      category: schedule.category || "일정",
      start_time: startTime,
      end_time: endTime,
      alarm_enabled: schedule.alarmEnabled || false,
      alarm_time: alarmTime,
      completed: schedule.completed || false,
      is_special_event: schedule.isSpecialEvent || false,
      attachments: schedule.attachments || [],
      created_at: schedule.createdAt,
    }
  })

  const { error } = await supabase.from("schedules").upsert(dbSchedules, { onConflict: "id" })

  if (error) {
    console.error("[v0] Error saving schedules:", error)
    throw error
  }
}

export async function loadSchedules(userId: string): Promise<ScheduleEvent[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("user_id", userId)
    .order("start_time", { ascending: true })

  if (error) throw error

  return (data || []).map((row) => {
    const [dateWithTime] = row.start_time.split(" ")
    const date = dateWithTime.split("T")[0] // Handle both "2025-11-18" and "2025-11-18T00:00:00"

    const [, timeWithSeconds] = row.start_time.split(" ")
    const time = timeWithSeconds ? timeWithSeconds.substring(0, 5) : "00:00"

    let endTime = ""
    if (row.end_time) {
      const [, endTimeWithSeconds] = row.end_time.split(" ")
      endTime = endTimeWithSeconds ? endTimeWithSeconds.substring(0, 5) : ""
    }

    let alarmMinutesBefore = 30
    if (row.alarm_time && row.alarm_enabled) {
      try {
        const [alarmDate, alarmTimeStr] = row.alarm_time.split(" ")
        const eventDateTime = new Date(`${date}T${time}:00`)
        const alarmDateTime = new Date(`${alarmDate}T${alarmTimeStr}`)
        const calculatedMinutes = Math.floor((eventDateTime.getTime() - alarmDateTime.getTime()) / (60 * 1000))
        alarmMinutesBefore = calculatedMinutes > 0 ? calculatedMinutes : 30
      } catch (e) {
        console.error("[v0] Failed to parse alarm time:", e)
        alarmMinutesBefore = 30
      }
    }

    let attachments = []
    try {
      if (row.attachments) {
        if (Array.isArray(row.attachments)) {
          attachments = row.attachments
        } else if (typeof row.attachments === "string") {
          attachments = JSON.parse(row.attachments)
        }
      }
    } catch (e) {
      console.error("[v0] Failed to parse attachments:", e)
      attachments = []
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description || "",
      date, // Now guaranteed to be YYYY-MM-DD format
      time,
      endTime,
      category: row.category || "일정",
      alarmEnabled: row.alarm_enabled || false,
      alarmMinutesBefore,
      completed: row.completed || false,
      isSpecialEvent: row.is_special_event || false,
      attachments,
      eventName: row.title,
      eventTime: `${date} ${time}`,
      createdAt: row.created_at,
      user_id: row.user_id,
    }
  })
}

// Travel Records
export async function saveTravelRecords(travels: TravelRecord[], userId: string) {
  const supabase = createClient()

  await supabase.from("travel_records").delete().eq("user_id", userId)

  if (travels.length > 0) {
    const dbTravels = travels.map((travel) => {
      const baseRecord = {
        id: travel.id,
        user_id: userId,
        destination: travel.destination,
        start_date: travel.startDate || null,
        end_date: travel.endDate || null,
        notes: travel.notes || travel.description || "",
        media_urls: travel.attachments || [],
        created_at: travel.createdAt,
      }

      // Only add expense if it exists (column might not be in DB yet)
      if (travel.expense) {
        return { ...baseRecord, expense: travel.expense }
      }

      return baseRecord
    })

    const { error } = await supabase.from("travel_records").insert(dbTravels)
    if (error) {
      console.error("[v0] Error saving travel records:", error)
      throw error
    }

    for (const travel of travels) {
      if (travel.expense && travel.expense > 0) {
        await addBudgetTransactionAuto(
          userId,
          "expense",
          "여행",
          travel.expense,
          travel.startDate,
          `${travel.destination} 여행`,
        )
      }
    }
  }
}

export async function loadTravelRecords(userId: string): Promise<TravelRecord[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("travel_records")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("[v0] Travel records query warning (may be temporary):", error.message)
      return []
    }

    return (data || []).map((row) => {
      let attachments = []
      try {
        if (Array.isArray(row.media_urls)) {
          attachments = row.media_urls
        } else if (typeof row.media_urls === "string") {
          attachments = JSON.parse(row.media_urls)
        }
      } catch (e) {
        console.error("[v0] Failed to parse attachments for travel:", row.id, e)
        attachments = []
      }

      return {
        id: row.id,
        destination: row.destination,
        startDate: row.start_date,
        endDate: row.end_date,
        notes: row.notes,
        description: row.notes,
        expenses: "",
        expense: row.expense || undefined,
        attachments,
        createdAt: row.created_at,
        user_id: row.user_id,
      }
    })
  } catch (error) {
    console.warn("[v0] Exception loading travel records (may be network issue):", error)
    return []
  }
}

// Health Records
export async function saveHealthRecords(health: HealthRecord[], userId: string) {
  const supabase = createClient()

  await supabase.from("health_records").delete().eq("user_id", userId)

  if (health.length > 0) {
    const dbHealth = health.flatMap((record) => {
      const records = []
      const recordId = record.id
      const recordDate = record.date ? new Date(record.date).toISOString() : new Date().toISOString()
      const createdAt = record.createdAt || new Date().toISOString()

      const notePrefix = `[RECORD_ID:${recordId}]`
      const combinedNotes = `${notePrefix} ${record.notes || ""}`

      if (record.bloodPressure) {
        records.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "blood_pressure_systolic",
          value: record.bloodPressure.systolic,
          unit: "mmHg",
          notes: combinedNotes,
          recorded_at: recordDate,
          created_at: createdAt,
        })
        records.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "blood_pressure_diastolic",
          value: record.bloodPressure.diastolic,
          unit: "mmHg",
          notes: combinedNotes,
          recorded_at: recordDate,
          created_at: createdAt,
        })
      }

      if (record.bloodSugar) {
        records.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "blood_sugar",
          value: record.bloodSugar,
          unit: "mg/dL",
          notes: combinedNotes,
          recorded_at: recordDate,
          created_at: createdAt,
        })
      }

      if (record.temperature) {
        records.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "temperature",
          value: record.temperature,
          unit: "°C",
          notes: combinedNotes,
          recorded_at: recordDate,
          created_at: createdAt,
        })
      }

      if (record.weight) {
        records.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "weight",
          value: record.weight,
          unit: "kg",
          notes: combinedNotes,
          recorded_at: recordDate,
          created_at: createdAt,
        })
      }

      if (record.steps) {
        records.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "steps",
          value: record.steps,
          unit: "steps",
          notes: combinedNotes,
          recorded_at: recordDate,
          created_at: createdAt,
        })
      }

      if (record.distance) {
        records.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "distance",
          value: record.distance,
          unit: "km",
          notes: combinedNotes,
          recorded_at: recordDate,
          created_at: createdAt,
        })
      }

      if (record.medicalExpense) {
        records.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "medical_expense",
          value: record.medicalExpense,
          unit: "KRW",
          notes: combinedNotes,
          recorded_at: recordDate,
          created_at: createdAt,
        })
      }

      if (record.medicationExpense) {
        records.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "medication_expense",
          value: record.medicationExpense,
          unit: "KRW",
          notes: combinedNotes,
          recorded_at: recordDate,
          created_at: createdAt,
        })
      }

      return records
    })

    if (dbHealth.length > 0) {
      const { error } = await supabase.from("health_records").insert(dbHealth)
      if (error) throw error

      for (const record of health) {
        const dateStr = record.date
          ? new Date(record.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]

        if (record.medicalExpense && record.medicalExpense > 0) {
          await addBudgetTransactionAuto(
            userId,
            "expense",
            "의료비",
            record.medicalExpense,
            dateStr,
            `병원비 - ${record.notes || "건강기록"}`,
          )
        }

        if (record.medicationExpense && record.medicationExpense > 0) {
          await addBudgetTransactionAuto(
            userId,
            "expense",
            "의료비",
            record.medicationExpense,
            dateStr,
            `약값 - ${record.notes || "건강기록"}`,
          )
        }
      }
    }
  }
}

export async function loadHealthRecords(userId: string): Promise<HealthRecord[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("health_records")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })

  if (error) throw error

  const groupedByRecordId: { [key: string]: any } = {}
  ;(data || []).forEach((row) => {
    const recordIdMatch = row.notes?.match(/\[RECORD_ID:([^\]]+)\]/)
    const recordId = recordIdMatch ? recordIdMatch[1] : crypto.randomUUID()
    const cleanNotes = row.notes?.replace(/\[RECORD_ID:[^\]]+\]\s*/, "") || ""

    if (!groupedByRecordId[recordId]) {
      groupedByRecordId[recordId] = {
        id: recordId,
        date: row.recorded_at.split("T")[0],
        type: "vital_signs",
        notes: cleanNotes,
        createdAt: row.created_at,
        user_id: row.user_id,
      }
    }

    switch (row.type) {
      case "blood_pressure_systolic":
        if (!groupedByRecordId[recordId].bloodPressure) {
          groupedByRecordId[recordId].bloodPressure = {}
        }
        groupedByRecordId[recordId].bloodPressure.systolic = row.value
        break
      case "blood_pressure_diastolic":
        if (!groupedByRecordId[recordId].bloodPressure) {
          groupedByRecordId[recordId].bloodPressure = {}
        }
        groupedByRecordId[recordId].bloodPressure.diastolic = row.value
        break
      case "blood_sugar":
        groupedByRecordId[recordId].bloodSugar = row.value
        break
      case "temperature":
        groupedByRecordId[recordId].temperature = row.value
        break
      case "weight":
        groupedByRecordId[recordId].weight = row.value
        break
      case "steps":
        groupedByRecordId[recordId].steps = row.value
        groupedByRecordId[recordId].type = "exercise"
        break
      case "distance":
        groupedByRecordId[recordId].distance = row.value
        groupedByRecordId[recordId].type = "exercise"
        break
      case "medical_expense":
        groupedByRecordId[recordId].medicalExpense = row.value
        groupedByRecordId[recordId].type = "expense"
        break
      case "medication_expense":
        groupedByRecordId[recordId].medicationExpense = row.value
        groupedByRecordId[recordId].type = "expense"
        break
    }
  })

  return Object.values(groupedByRecordId)
}

// Medications
export async function saveMedications(medications: Medication[], userId: string) {
  const supabase = createClient()

  await supabase.from("medications").delete().eq("user_id", userId)

  if (medications.length > 0) {
    const dbMedications = medications.map((medication) => ({
      id: medication.id,
      user_id: userId,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      start_date: medication.startDate || null,
      end_date: medication.endDate || null,
      notes: medication.notes || "",
      alarm_enabled: medication.alarmEnabled || false,
      alarm_times: medication.times || [],
      medical_expense: medication.medicalExpense || null,
      medication_expense: medication.medicationExpense || null,
      attachments: medication.attachments || [],
      created_at: medication.createdAt || new Date().toISOString(),
    }))

    const { error } = await supabase.from("medications").insert(dbMedications)

    if (error) {
      console.error("[v0] 복약관리 저장 에러:", error)
      throw error
    }
  }
}

export async function loadMedications(userId: string): Promise<Medication[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []).map((row) => {
    let attachments = []
    try {
      if (Array.isArray(row.attachments)) {
        attachments = row.attachments
      } else if (typeof row.attachments === "string") {
        attachments = JSON.parse(row.attachments)
      }
    } catch (e) {
      console.error("Failed to parse attachments:", e)
      attachments = []
    }

    let times = []
    try {
      if (Array.isArray(row.alarm_times)) {
        times = row.alarm_times
      } else if (typeof row.alarm_times === "string") {
        times = JSON.parse(row.alarm_times)
      }
    } catch (e) {
      console.error("Failed to parse alarm_times:", e)
      times = []
    }

    return {
      id: row.id,
      name: row.name,
      dosage: row.dosage,
      frequency: row.frequency,
      times,
      startDate: row.start_date,
      endDate: row.end_date,
      notes: row.notes || "",
      alarmEnabled: row.alarm_enabled || false,
      isActive: true,
      medicalExpense: row.medical_expense || undefined,
      medicationExpense: row.medication_expense || undefined,
      attachments,
      createdAt: row.created_at,
      user_id: row.user_id,
    }
  })
}

export async function deleteMedicalContact(id: string, userId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("medical_contacts").delete().eq("id", id).eq("user_id", userId)

  if (error) {
    console.error("[v0] 의료 연락처 삭제 에러:", error)
    throw error
  }
}

export async function saveMedicalContacts(contacts: MedicalContact[], userId: string) {
  const supabase = createClient()

  await supabase.from("medical_contacts").delete().eq("user_id", userId)

  if (contacts.length > 0) {
    const dbContacts = contacts.map((contact) => ({
      id: contact.id,
      user_id: userId,
      name: contact.name,
      type: contact.type,
      phone: contact.phone,
      address: contact.address || null,
      notes: contact.notes || null,
      created_at: contact.createdAt || new Date().toISOString(),
    }))

    const { error } = await supabase.from("medical_contacts").insert(dbContacts)
    if (error) {
      console.error("[v0] 의료 연락처 저장 에러:", error)
      throw error
    }
  }
}

export async function loadMedicalContacts(userId: string): Promise<MedicalContact[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("medical_contacts")
    .select("*")
    .eq("user_id", userId)
    .order("type", { ascending: true })
    .order("name", { ascending: true })

  if (error) throw error

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    phone: row.phone,
    address: row.address || undefined,
    notes: row.notes || undefined,
    createdAt: row.created_at,
    user_id: row.user_id,
  }))
}

// To-Do List
export async function saveTodoItems(items: TodoItem[], userId: string) {
  const supabase = createClient()

  await supabase.from("todo_items").delete().eq("user_id", userId)

  if (items.length > 0) {
    const dbItems = items.map((item) => ({
      id: item.id,
      user_id: userId,
      title: item.title,
      description: item.description || null,
      completed: item.completed,
      priority: item.priority,
      due_date: item.dueDate || null,
      repeat_type: item.repeatType,
      created_at: item.createdAt || new Date().toISOString(),
    }))

    const { error } = await supabase.from("todo_items").insert(dbItems)
    if (error) {
      console.error("[v0] To-Do 저장 에러:", error)
      throw error
    }
  }
}

export async function loadTodoItems(userId: string): Promise<TodoItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("todo_items")
    .select("*")
    .eq("user_id", userId)
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true })

  if (error) throw error

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    completed: row.completed,
    priority: row.priority,
    dueDate: row.due_date || undefined,
    repeatType: row.repeat_type,
    createdAt: row.created_at,
  }))
}

export async function deleteTodoItem(id: string, userId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("todo_items").delete().eq("id", id).eq("user_id", userId)

  if (error) {
    console.error("[v0] To-Do 삭제 에러:", error)
    throw error
  }
}

// Vehicles
export async function saveVehicles(vehicles: Vehicle[], userId: string) {
  const supabase = createClient()

  await supabase.from("vehicles").delete().eq("user_id", userId)

  if (vehicles.length > 0) {
    const dbVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      user_id: userId,
      name: vehicle.name,
      type: vehicle.model || "",
      model: vehicle.year || "",
      year: vehicle.purchaseYear ? Number.parseInt(vehicle.purchaseYear) : null,
      license_plate: vehicle.licensePlate || "",
      created_at: vehicle.createdAt,
    }))

    const { error } = await supabase.from("vehicles").insert(dbVehicles)
    if (error) throw error
  }
}

export async function loadVehicles(userId: string): Promise<Vehicle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    licensePlate: row.license_plate || "",
    model: row.type || "",
    year: row.model || "",
    purchaseYear: row.year ? row.year.toString() : "",
    insurance: "",
    createdAt: row.created_at,
    user_id: row.user_id,
  }))
}

// Vehicle Maintenance Records
export async function saveVehicleMaintenanceRecords(records: VehicleMaintenanceRecord[], userId: string) {
  const supabase = createClient()

  await supabase.from("vehicle_maintenance").delete().eq("user_id", userId)

  if (records.length > 0) {
    const dbRecords = records.map((record) => ({
      id: record.id,
      user_id: userId,
      vehicle_id: record.vehicleId,
      type: record.type,
      date: record.date,
      mileage: record.mileage || 0,
      cost: record.amount || 0,
      description: record.notes,
      attachments: record.attachments || [],
      created_at: record.createdAt,
    }))

    const { error } = await supabase.from("vehicle_maintenance").insert(dbRecords)
    if (error) throw error

    for (const record of records) {
      if (record.amount && record.amount > 0) {
        await addBudgetTransactionAuto(
          userId,
          "expense",
          "차량유지비",
          record.amount,
          record.date,
          `${record.type} - ${record.notes || "차량정비"}`,
        )
      }
    }
  }
}

export async function loadVehicleMaintenanceRecords(userId: string): Promise<VehicleMaintenanceRecord[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("vehicle_maintenance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw error

  return (data || []).map((row) => {
    let attachments = []
    try {
      if (Array.isArray(row.attachments)) {
        attachments = row.attachments
      } else if (typeof row.attachments === "string") {
        attachments = JSON.parse(row.attachments)
      }
    } catch (e) {
      console.error("Failed to parse attachments:", e)
      attachments = []
    }

    return {
      id: row.id,
      vehicleId: row.vehicle_id,
      type: row.type,
      date: row.date,
      mileage: row.mileage,
      amount: row.cost,
      notes: row.description,
      description: row.description,
      attachments,
      createdAt: row.created_at,
    }
  })
}

// Vehicle Records (kept for backwards compatibility)
export async function saveVehicleRecords(vehicles: VehicleRecord[], userId: string) {
  await saveVehicles(vehicles, userId)
}

export async function loadVehicleRecords(userId: string): Promise<VehicleRecord[]> {
  return await loadVehicles(userId)
}

// Business Cards
export async function saveBusinessCards(cards: BusinessCard[], userId: string) {
  const supabase = createClient()

  if (cards.length > 0) {
    const dbCards = cards.map((card) => ({
      id: card.id,
      user_id: userId,
      name: card.name,
      company: card.company || "",
      position: card.position || "",
      phone: card.phone || "",
      email: card.email || "",
      address: card.address || "",
      notes: card.notes || "",
      image_url: card.imageUrl || "",
      rotation: card.rotation || 0,
      attachments: card.attachments || [],
      created_at: card.createdAt,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase.from("business_cards").upsert(dbCards, { onConflict: "id" })

    if (error) {
      console.error("[v0] Failed to save business cards:", error)
      throw error
    }

    const currentIds = cards.map((c) => c.id)
    if (currentIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("business_cards")
        .delete()
        .eq("user_id", userId)
        .not("id", "in", `(${currentIds.join(",")})`)

      if (deleteError) {
        console.error("[v0] Error cleaning up old cards:", deleteError)
      }
    }
  } else {
    await supabase.from("business_cards").delete().eq("user_id", userId)
  }
}

export async function loadBusinessCards(userId: string): Promise<BusinessCard[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("business_cards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("[v0] Business cards query error:", error.message)
      return []
    }

    return (data || []).map((row) => {
      let attachments = []
      try {
        if (Array.isArray(row.attachments)) {
          attachments = row.attachments
        } else if (typeof row.attachments === "string") {
          attachments = JSON.parse(row.attachments)
        }
      } catch (e) {
        console.error("Failed to parse attachments:", e)
        attachments = []
      }

      return {
        id: row.id,
        name: row.name,
        company: row.company,
        position: row.position,
        phone: row.phone,
        email: row.email,
        address: row.address,
        notes: row.notes,
        imageUrl: row.image_url,
        rotation: row.rotation || 0,
        attachments,
        createdAt: row.created_at,
        user_id: row.user_id,
      }
    })
  } catch (error) {
    console.warn("[v0] Exception loading business cards (table may not exist yet):", error)
    return []
  }
}

// Budget Transactions
export async function saveBudgetTransactions(transactions: BudgetTransaction[], userId: string) {
  const supabase = createClient()

  await supabase.from("budget_transactions").delete().eq("user_id", userId)

  if (transactions.length > 0) {
    const dbTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      user_id: userId,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description || "",
      attachments: transaction.attachments || [],
      created_at: transaction.createdAt,
    }))

    const { error } = await supabase.from("budget_transactions").insert(dbTransactions)
    if (error) {
      console.error("[v0] Failed to save budget transactions:", error)
      throw error
    }
  }
}

export async function loadBudgetTransactions(userId: string): Promise<BudgetTransaction[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("budget_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) {
      console.warn("[v0] Budget transactions query error:", error.message)
      return []
    }

    return (data || []).map((row) => {
      let attachments = []
      try {
        if (Array.isArray(row.attachments)) {
          attachments = row.attachments
        } else if (typeof row.attachments === "string") {
          attachments = JSON.parse(row.attachments)
        }
      } catch (e) {
        console.error("Failed to parse attachments:", e)
        attachments = []
      }

      return {
        id: row.id,
        type: row.type,
        category: row.category,
        amount: row.amount,
        date: row.date,
        description: row.description,
        attachments,
        createdAt: row.created_at,
        user_id: row.user_id,
      }
    })
  } catch (error) {
    console.warn("[v0] Exception loading budget transactions:", error)
    return []
  }
}

// Export/Import functions
export async function exportAllData(userId: string) {
  const [
    notes,
    diaries,
    schedules,
    travels,
    health,
    medications,
    vehicles,
    vehicleMaintenance,
    businessCards,
    budgetTransactions,
    todoItems,
    medicalContacts,
  ] = await Promise.all([
    loadNotes(userId),
    loadDiaries(userId),
    loadSchedules(userId),
    loadTravelRecords(userId),
    loadHealthRecords(userId),
    loadMedications(userId),
    loadVehicles(userId),
    loadVehicleMaintenanceRecords(userId),
    loadBusinessCards(userId),
    loadBudgetTransactions(userId),
    loadTodoItems(userId),
    loadMedicalContacts(userId),
  ])

  const exportData = {
    notes,
    diaries,
    schedules,
    travels,
    health,
    medications,
    vehicles,
    vehicleMaintenance,
    businessCards,
    budgetTransactions,
    todoItems,
    medicalContacts,
    exportedAt: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `forest-note-backup-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function importAllData(file: File, userId: string) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        await Promise.all([
          data.notes && saveNotes(data.notes, userId),
          data.diaries && saveDiaries(data.diaries, userId),
          data.schedules && saveSchedules(data.schedules, userId),
          data.travels && saveTravelRecords(data.travels, userId),
          data.health && saveHealthRecords(data.health, userId),
          data.medications && saveMedications(data.medications, userId),
          data.vehicles && saveVehicles(data.vehicles, userId),
          data.vehicleMaintenance && saveVehicleMaintenanceRecords(data.vehicleMaintenance, userId),
          data.businessCards && saveBusinessCards(data.businessCards, userId),
          data.budgetTransactions && saveBudgetTransactions(data.budgetTransactions, userId),
          data.todoItems && saveTodoItems(data.todoItems, userId),
          data.medicalContacts && saveMedicalContacts(data.medicalContacts, userId),
        ])

        resolve()
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// Auto budget sync helper function
async function addBudgetTransactionAuto(
  userId: string,
  type: "income" | "expense",
  category: string,
  amount: number,
  date: string,
  description: string,
) {
  try {
    const supabase = createClient()

    const transaction = {
      id: crypto.randomUUID(),
      user_id: userId,
      type,
      category,
      amount,
      date,
      description: `[자동] ${description}`,
      attachments: [],
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("budget_transactions").insert([transaction])

    if (error) {
      console.warn("[v0] Failed to auto-add budget transaction:", error)
    } else {
      console.log("[v0] Auto-added budget transaction:", category, amount)
    }
  } catch (error) {
    console.warn("[v0] Exception auto-adding budget transaction:", error)
  }
}

// Generic saveData and loadData functions for miscellaneous data like radio stations
export async function saveData<T>(key: string, data: T): Promise<void> {
  try {
    const jsonData = JSON.stringify(data)
    localStorage.setItem(`forest_note_${key}`, jsonData)
    console.log(`[v0] Saved ${key} to localStorage`)
  } catch (error) {
    console.error(`[v0] Error saving ${key}:`, error)
    throw error
  }
}

export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const jsonData = localStorage.getItem(`forest_note_${key}`)
    if (!jsonData) {
      console.log(`[v0] No data found for ${key}`)
      return null
    }
    const data = JSON.parse(jsonData) as T
    console.log(`[v0] Loaded ${key} from localStorage`)
    return data
  } catch (error) {
    console.error(`[v0] Error loading ${key}:`, error)
    return null
  }
}

// Announcement Management Functions
export async function loadActiveAnnouncements(): Promise<Announcement[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("[v0] Failed to load announcements:", error.message)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    message: row.message,
    type: row.type,
    isActive: row.is_active,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  }))
}

export async function loadAllAnnouncements(userId: string): Promise<Announcement[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false })

  if (error) {
    console.warn("[v0] Failed to load all announcements:", error.message)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    message: row.message,
    type: row.type,
    isActive: row.is_active,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  }))
}

export async function saveAnnouncement(announcement: Announcement, userId: string): Promise<void> {
  const supabase = createClient()

  console.log("[v0] Saving announcement:", announcement)

  const dbAnnouncement = {
    id: announcement.id,
    message: announcement.message,
    type: announcement.type,
    is_active: announcement.isActive,
    expires_at: announcement.expiresAt || null,
    created_by: userId,
    updated_at: new Date().toISOString(),
  }

  console.log("[v0] DB announcement object:", dbAnnouncement)

  const { error } = await supabase.from("announcements").upsert(dbAnnouncement, { onConflict: "id" })

  if (error) {
    console.error("[v0] Error saving announcement:", error)
    throw error
  }

  console.log("[v0] Announcement saved successfully")
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("announcements").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting announcement:", error)
    throw error
  }
}

// User Consent Management Functions
export async function saveUserConsent(
  userId: string,
  termsVersion: string,
  privacyVersion: string,
  ipAddress?: string,
  userAgent?: string,
) {
  const supabase = createClient()

  console.log("[v0] Saving user consent for:", userId, "Terms:", termsVersion, "Privacy:", privacyVersion)

  const consent = {
    user_id: userId,
    terms_version: termsVersion,
    privacy_version: privacyVersion,
    agreed_at: new Date().toISOString(),
    ip_address: ipAddress || null,
    user_agent: userAgent || null,
  }

  const { error } = await supabase.from("user_consents").insert([consent])

  if (error) {
    console.error("[v0] Failed to save user consent:", error)
  } else {
    console.log("[v0] User consent saved successfully")
  }
}

export async function checkUserConsent(userId: string): Promise<boolean> {
  const supabase = createClient()

  console.log("[v0] Checking user consent for:", userId)

  const { data, error } = await supabase.from("user_consents").select("id").eq("user_id", userId).limit(1)

  if (error) {
    console.error("[v0] Failed to check user consent:", error)
    return false
  }

  const hasConsent = data && data.length > 0
  console.log("[v0] Consent check result:", hasConsent, "Data:", data)

  return hasConsent
}

// Data Deletion Report for Legal Compliance
export async function generateDataDeletionReport(userId: string): Promise<string> {
  const supabase = createClient()

  try {
    const tables = [
      "profiles",
      "notes",
      "diary_entries",
      "schedules",
      "todo_items",
      "health_records",
      "medications",
      "medical_contacts",
      "budget_transactions",
      "travel_records",
      "vehicles",
      "vehicle_maintenance",
      "business_cards",
      "radio_stations",
      "user_settings",
      "announcements",
    ]

    const report = [`개인정보 파기 대장\n${"=".repeat(50)}\n`]
    report.push(`생성일시: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}\n`)
    report.push(`작성자: 관리자\n`)
    report.push(`파기 사유: 서비스 종료\n\n`)

    report.push(`데이터 현황:\n${"-".repeat(50)}\n`)

    let totalRecords = 0

    for (const table of tables) {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

      if (!error && count !== null) {
        report.push(`${table}: ${count}건\n`)
        totalRecords += count
      }
    }

    report.push(`\n총 레코드 수: ${totalRecords}건\n\n`)
    report.push(`파기 방법: Supabase 프로젝트 완전 삭제\n`)
    report.push(`파기 예정일: 서비스 종료 후 30일\n`)
    report.push(`보관 기간: 이 문서는 3년간 보관됩니다.\n`)

    return report.join("")
  } catch (error) {
    console.error("[v0] Error generating deletion report:", error)
    throw error
  }
}
