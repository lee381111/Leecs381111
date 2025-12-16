import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { message, language, userId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const supabase = await createClient()

    let userContext = ""

    if (userId) {
      const { data: schedules } = await supabase
        .from("schedules")
        .select("*")
        .eq("user_id", userId)
        .eq("completed", false)
        .order("start_time", { ascending: true })
        .limit(20)

      const { data: notes } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10)

      const { data: vehicles } = await supabase.from("vehicles").select("*").eq("user_id", userId).limit(5)

      const today = new Date()
      const thisWeekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      const contextLabels = {
        ko: {
          schedules: "사용자의 일정:",
          thisWeek: "이번 주 일정:",
          notes: "최근 노트:",
          vehicles: "차량 정보:",
        },
        en: {
          schedules: "User's schedules:",
          thisWeek: "This week's schedules:",
          notes: "Recent notes:",
          vehicles: "Vehicle information:",
        },
        zh: {
          schedules: "用户日程:",
          thisWeek: "本周日程:",
          notes: "最近笔记:",
          vehicles: "车辆信息:",
        },
        ja: {
          schedules: "ユーザーのスケジュール:",
          thisWeek: "今週のスケジュール:",
          notes: "最近のノート:",
          vehicles: "車両情報:",
        },
      }

      const labels = contextLabels[language as keyof typeof contextLabels] || contextLabels.ko

      if (schedules && schedules.length > 0) {
        const thisWeekSchedules = schedules.filter((s) => {
          const scheduleDate = new Date(s.start_time)
          return scheduleDate >= today && scheduleDate <= thisWeekEnd
        })

        userContext += `\n\n${labels.schedules}\n`
        schedules.forEach((s) => {
          const startTime = new Date(s.start_time)
          const dateStr = startTime.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US")
          const timeStr = startTime.toLocaleTimeString(language === "ko" ? "ko-KR" : "en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
          userContext += `- ${dateStr} ${timeStr}: ${s.title}${s.description ? ` (${s.description})` : ""}\n`
        })

        if (thisWeekSchedules.length > 0) {
          userContext += `\n${labels.thisWeek}\n`
          thisWeekSchedules.forEach((s) => {
            const startTime = new Date(s.start_time)
            const dateStr = startTime.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US")
            const timeStr = startTime.toLocaleTimeString(language === "ko" ? "ko-KR" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
            userContext += `- ${dateStr} ${timeStr}: ${s.title}\n`
          })
        }
      }

      if (notes && notes.length > 0) {
        userContext += `\n\n${labels.notes}\n`
        notes.slice(0, 5).forEach((n) => {
          userContext += `- ${n.title}: ${n.content.substring(0, 100)}...\n`
        })
      }

      if (vehicles && vehicles.length > 0) {
        userContext += `\n\n${labels.vehicles}\n`
        vehicles.forEach((v) => {
          userContext += `- ${v.name || "Vehicle"}: ${v.model || ""} (${v.year || ""})\n`
        })
      }
    }

    const systemPrompt =
      language === "ko"
        ? `당신은 친절한 AI 비서입니다. 사용자의 일정, 노트, 차량 관리를 도와주는 개인 비서 역할을 합니다. 간결하고 명확하게 답변하세요. 반드시 한국어로 답변하세요.${userContext}`
        : language === "en"
          ? `You are a friendly AI assistant. You help users manage their schedules, notes, and vehicle maintenance. Provide concise and clear responses. IMPORTANT: Always respond in English only.${userContext}`
          : language === "zh"
            ? `您是一位友好的AI助手。您帮助用户管理日程、笔记和车辆维护。请提供简洁明了的回答。重要：请仅用中文回答。${userContext}`
            : `あなたは親切なAIアシスタントです。ユーザーのスケジュール、ノート、車両管理をサポートします。簡潔で明確な回答を提供してください。重要：必ず日本語で回答してください。${userContext}`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || "No response"

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("[v0] AI chat API error:", error)
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}
