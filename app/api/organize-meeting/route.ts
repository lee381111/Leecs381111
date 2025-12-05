import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { content, language } = await req.json()

    if (!content) {
      return Response.json({ error: "Content is required" }, { status: 400 })
    }

    const prompts = {
      ko: `다음 회의록을 전문적으로 정리해주세요:

1. 주요 안건 요약
2. 결정 사항
3. 액션 아이템 (담당자와 기한 포함)
4. 다음 회의 일정

회의록 내용:
${content}`,
      en: `Please professionally organize the following meeting notes:

1. Key agenda summary
2. Decisions made
3. Action items (with assignees and deadlines)
4. Next meeting schedule

Meeting notes:
${content}`,
      zh: `请专业地整理以下会议记录：

1. 主要议程摘要
2. 决定事项
3. 行动项目（包括负责人和截止日期）
4. 下次会议安排

会议记录：
${content}`,
      ja: `次の議事録を専門的に整理してください：

1. 主要議題の要約
2. 決定事項
3. アクションアイテム（担当者と期限を含む）
4. 次回会議の予定

議事録：
${content}`,
    }

    const prompt = prompts[language as keyof typeof prompts] || prompts.en

    const { text } = await generateText({
      model: "groq/mixtral-8x7b-32768",
      prompt,
      maxOutputTokens: 2000,
    })

    return Response.json({ organizedContent: text })
  } catch (error) {
    console.error("AI meeting organization error:", error)
    return Response.json({ error: "Failed to organize meeting notes" }, { status: 500 })
  }
}
