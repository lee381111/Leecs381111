import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { transactions, month, language = "ko" } = await request.json()

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ error: "No transactions provided" }, { status: 400 })
    }

    // 거래 데이터 요약
    const totalExpense = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + t.amount, 0)
    const totalIncome = transactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    // 카테고리별 지출 계산
    const expenseByCategory: Record<string, number> = {}
    transactions
      .filter((t: any) => t.type === "expense")
      .forEach((t: any) => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount
      })

    const categoryBreakdown = Object.entries(expenseByCategory)
      .sort(([, a], [, b]) => b - a)
      .map(
        ([category, amount]) =>
          `${category}: ${amount.toLocaleString()}원 (${((amount / totalExpense) * 100).toFixed(1)}%)`,
      )
      .join("\n")

    const languageInstruction =
      {
        ko: "반드시 한국어로 응답해주세요.",
        en: "Please respond in English.",
        zh: "请用中文回答。",
        ja: "日本語で回答してください。",
      }[language] || "반드시 한국어로 응답해주세요."

    const prompt = `당신은 재정 전문가입니다. 다음 ${month} 가계부 데이터를 분석하고 절약 팁을 제공해주세요.
${languageInstruction}

**수입**: ${totalIncome.toLocaleString()}원
**지출**: ${totalExpense.toLocaleString()}원
**잔액**: ${(totalIncome - totalExpense).toLocaleString()}원

**카테고리별 지출**:
${categoryBreakdown}

중요: 위의 카테고리별 지출 데이터를 정확히 확인하고, 실제로 가장 많은 금액이 지출된 카테고리를 highestCategory로 응답하세요.

다음 형식으로 JSON 응답해주세요:
{
  "summary": "전체적인 지출 패턴 요약 (1-2문장, ${language === "ko" ? "한국어" : language === "en" ? "English" : language === "zh" ? "中文" : "日本語"})",
  "highestCategory": "실제로 가장 많이 지출한 카테고리 이름",
  "savingTips": [
    "구체적인 절약 팁 1 (${language === "ko" ? "한국어" : language === "en" ? "English" : language === "zh" ? "中文" : "日本語"})",
    "구체적인 절약 팁 2",
    "구체적인 절약 팁 3"
  ],
  "monthlyGoal": "다음 달 목표 (구체적인 금액 포함, ${language === "ko" ? "한국어" : language === "en" ? "English" : language === "zh" ? "中文" : "日本語"})"
}

반드시 JSON 형식으로만 응답하고, 마크다운이나 다른 텍스트를 포함하지 마세요.
${languageInstruction}`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      maxTokens: 1000,
    })

    // JSON 파싱
    let analysis
    try {
      // 마크다운 코드 블록 제거
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      analysis = JSON.parse(cleanedText)
    } catch (e) {
      console.error("Failed to parse AI response:", text)
      return NextResponse.json(
        {
          error: "Failed to parse analysis",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Budget analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze budget",
      },
      { status: 500 },
    )
  }
}
