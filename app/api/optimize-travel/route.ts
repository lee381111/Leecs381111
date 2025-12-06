import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { destination, startDate, endDate, budget, style, language = "ko" } = await request.json()

    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 여행 기간 계산
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const languageInstruction =
      {
        ko: "반드시 한국어로 응답해주세요.",
        en: "Please respond in English.",
        zh: "请用中文回答。",
        ja: "日本語で回答してください。",
      }[language] || "반드시 한국어로 응답해주세요."

    const styleText = style
      ? {
          ko: `여행 스타일: ${style}`,
          en: `Travel style: ${style}`,
          zh: `旅行风格: ${style}`,
          ja: `旅行スタイル: ${style}`,
        }[language]
      : ""

    const budgetText = budget
      ? {
          ko: `예산: ${Number(budget).toLocaleString()}원`,
          en: `Budget: ${Number(budget).toLocaleString()} KRW`,
          zh: `预算: ${Number(budget).toLocaleString()}韩元`,
          ja: `予算: ${Number(budget).toLocaleString()}ウォン`,
        }[language]
      : ""

    const prompts = {
      ko: `당신은 여행 전문가입니다. 다음 정보를 바탕으로 최적의 여행 일정을 제안해주세요.
${languageInstruction}

**목적지**: ${destination}
**여행 기간**: ${startDate} ~ ${endDate} (${days}일)
${budgetText}
${styleText}

다음 형식으로 JSON 응답해주세요:
{
  "summary": "여행 전체 요약 (1-2문장)",
  "dailyPlan": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "1일차 제목",
      "activities": [
        "오전 9:00 - 관광지 1 방문",
        "오후 12:00 - 현지 맛집에서 점심",
        "오후 2:00 - 관광지 2 방문",
        "오후 6:00 - 저녁 식사 및 휴식"
      ]
    }
  ],
  "recommendations": {
    "restaurants": ["추천 맛집 1", "추천 맛집 2", "추천 맛집 3"],
    "attractions": ["추천 관광지 1", "추천 관광지 2", "추천 관광지 3"],
    "tips": ["여행 팁 1", "여행 팁 2", "여행 팁 3"]
  },
  "budgetBreakdown": {
    "accommodation": 예상 숙박비,
    "food": 예상 식비,
    "transportation": 예상 교통비,
    "activities": 예상 관광비,
    "total": 총 예상 비용
  }
}`,
      en: `You are a travel expert. Please suggest an optimal travel itinerary based on the following information.
${languageInstruction}

**Destination**: ${destination}
**Travel period**: ${startDate} ~ ${endDate} (${days} days)
${budgetText}
${styleText}

Please respond in JSON format:
{
  "summary": "Overall trip summary (1-2 sentences)",
  "dailyPlan": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Day 1 Title",
      "activities": [
        "9:00 AM - Visit attraction 1",
        "12:00 PM - Lunch at local restaurant",
        "2:00 PM - Visit attraction 2",
        "6:00 PM - Dinner and rest"
      ]
    }
  ],
  "recommendations": {
    "restaurants": ["Recommended restaurant 1", "Recommended restaurant 2", "Recommended restaurant 3"],
    "attractions": ["Recommended attraction 1", "Recommended attraction 2", "Recommended attraction 3"],
    "tips": ["Travel tip 1", "Travel tip 2", "Travel tip 3"]
  },
  "budgetBreakdown": {
    "accommodation": estimated accommodation cost,
    "food": estimated food cost,
    "transportation": estimated transportation cost,
    "activities": estimated activity cost,
    "total": total estimated cost
  }
}`,
      zh: `您是旅行专家。请根据以下信息建议最佳旅行行程。
${languageInstruction}

**目的地**: ${destination}
**旅行期间**: ${startDate} ~ ${endDate} (${days}天)
${budgetText}
${styleText}

请以JSON格式回答：
{
  "summary": "整体行程摘要（1-2句话）",
  "dailyPlan": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "第1天标题",
      "activities": [
        "上午9:00 - 参观景点1",
        "下午12:00 - 在当地餐厅用午餐",
        "下午2:00 - 参观景点2",
        "下午6:00 - 晚餐和休息"
      ]
    }
  ],
  "recommendations": {
    "restaurants": ["推荐餐厅1", "推荐餐厅2", "推荐餐厅3"],
    "attractions": ["推荐景点1", "推荐景点2", "推荐景点3"],
    "tips": ["旅行贴士1", "旅行贴士2", "旅行贴士3"]
  },
  "budgetBreakdown": {
    "accommodation": 预计住宿费,
    "food": 预计餐费,
    "transportation": 预计交通费,
    "activities": 预计观光费,
    "total": 预计总费用
  }
}`,
      ja: `あなたは旅行の専門家です。以下の情報に基づいて最適な旅行日程を提案してください。
${languageInstruction}

**目的地**: ${destination}
**旅行期間**: ${startDate} ~ ${endDate} (${days}日)
${budgetText}
${styleText}

以下の形式でJSON回答してください：
{
  "summary": "旅行全体の要約（1-2文）",
  "dailyPlan": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "1日目のタイトル",
      "activities": [
        "午前9:00 - 観光地1訪問",
        "午後12:00 - 現地レストランでランチ",
        "午後2:00 - 観光地2訪問",
        "午後6:00 - 夕食と休憩"
      ]
    }
  ],
  "recommendations": {
    "restaurants": ["おすすめレストラン1", "おすすめレストラン2", "おすすめレストラン3"],
    "attractions": ["おすすめ観光地1", "おすすめ観光地2", "おすすめ観光地3"],
    "tips": ["旅行のヒント1", "旅行のヒント2", "旅行のヒント3"]
  },
  "budgetBreakdown": {
    "accommodation": 予想宿泊費,
    "food": 予想食費,
    "transportation": 予想交通費,
    "activities": 予想観光費,
    "total": 予想総費用
  }
}`,
    }

    const prompt = prompts[language as keyof typeof prompts] || prompts.ko

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      maxTokens: 2000,
    })

    // JSON 파싱
    let itinerary
    try {
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      itinerary = JSON.parse(cleanedText)
    } catch (e) {
      console.error("Failed to parse AI response:", text)
      return NextResponse.json(
        {
          error: "Failed to parse itinerary",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ itinerary })
  } catch (error) {
    console.error("Travel optimization error:", error)
    return NextResponse.json(
      {
        error: "Failed to optimize travel",
      },
      { status: 500 },
    )
  }
}
