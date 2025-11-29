import { getSupabaseClient } from "./supabase-client"
import type {
  Note,
  HealthRecord,
  DiaryEntry,
  Schedule,
  TravelDestination,
  Vehicle,
  BudgetEntry,
  BusinessCard,
} from "./types"

// Notes
export async function saveNotes(notes: Note[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("notes").upsert(notes.map((note) => ({ ...note, user_id: userId })))

  if (error) throw error
  return notes
}

export async function loadNotes(userId: string): Promise<Note[]> {
  const supabase = getSupabaseClient()
  console.log("[v0] Loading notes for userId:", userId)
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error loading notes:", error)
    throw error
  }
  console.log("[v0] Loaded notes:", data?.length || 0, "items")
  return data || []
}

// Health Records
export async function saveHealthRecords(records: HealthRecord[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from("health_records")
    .upsert(records.map((record) => ({ ...record, user_id: userId })))

  if (error) throw error
  return records
}

export async function loadHealthRecords(userId: string): Promise<HealthRecord[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("health_records")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Diary Entries
export async function saveDiaryEntries(entries: DiaryEntry[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("diary_entries").upsert(entries.map((entry) => ({ ...entry, user_id: userId })))

  if (error) throw error
  return entries
}

export async function loadDiaryEntries(userId: string): Promise<DiaryEntry[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("diary_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Diaries (alias for diary entries)
export async function saveDiaries(entries: DiaryEntry[], userId: string) {
  return saveDiaryEntries(entries, userId)
}

export async function loadDiaries(userId: string): Promise<DiaryEntry[]> {
  console.log("[v0] Loading diaries for userId:", userId)
  return loadDiaryEntries(userId)
}

// Schedules
export async function saveSchedules(schedules: Schedule[], userId: string) {
  const supabase = getSupabaseClient()
  const dbSchedules = schedules.map((schedule) => {
    let startTime = schedule.startTime
    if (!startTime && schedule.date && schedule.time) {
      startTime = `${schedule.date}T${schedule.time}`
    } else if (!startTime && schedule.date) {
      startTime = `${schedule.date}T00:00:00`
    }

    const dbSchedule: any = {
      id: schedule.id,
      user_id: userId,
      title: schedule.title,
      description: schedule.description,
      category: schedule.category,
      alarm_enabled: schedule.alarmEnabled ?? false,
      alarm_time: schedule.alarmTime,
      start_time: startTime,
      end_time: schedule.endTime,
      is_special_event: schedule.isSpecialEvent ?? false,
      completed: schedule.completed ?? false,
      created_at: schedule.created_at,
      updated_at: schedule.updated_at,
      attachments: schedule.attachments,
    }

    Object.keys(dbSchedule).forEach((key) => {
      if (dbSchedule[key] === undefined) {
        delete dbSchedule[key]
      }
    })

    return dbSchedule
  })

  const { error } = await supabase.from("schedules").upsert(dbSchedules)

  if (error) throw error
  return schedules
}

export async function loadSchedules(userId: string): Promise<Schedule[]> {
  const supabase = getSupabaseClient()
  console.log("[v0] Loading schedules for userId:", userId)
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("user_id", userId)
    .order("start_time", { ascending: false })

  if (error) {
    console.error("[v0] Error loading schedules:", error)
    throw error
  }

  console.log("[v0] Loaded schedules:", data?.length || 0, "items")

  return (data || []).map((schedule) => {
    let date = ""
    let time = ""

    if (schedule.start_time) {
      const startDate = new Date(schedule.start_time)
      date = startDate.toISOString().split("T")[0]
      time = startDate.toTimeString().slice(0, 5)
    }

    return {
      ...schedule,
      date,
      time,
      alarmEnabled: schedule.alarm_enabled ?? false,
      alarmTime: schedule.alarm_time,
      startTime: schedule.start_time,
      endTime: schedule.endTime,
      isSpecialEvent: schedule.is_special_event ?? false,
    }
  })
}

// Travel Destinations
export async function saveTravelDestinations(destinations: TravelDestination[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from("travel_records")
    .upsert(destinations.map((dest) => ({ ...dest, user_id: userId })))

  if (error) throw error
  return destinations
}

export async function loadTravelDestinations(userId: string): Promise<TravelDestination[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("travel_records")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Travel Records (alias for travel destinations)
export async function loadTravelRecords(userId: string) {
  return loadTravelDestinations(userId)
}

export async function saveTravelRecords(destinations: TravelDestination[], userId: string) {
  return saveTravelDestinations(destinations, userId)
}

// Vehicles
export async function saveVehicles(vehicles: Vehicle[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("vehicles").upsert(vehicles.map((vehicle) => ({ ...vehicle, user_id: userId })))

  if (error) throw error
  return vehicles
}

export async function loadVehicles(userId: string): Promise<Vehicle[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Vehicle Records (alias for vehicles)
export async function loadVehicleRecords(userId: string) {
  return loadVehicles(userId)
}

// Vehicle Maintenance Records
export async function loadVehicleMaintenanceRecords(userId: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("vehicle_maintenance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function saveVehicleMaintenanceRecords(records: any[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from("vehicle_maintenance")
    .upsert(records.map((record) => ({ ...record, user_id: userId })))

  if (error) throw error
  return records
}

// Budget Entries
export async function saveBudgetEntries(entries: BudgetEntry[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from("budget_transactions")
    .upsert(entries.map((entry) => ({ ...entry, user_id: userId })))

  if (error) throw error
  return entries
}

export async function loadBudgetEntries(userId: string): Promise<BudgetEntry[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("budget_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

// Budget Transactions (alias for budget entries)
export async function saveBudgetTransactions(entries: BudgetEntry[], userId: string) {
  return saveBudgetEntries(entries, userId)
}

export async function loadBudgetTransactions(userId: string): Promise<BudgetEntry[]> {
  return loadBudgetEntries(userId)
}

// Business Cards
export async function saveBusinessCards(cards: BusinessCard[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("business_cards").upsert(cards.map((card) => ({ ...card, user_id: userId })))

  if (error) throw error
  return cards
}

export async function loadBusinessCards(userId: string): Promise<BusinessCard[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("business_cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Medications
export async function loadMedications(userId: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function saveMedications(medications: any[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("medications").upsert(medications.map((med) => ({ ...med, user_id: userId })))

  if (error) throw error
  return medications
}

// Radio Stations
export async function loadRadioStations(userId: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("radio_stations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function saveRadioStations(stations: any[], userId: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from("radio_stations")
    .upsert(stations.map((station) => ({ ...station, user_id: userId })))

  if (error) throw error
  return stations
}

// Export/Import All Data
export async function exportAllData(userId: string) {
  const [notes, health, diaries, schedules, travel, vehicles, budget, cards] = await Promise.all([
    loadNotes(userId),
    loadHealthRecords(userId),
    loadDiaries(userId),
    loadSchedules(userId),
    loadTravelDestinations(userId),
    loadVehicles(userId),
    loadBudgetEntries(userId),
    loadBusinessCards(userId),
  ])

  return {
    notes,
    health,
    diaries,
    schedules,
    travel,
    vehicles,
    budget,
    cards,
    exportedAt: new Date().toISOString(),
  }
}

export async function importAllData(data: any, userId: string) {
  const promises = []

  if (data.notes) promises.push(saveNotes(data.notes, userId))
  if (data.health) promises.push(saveHealthRecords(data.health, userId))
  if (data.diaries) promises.push(saveDiaries(data.diaries, userId))
  if (data.schedules) promises.push(saveSchedules(data.schedules, userId))
  if (data.travel) promises.push(saveTravelDestinations(data.travel, userId))
  if (data.vehicles) promises.push(saveVehicles(data.vehicles, userId))
  if (data.budget) promises.push(saveBudgetEntries(data.budget, userId))
  if (data.cards) promises.push(saveBusinessCards(data.cards, userId))
  if (data.radioStations) promises.push(saveRadioStations(data.radioStations, userId))

  await Promise.all(promises)
}
