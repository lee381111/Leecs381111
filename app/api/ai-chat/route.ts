import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { message, language, userId, timezone = "Asia/Seoul", clientDate, preventiveSchedules } = await request.json()

    console.log("[v0] AI Chat - Received timezone:", timezone)
    console.log("[v0] AI Chat - Received clientDate:", clientDate)
    console.log("[v0] AI Chat - Received preventive schedules:", preventiveSchedules?.length || 0)

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
        preventiveMaintenance: "예방 정비 일정:",
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
        preventiveMaintenance: "Vehicle preventive maintenance schedule:",
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
        preventiveMaintenance: "车辆预防性维护计划:",
      },
      ja: {
        schedules: "ユーザーのスケジュール:",
        thisWeek: "今週のスケジュール:",
        notes: "最近のノート:",
        vehicles: "車両情報:",
        maintenance: "車両メンテナンス履歴：",
        todos: "やることリスト:",
        radio: "お気に入りのラジオ局:",
        health: "最近の健康記録:",
        diary: "最近の日記:",
        travel: "旅行記録：",
        businessCards: "名刺：",
        budget: "最近の予算取引：",
        medications: "現在の薬：",
        medicalContacts: "医療連絡先：",
        preventiveMaintenance: "車両予防メンテナンススケジュール：",
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
        const vehicleSchedules = schedules.filter(
          (s) =>
            s.category === "차량" ||
            s.category === "정비" ||
            s.title.includes("정비") ||
            s.title.includes("차량") ||
            s.title.includes("점검") ||
            s.description?.includes("정비") ||
            s.description?.includes("차량"),
        )

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
          userContext += `- ${dateStr} ${timeStr}: ${s.title}${s.description ? ` (${s.description})` : ""}${s.category ? ` [${s.category}]` : ""}\n`
        })

        if (vehicleSchedules.length > 0) {
          userContext += `\n차량 예방 정비 일정:\n`
          vehicleSchedules.forEach((s) => {
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
            userContext += `- ${dateStr} ${timeStr}: ${s.title}${s.description ? ` - ${s.description}` : ""}\n`
          })
        }

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
        console.log("[v0] AI Chat - Vehicle maintenance records found:", vehicleMaintenance.length)
        console.log("[v0] AI Chat - Vehicle maintenance data:", JSON.stringify(vehicleMaintenance, null, 2))

        userContext += `\n\n${labels.maintenance}\n`
        userContext += `총 ${vehicleMaintenance.length}개의 차량 정비 기록이 있습니다.\n`
        vehicleMaintenance.forEach((m) => {
          const dateStr = new Date(m.date).toLocaleDateString(
            language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
            { timeZone: timezone },
          )
          userContext += `- ${dateStr}: ${m.type} - ${m.description || "설명 없음"} (비용: ${m.cost || 0}원, 주행거리: ${m.mileage || 0}km)\n`
        })

        console.log(
          "[v0] AI Chat - Vehicle maintenance context:",
          userContext.split(labels.maintenance)[1]?.substring(0, 500),
        )
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

      if (preventiveSchedules && preventiveSchedules.length > 0) {
        console.log("[v0] AI Chat - Processing preventive schedules:", preventiveSchedules.length)

        const upcomingSchedules = preventiveSchedules.filter((s: any) => !s.isCompleted)
        const overdueSchedules = upcomingSchedules.filter((s: any) => {
          const scheduleDate = new Date(s.scheduledDate)
          return scheduleDate < todayStart
        })

        userContext += `\n\n${labels.preventiveMaintenance}\n`
        userContext += `총 ${preventiveSchedules.length}개의 예방 정비 일정이 있습니다 (${upcomingSchedules.length}개 진행 예정, ${overdueSchedules.length}개 지연됨).\n`

        preventiveSchedules.forEach((s: any) => {
          if (s.isCompleted) return

          const scheduleDate = new Date(s.scheduledDate)
          const dateStr = scheduleDate.toLocaleDateString(
            language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US",
            { timeZone: timezone },
          )

          const vehicle = vehicles?.find((v: any) => v.id === s.vehicleId)
          const vehicleName = vehicle?.name || "차량"

          const isOverdue = scheduleDate < todayStart ? " [지연]" : ""

          userContext += `- ${dateStr}: ${vehicleName} - ${s.type} 정비${isOverdue}\n`
          if (s.mileage) {
            userContext += `  예상 주행거리: ${s.mileage.toLocaleString()}km\n`
          }
          if (s.description) {
            userContext += `  설명: ${s.description}\n`
          }
          if (s.alarmEnabled) {
            userContext += `  알림 설정됨: ${s.alarmDaysBefore}일 전\n`
          }
        })

        console.log("[v0] AI Chat - Preventive schedules context added:", userContext.includes("예방 정비 일정"))
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
        ? `당신은 친절한 AI 비서입니다. 사용자의 일정, 노트, 차량 관리 및 정비, 할일, 건강 기록 등을 도와주는 개인 비서 역할을 합니다. 
          
**중요:** 차량 관련 질문에 대해:
- "차량 예방 정비 일정" 또는 "예방 정비 일정" = 앞으로 예정된 정비 일정 (예방 정비 일정 섹션)
- "차량 정비 내역/기록" = 과거에 완료된 정비 기록 (차량 정비 내역 섹션)
- 사용자가 "예방 정비 일정"을 물어보면 예방 정비 일정 섹션을 확인하세요.
- 사용자가 "정비 내역" 또는 "정비 기록"을 물어보면 차량 정비 내역 섹션을 확인하세요.

간결하고 명확하게 답변하세요. 반드시 한국어로 답변하세요.\n\n현재 날짜: ${currentDateStr} ${timezoneInfo}\n${userContext}`
        : language === "en"
          ? `You are a friendly AI assistant. You help users manage their schedules, notes, vehicle maintenance, todos, health records, and more. 
          
**Important:** For vehicle-related questions:
- "Vehicle preventive maintenance schedule" or "Preventive maintenance schedule" = Upcoming maintenance appointments (from preventive maintenance schedule section)
- "Vehicle maintenance history/records" = Past completed maintenance (from vehicle maintenance history section)
- If user asks about "preventive maintenance schedule", check preventive maintenance schedule section.
- If user asks about "maintenance history" or "service records", check vehicle maintenance history section.

Provide concise and clear responses. IMPORTANT: Always respond in English only.\n\nCurrent date: ${currentDateStr} ${timezoneInfo}\n${userContext}`
          : language === "zh"
            ? `您是一位友好的AI助手。您帮助用户管理日程、笔记、车辆维护、待办事项、健康记录等。

**重要：** 关于车辆相关问题：
- "车辆预防性维护计划"或"预防性维护计划" = 即将到来的维护预约（来自预防性维护计划部分）
- "车辆维护历史/记录" = 过去完成的维护（来自车辆维护历史部分）
- 如果用户询问"预防性维护计划"，请检查预防性维护计划部分。
- 如果用户询问"维护历史"或"服务记录"，请检查车辆维护历史部分。

请提供简洁明了的回答。重要：请仅用中文回答。\n\n当前日期：${currentDateStr} ${timezoneInfo}\n${userContext}`
            : `あなたは親切なAIアシスタントです。ユーザーのスケジュール、ノート、車両管理、やること、健康記録などをサポートします。

**重要：** 車両関連の質問について：
- "車両予防メンテナンススケジュール"または"予防メンテナンススケジュール" = 今後のメンテナンス予定（予防メンテナンススケジュールセクションから）
- "車両メンテナンス履歴/記録" = 過去に完了したメンテナンス（車両メンテナンス履歴セクションから）
- ユーザーが「予防メンテナンススケジュール」について尋ねた場合、予防メンテナンススケジュールセクションを確認してください。
- ユーザーが「メンテナンス履歴」または「サービス記録」について尋ねた場合、車両メンテナンス履歴セクションを確認してください。

簡潔で明確な回答を提供してください。重要：必ず日本語で回答してください。\n\n現在の日付：${currentDateStr} ${timezoneInfo}\n${userContext}`

    console.log("[v0] AI Chat - System prompt (first 1000 chars):", systemPrompt.substring(0, 1000))
    console.log("[v0] AI Chat - User context length:", userContext.length)

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
