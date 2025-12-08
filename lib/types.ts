export type Language = "ko" | "en" | "zh" | "ja"

export interface Attachment {
  type: string
  name: string
  url?: string
  data?: string
  size?: number
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  attachments?: Attachment[]
  createdAt: string
  updatedAt: string
  user_id?: string
}

export interface DiaryEntry {
  id: string
  date: string
  content: string
  mood: string
  weather: string
  attachments?: Attachment[]
  createdAt: string
  user_id?: string
}

export interface ScheduleEvent {
  id: string
  title: string
  date: string
  time: string
  category: string
  description: string
  attachments?: Attachment[]
  alarmEnabled?: boolean
  alarmMinutesBefore?: number
  isSpecialEvent?: boolean // Added flag to identify special events
  createdAt: string
  user_id?: string
}

export interface TravelRecord {
  id: string
  destination: string
  startDate: string
  endDate: string
  description?: string
  notes?: string
  expenses?: string
  expense?: number // Added expense field for travel cost
  category?: "도시" | "자연" | "산" | "바다" | "유적지" | "맛집" | "카페" | "기타"
  latitude?: string | number
  longitude?: string | number
  attachments?: Attachment[]
  createdAt: string
  user_id?: string
}

export interface VehicleRecord {
  id: string
  type: string
  date: string
  mileage: string
  category: string
  cost: string
  description: string
  attachments?: Attachment[]
  createdAt: string
  user_id?: string
}

export interface HealthRecord {
  id: string
  date: string
  type: "vital_signs" | "medication" | "expense" | "exercise"
  bloodPressure?: {
    systolic: number
    diastolic: number
  }
  bloodSugar?: number
  temperature?: number
  weight?: number
  steps?: number
  distance?: number
  medicalExpense?: number
  medicationExpense?: number
  notes?: string
  attachments?: Attachment[]
  createdAt: string
  user_id?: string
}

export interface User {
  id: string
  email: string
  name?: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  startDate: string
  endDate: string
  notes: string
  alarmEnabled: boolean
  isActive: boolean
  createdAt: string
  user_id?: string
  attachments?: Attachment[]
}

export interface Vehicle {
  id: string
  name: string
  licensePlate: string
  model: string
  year: string
  purchaseYear?: string
  insurance?: string
  createdAt: string
  user_id?: string
}

export interface VehicleMaintenanceRecord {
  id: string
  vehicleId: string
  type: "engine_oil" | "tire" | "filter" | "repair" | "insurance" | "parts" | "other"
  date: string
  mileage: number
  amount: number
  notes: string
  attachments?: Attachment[]
  createdAt: string
  user_id?: string
}

export interface PreventiveMaintenanceSchedule {
  id: string
  vehicleId: string
  type: "engine_oil" | "tire" | "filter" | "repair" | "insurance" | "parts" | "other"
  scheduledDate: string
  mileage: number
  description: string
  alarmEnabled: boolean
  alarmDaysBefore: number
  isCompleted: boolean
  createdAt: string
  user_id?: string
}

export interface BusinessCard {
  id: string
  name: string
  company: string
  position: string
  phone: string
  email: string
  address?: string
  notes?: string
  imageUrl?: string
  attachments?: Attachment[]
  rotation?: number // Added rotation angle field for image orientation
  createdAt: string
  user_id?: string
}

export interface BudgetTransaction {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  date: string
  description?: string
  attachments?: Attachment[]
  createdAt: string
  user_id?: string
}

export interface Notification {
  id: string
  type: "schedule" | "medication" | "maintenance"
  title: string
  message: string
  scheduledTime: string
  isRead: boolean
  relatedId: string
  createdAt: string
  user_id: string
}

export interface MedicalContact {
  id: string
  name: string
  type: "hospital" | "clinic" | "pharmacy"
  phone: string
  address?: string
  notes?: string
  createdAt: string
  user_id?: string
}

export interface TodoItem {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  repeatType: "none" | "daily" | "weekly" | "monthly"
  alarmEnabled: boolean
  alarmTime?: string
  createdAt: string
  user_id?: string
}

export interface Announcement {
  id: string
  message: {
    ko: string
    en: string
    zh: string
    ja: string
  }
  type: "info" | "warning" | "success"
  isActive: boolean
  expiresAt?: string
  createdAt: string
  updatedAt?: string
  createdBy?: string
}
