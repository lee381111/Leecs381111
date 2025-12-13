"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function saveDiary(diaryData: {
  content: string
  weather_emoji: string
  mood_emoji: string
  password: string | null
  user_id: string
  attachments: any[] | null
}) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("diaries").insert(diaryData).select().single()

  if (error) {
    console.error("[v0] Server: Database error:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateDiary(
  id: string,
  diaryData: {
    content: string
    weather_emoji: string
    mood_emoji: string
    password: string | null
    attachments: any[] | null
  },
) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("diaries").update(diaryData).eq("id", id)

  if (error) {
    console.error("[v0] Server: Database error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteDiary(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("diaries").delete().eq("id", id)

  if (error) {
    console.error("[v0] Server: Database error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
