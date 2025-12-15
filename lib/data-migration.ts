import { createClient } from "@/lib/supabase/client"

export async function migrateLocalStorageToSupabase(userId: string) {
  // Check if migration has already been done
  const migrationKey = `migration_done_${userId}`
  if (localStorage.getItem(migrationKey)) {
    console.log("[v0] Migration already completed for this user")
    return
  }

  const supabase = createClient()
  console.log("[v0] Starting data migration from localStorage to Supabase...")

  try {
    // Migrate schedules
    const savedSchedules = localStorage.getItem("schedules")
    if (savedSchedules) {
      const schedules = JSON.parse(savedSchedules)
      if (schedules.length > 0) {
        const schedulesData = schedules.map((s: any) => ({
          id: s.id,
          user_id: userId,
          title: s.title,
          date: new Date(s.date).toISOString().split("T")[0],
          time: s.time,
          alarm: s.alarm || null,
          completed: s.completed || false,
          attachments: s.attachments || null,
        }))
        await supabase.from("schedules").insert(schedulesData)
        console.log(`[v0] Migrated ${schedules.length} schedules`)
      }
    }

    // Migrate diaries
    const savedDiaries = localStorage.getItem("diaries")
    if (savedDiaries) {
      const diaries = JSON.parse(savedDiaries)
      if (diaries.length > 0) {
        const diariesData = diaries.map((d: any) => ({
          id: d.id,
          user_id: userId,
          date: new Date(d.date).toISOString().split("T")[0],
          content: d.content,
          weather_emoji: d.weatherEmoji,
          mood_emoji: d.moodEmoji,
          password: d.password || null,
          attachments: d.attachments || null,
        }))
        await supabase.from("diaries").insert(diariesData)
        console.log(`[v0] Migrated ${diaries.length} diaries`)
      }
    }

    // Migrate travel locations
    const savedTravelLocations = localStorage.getItem("travelLocations")
    if (savedTravelLocations) {
      const locations = JSON.parse(savedTravelLocations)
      if (locations.length > 0) {
        const locationsData = locations.map((t: any) => ({
          id: t.id,
          user_id: userId,
          name: t.name,
          date: t.travelDate || new Date(t.date).toISOString().split("T")[0],
          type: t.locationType || null,
          notes: t.notes || "",
          lat: t.lat,
          lng: t.lng,
          attachments: t.attachments || null,
        }))
        await supabase.from("travel_locations").insert(locationsData)
        console.log(`[v0] Migrated ${locations.length} travel locations`)
      }
    }

    // Migrate radio stations
    const savedRadioStations = localStorage.getItem("radioStations")
    if (savedRadioStations) {
      const stations = JSON.parse(savedRadioStations)
      if (stations.length > 0) {
        const stationsData = stations.map((r: any) => ({
          id: r.id,
          user_id: userId,
          name: r.name,
          url: r.url,
        }))
        await supabase.from("radio_stations").insert(stationsData)
        console.log(`[v0] Migrated ${stations.length} radio stations`)
      }
    }

    // Migrate vehicles
    const savedVehicles = localStorage.getItem("vehicles")
    if (savedVehicles) {
      const vehicles = JSON.parse(savedVehicles)
      if (vehicles.length > 0) {
        const vehiclesData = vehicles.map((v: any) => ({
          id: v.id,
          user_id: userId,
          name: v.name,
          make: v.make || null,
          model: v.model || null,
          year: v.year || null,
          license_plate: v.licensePlate || null,
          purchase_date: v.purchaseDate || null,
          mileage: v.mileage || null,
          notes: v.notes || null,
        }))
        await supabase.from("vehicles").insert(vehiclesData)
        console.log(`[v0] Migrated ${vehicles.length} vehicles`)
      }
    }

    // Migrate maintenance records
    const savedMaintenanceRecords = localStorage.getItem("maintenanceRecords")
    if (savedMaintenanceRecords) {
      const records = JSON.parse(savedMaintenanceRecords)
      if (records.length > 0) {
        const recordsData = records.map((m: any) => ({
          id: m.id,
          user_id: userId,
          vehicle_id: m.vehicleId,
          date: m.date,
          category: m.category,
          type: m.type,
          cost: m.cost || null,
          mileage: m.mileage || null,
          description: m.description || null,
          next_service_date: m.nextServiceDate || null,
          next_service_mileage: m.nextServiceMileage || null,
          attachments: m.attachments || null,
        }))
        await supabase.from("vehicle_maintenance").insert(recordsData)
        console.log(`[v0] Migrated ${records.length} maintenance records`)
      }
    }

    // Migrate health records
    const savedHealthRecords = localStorage.getItem("healthRecords")
    if (savedHealthRecords) {
      const records = JSON.parse(savedHealthRecords)
      if (records.length > 0) {
        const recordsData = records.map((h: any) => ({
          id: h.id,
          user_id: userId,
          date: h.date,
          blood_pressure_systolic: h.bloodPressureSystolic || null,
          blood_pressure_diastolic: h.bloodPressureDiastolic || null,
          blood_sugar: h.bloodSugar || null,
          pulse: h.pulse || null,
          weight: h.weight || null,
          temperature: h.temperature || null,
          notes: h.notes || null,
          attachments: h.attachments || null,
        }))
        await supabase.from("health_records").insert(recordsData)
        console.log(`[v0] Migrated ${records.length} health records`)
      }
    }

    // Migrate medications
    const savedMedications = localStorage.getItem("medications")
    if (savedMedications) {
      const medications = JSON.parse(savedMedications)
      if (medications.length > 0) {
        const medicationsData = medications.map((m: any) => ({
          id: m.id,
          user_id: userId,
          name: m.name,
          dosage: m.dosage || null,
          frequency: m.frequency || null,
          start_date: m.startDate || null,
          end_date: m.endDate || null,
          time: m.time || null,
          alarm_enabled: m.alarmEnabled || false,
          notes: m.notes || null,
        }))
        await supabase.from("medications").insert(medicationsData)
        console.log(`[v0] Migrated ${medications.length} medications`)
      }
    }

    // Migrate medication logs
    const savedMedicationLogs = localStorage.getItem("medicationLogs")
    if (savedMedicationLogs) {
      const logs = JSON.parse(savedMedicationLogs)
      if (logs.length > 0) {
        const logsData = logs.map((l: any) => ({
          id: l.id,
          user_id: userId,
          medication_id: l.medicationId,
          taken_at: new Date(l.takenAt).toISOString(),
        }))
        await supabase.from("medication_logs").insert(logsData)
        console.log(`[v0] Migrated ${logs.length} medication logs`)
      }
    }

    // Mark migration as complete
    localStorage.setItem(migrationKey, "true")
    console.log("[v0] Data migration completed successfully!")
  } catch (error) {
    console.error("[v0] Error during migration:", error)
    throw error
  }
}
