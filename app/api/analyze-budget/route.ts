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

    const prompts = {
      ko: `당신은 재정 전문가입니다. 다음 ${month}의 가계부 데이터를 분석하고 절약 팁을 제공해주세요.
${languageInstruction}

**이번 달 수입**: ${totalIncome.toLocaleString()}원
**이번 달 지출**: ${totalExpense.toLocaleString()}원
**이번 달 잔액**: ${(totalIncome - totalExpense).toLocaleString()}원

**이번 달 카테고리별 지출**:
${categoryBreakdown}

중요: 위의 카테고리별 지출 데이터를 정확히 확인하고, ${month}에 실제로 가장 많은 금액이 지출된 카테고리를 highestCategory로 응답하세요.

다음 형식으로 JSON 응답해주세요:
{
  "summary": "${month}의 지출 패턴 요약 (1-2문장)",
  "highestCategory": "${month}에 실제로 가장 많이 지출한 카테고리 이름",
  "savingTips": [
    "구체적인 절약 팁 1",
    "구체적인 절약 팁 2",
    "구체적인 절약 팁 3"
  ],
  "monthlyGoal": "다음 달 목표 (구체적인 금액 포함)"
}`,
      en: `You are a financial expert. Please analyze the following household budget data for ${month} and provide money-saving tips.
${languageInstruction}

**This month's income**: ${totalIncome.toLocaleString()} KRW
**This month's expenses**: ${totalExpense.toLocaleString()} KRW
**This month's balance**: ${(totalIncome - totalExpense).toLocaleString()} KRW

**Expenses by category this month**:
${categoryBreakdown}

Important: Carefully review the expense data by category above and identify the category with the highest spending in ${month} for highestCategory.

Please respond in JSON format:
{
  "summary": "Summary of spending patterns for ${month} (1-2 sentences)",
  "highestCategory": "Name of the category with the highest actual spending in ${month}",
  "savingTips": [
    "Specific saving tip 1",
    "Specific saving tip 2",
    "Specific saving tip 3"
  ],
  "monthlyGoal": "Next month's goal (include specific amounts)"
}`,
      zh: `您是一位财务专家。请分析以下${month}的家庭预算数据并提供省钱建议。
${languageInstruction}

**本月收入**: ${totalIncome.toLocaleString()}韩元
**本月支出**: ${totalExpense.toLocaleString()}韩元
**本月余额**: ${(totalIncome - totalExpense).toLocaleString()}韩元

**本月各类别支出**:
${categoryBreakdown}

重要提示：请仔细查看上述各类别支出数据，并在highestCategory中回答${month}实际支出最多的类别。

请以JSON格式回答：
{
  "summary": "${month}的支出模式摘要（1-2句话）",
  "highestCategory": "${month}实际支出最多的类别名称",
  "savingTips": [
    "具体省钱建议1",
    "具体省钱建议2",
    "具体省钱建议3"
  ],
  "monthlyGoal": "下个月目标（包含具体金额）"
}`,
      ja: `あなたは財務の専門家です。以下の${month}の家計簿データを分析し、節約のヒントを提供してください。
${languageInstruction}

**今月の収入**: ${totalIncome.toLocaleString()}ウォン
**今月の支出**: ${totalExpense.toLocaleString()}ウォン
**今月の残高**: ${(totalIncome - totalExpense).toLocaleString()}ウォン

**今月のカテゴリー別支出**:
${categoryBreakdown}

重要：上記のカテゴリー別支出データを正確に確認し、${month}に実際に最も多く支出されたカテゴリーをhighestCategoryで回答してください。

以下の形式でJSON回答してください：
{
  "summary": "${month}の支出パターンの要約（1-2文）",
  "highestCategory": "${month}に実際に最も多く支出されたカテゴリー名",
  "savingTips": [
    "具体的な節約のヒント1",
    "具体的な節約のヒント2",
    "具体的な節約のヒント3"
  ],
  "monthlyGoal": "来月の目標（具体的な金額を含む）"
}`,
    }

    const prompt = prompts[language as keyof typeof prompts] || prompts.ko

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
