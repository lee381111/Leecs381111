import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { message, language, userId, timezone = "Asia/Seoul", clientDate } = await request.json()

    console.log("[v0] AI Chat - Received timezone:", timezone)
    console.log("[v0] AI Chat - Received clientDate:", clientDate)

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const supabase = await createClient()

    let userContext = ""

    let currentDateStr = ""
    let todayStart: Date
    let todayEnd: Date
    let weekEnd: Date

    if (clientDate) {
      // Use client's date information (most accurate)
      currentDateStr = clientDate.dateString
      todayStart = new Date(clientDate.year, clientDate.month - 1, clientDate.day, 0, 0, 0)
      todayEnd = new Date(clientDate.year, clientDate.month - 1, clientDate.day, 23, 59, 59)
      weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000)

      console.log("[v0] AI Chat - Using client date:", currentDateStr)
      console.log(
        "[v0] AI Chat - Today:",
        `${clientDate.year}-${clientDate.month}-${clientDate.day}`,
        clientDate.weekday,
      )
    } else {
      // Fallback to server-side calculation
      const now = new Date()
      const userDateStr = now.toLocaleDateString("en-CA", { timeZone: timezone })
      const [year, month, day] = userDateStr.split("-").map(Number)

      todayStart = new Date(year, month - 1, day, 0, 0, 0)
      todayEnd = new Date(year, month - 1, day, 23, 59, 59)
      weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000)

      currentDateStr = now.toLocaleDateString(
        language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
          timeZone: timezone,
        },
      )

      console.log("[v0] AI Chat - Using server calculated date:", currentDateStr)
    }

    const contextLabels = {
      ko: {
        schedules: "사용자의 일정:",
        thisWeek: "이번 주 일정:",
        notes: "최근 노트:",
        vehicles: "차량 정보:",
        maintenance: "차량 정비 내역:",
        todos: "할 일 목록:",
        radio: "즐겨찾는 라디오 방송국:",
        health: "최근 건강 기록:",
        diary: "최근 일기:",
        travel: "여행 기록:",
        businessCards: "명함:",
        budget: "최근 예산 거래:",
        medications: "복용 중인 약:",
        medicalContacts: "의료 연락처:",
      },
      en: {
        schedules: "User's schedules:",
        thisWeek: "This week's schedules:",
        notes: "Recent notes:",
        vehicles: "Vehicle information:",
        maintenance: "Vehicle maintenance history:",
        todos: "To-do list:",
        radio: "Favorite radio stations:",
        health: "Recent health records:",
        diary: "Recent diary entries:",
        travel: "Travel records:",
        businessCards: "Business cards:",
        budget: "Recent budget transactions:",
        medications: "Current medications:",
        medicalContacts: "Medical contacts:",
      },
      zh: {
        schedules: "用户日程:",
        thisWeek: "本周日程:",
        notes: "最近笔记:",
        vehicles: "车辆信息:",
        maintenance: "车辆维护记录:",
        todos: "待办事项:",
        radio: "收藏的广播电台:",
        health: "最近健康记录:",
        diary: "最近日记:",
        travel: "旅行记录:",
        businessCards: "名片:",
        budget: "最近的预算交易:",
        medications: "当前用药:",
        medicalContacts: "医疗联系人:",
      },
      ja: {
        schedules: "ユーザーのスケジュール:",
        thisWeek: "今週のスケジュール:",
        notes: "最近のノート:",
        vehicles: "車両情報:",
        maintenance: "車両メンテナンス履歴:",
        todos: "やることリスト:",
        radio: "お気に入りのラジオ局:",
        health: "最近の健康記録:",
        diary: "最近の日記:",
        travel: "旅行記録:",
        businessCards: "名刺:",
        budget: "最近の予算取引:",
        medications: "現在の薬:",
        medicalContacts: "医療連絡先:",
      },
    }

    const labels = contextLabels[language as keyof typeof contextLabels] || contextLabels.ko

    if (userId) {
      const [
        { data: schedules },
        { data: notes },
        { data: vehicles },
        { data: vehicleMaintenance },
        { data: todoItems },
        { data: radioStations },
        { data: healthRecords },
        { data: diaryEntries },
        { data: travelRecords },
        { data: businessCards },
        { data: budgetTransactions },
        { data: medications },
        { data: medicalContacts },
      ] = await Promise.all([
        supabase
          .from("schedules")
          .select("*")
          .eq("user_id", userId)
          .eq("completed", false)
          .order("start_time", { ascending: true })
          .limit(20),
        supabase.from("notes").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("vehicles").select("*").eq("user_id", userId).limit(5),
        supabase
          .from("vehicle_maintenance")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .limit(10),
        supabase
          .from("todo_items")
          .select("*")
          .eq("user_id", userId)
          .eq("completed", false)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("radio_stations").select("*").eq("user_id", userId).eq("is_favorite", true).limit(5),
        supabase
          .from("health_records")
          .select("*")
          .eq("user_id", userId)
          .order("recorded_at", { ascending: false })
          .limit(5),
        supabase
          .from("diary_entries")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("travel_records")
          .select("*")
          .eq("user_id", userId)
          .order("start_date", { ascending: false })
          .limit(5),
        supabase.from("business_cards").select("*").eq("user_id", userId).limit(10),
        supabase
          .from("budget_transactions")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .limit(10),
        supabase.from("medications").select("*").eq("user_id", userId).limit(5),
        supabase.from("medical_contacts").select("*").eq("user_id", userId).limit(5),
      ])

      if (schedules && schedules.length > 0) {
        const thisWeekSchedules = schedules.filter((s) => {
          const scheduleDate = new Date(s.start_time)
          const scheduleDateStr = scheduleDate.toLocaleDateString("en-CA", { timeZone: timezone })
          const scheduleDateTime = new Date(scheduleDateStr)

          return scheduleDateTime >= todayStart && scheduleDateTime <= weekEnd
        })

        userContext += `\n\n${labels.schedules}\n`
        schedules.forEach((s) => {
          const startTime = new Date(s.start_time)
          const dateStr = startTime.toLocaleDateString(
            language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
            { timeZone: timezone },
          )
          const timeStr = startTime.toLocaleTimeString(
            language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: timezone,
            },
          )
          userContext += `- ${dateStr} ${timeStr}: ${s.title}${s.description ? ` (${s.description})` : ""}\n`
        })

        if (thisWeekSchedules.length > 0) {
          userContext += `\n${labels.thisWeek}\n`
          thisWeekSchedules.forEach((s) => {
            const startTime = new Date(s.start_time)
            const dateStr = startTime.toLocaleDateString(
              language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
              { timeZone: timezone },
            )
            const timeStr = startTime.toLocaleTimeString(
              language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: timezone,
              },
            )
            userContext += `- ${dateStr} ${timeStr}: ${s.title}\n`
          })
        }
      }

      if (notes && notes.length > 0) {
        userContext += `\n\n${labels.notes}\n`
        userContext += `총 ${notes.length}개의 노트가 있습니다.\n`
        notes.forEach((n) => {
          userContext += `- ${n.title}: ${n.content.substring(0, 100)}...\n`
        })
      }

      if (vehicles && vehicles.length > 0) {
        userContext += `\n\n${labels.vehicles}\n`
        vehicles.forEach((v) => {
          userContext += `- ${v.name || "Vehicle"}: ${v.model || ""} (${v.year || ""})\n`
        })
      }

      if (vehicleMaintenance && vehicleMaintenance.length > 0) {
        userContext += `\n\n${labels.maintenance}\n`
        vehicleMaintenance.forEach((m) => {
          const dateStr = new Date(m.date).toLocaleDateString(
            language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
            { timeZone: timezone },
          )
          userContext += `- ${dateStr}: ${m.type} - ${m.description || ""} (${m.cost || 0}원, ${m.mileage || 0}km)\n`
        })
      }

      if (todoItems && todoItems.length > 0) {
        userContext += `\n\n${labels.todos}\n`
        todoItems.forEach((t) => {
          const dueDate = t.due_date
            ? new Date(t.due_date).toLocaleDateString(
                language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
                { timeZone: timezone },
              )
            : ""
          userContext += `- ${t.title}${dueDate ? ` (${dueDate})` : ""}${t.description ? `: ${t.description}` : ""}\n`
        })
      }

      if (radioStations && radioStations.length > 0) {
        userContext += `\n\n${labels.radio}\n`
        radioStations.forEach((r) => {
          userContext += `- ${r.name}${r.genre ? ` (${r.genre})` : ""}\n`
        })
      }

      if (healthRecords && healthRecords.length > 0) {
        userContext += `\n\n${labels.health}\n`
        healthRecords.forEach((h) => {
          const dateStr = new Date(h.recorded_at).toLocaleDateString(
            language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
            { timeZone: timezone },
          )
          let record = `- ${dateStr}: `
          if (h.type === "blood_pressure") {
            record += `혈압 ${h.blood_pressure_systolic}/${h.blood_pressure_diastolic}`
          } else if (h.type === "weight") {
            record += `체중 ${h.weight}kg`
          } else if (h.type === "blood_sugar") {
            record += `혈당 ${h.blood_sugar}mg/dL`
          } else if (h.type === "temperature") {
            record += `체온 ${h.temperature}°C`
          }
          userContext += record + "\n"
        })
      }

      if (diaryEntries && diaryEntries.length > 0) {
        userContext += `\n\n${labels.diary}\n`
        diaryEntries.forEach((d) => {
          const dateStr = new Date(d.created_at).toLocaleDateString(
            language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
            { timeZone: timezone },
          )
          userContext += `- ${dateStr}: ${d.title || ""}${d.mood ? ` (${d.mood})` : ""} - ${d.content.substring(0, 100)}...\n`
        })
      }

      if (travelRecords && travelRecords.length > 0) {
        userContext += `\n\n${labels.travel}\n`
        travelRecords.forEach((t) => {
          const startDate = new Date(t.start_date).toLocaleDateString(
            language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
            { timeZone: timezone },
          )
          const endDate = t.end_date
            ? new Date(t.end_date).toLocaleDateString(
                language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
                { timeZone: timezone },
              )
            : ""
          userContext += `- ${t.destination}: ${startDate}${endDate ? ` ~ ${endDate}` : ""}${t.expense ? ` (${t.expense}원)` : ""}\n`
        })
      }

      if (businessCards && businessCards.length > 0) {
        userContext += `\n\n${labels.businessCards}\n`
        businessCards.forEach((b) => {
          userContext += `- ${b.name}${b.company ? ` (${b.company})` : ""}${b.position ? ` - ${b.position}` : ""}${b.phone ? ` - ${b.phone}` : ""}\n`
        })
      }

      if (budgetTransactions && budgetTransactions.length > 0) {
        userContext += `\n\n${labels.budget}\n`
        budgetTransactions.slice(0, 5).forEach((b) => {
          const dateStr = new Date(b.date).toLocaleDateString(
            language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
            { timeZone: timezone },
          )
          userContext += `- ${dateStr}: ${b.description || ""} ${b.type === "income" ? "+" : "-"}${b.amount}원 (${b.category || ""})\n`
        })
      }

      if (medications && medications.length > 0) {
        userContext += `\n\n${labels.medications}\n`
        medications.forEach((m) => {
          userContext += `- ${m.name}: ${m.dosage || ""}${m.frequency ? ` - ${m.frequency}` : ""}\n`
        })
      }

      if (medicalContacts && medicalContacts.length > 0) {
        userContext += `\n\n${labels.medicalContacts}\n`
        medicalContacts.forEach((m) => {
          userContext += `- ${m.name}${m.type ? ` (${m.type})` : ""}${m.phone ? ` - ${m.phone}` : ""}\n`
        })
      }
    }

    const timezoneInfo =
      language === "ko"
        ? `(현지 시간: ${timezone})`
        : language === "en"
          ? `(Local time: ${timezone})`
          : language === "zh"
            ? `(当地时间：${timezone})`
            : `(現地時間：${timezone})`

    const systemPrompt =
      language === "ko"
        ? `당신은 친절한 AI 비서입니다. 사용자의 일정, 노트, 차량 관리, 할일, 건강 기록 등을 도와주는 개인 비서 역할을 합니다. 간결하고 명확하게 답변하세요. 반드시 한국어로 답변하세요.\n\n현재 날짜: ${currentDateStr} ${timezoneInfo}\n${userContext}`
        : language === "en"
          ? `You are a friendly AI assistant. You help users manage their schedules, notes, vehicle maintenance, todos, health records, and more. Provide concise and clear responses. IMPORTANT: Always respond in English only.\n\nCurrent date: ${currentDateStr} ${timezoneInfo}\n${userContext}`
          : language === "zh"
            ? `您是一位友好的AI助手。您帮助用户管理日程、笔记、车辆维护、待办事项、健康记录等。请提供简洁明了的回答。重要：请仅用中文回答。\n\n当前日期：${currentDateStr} ${timezoneInfo}\n${userContext}`
            : `あなたは親切なAIアシスタントです。ユーザーのスケジュール、ノート、車両管理、やること、健康記録などをサポートします。簡潔で明確な回答を提供してください。重要：必ず日本語で回答してください。\n\n現在の日付：${currentDateStr} ${timezoneInfo}\n${userContext}`

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
