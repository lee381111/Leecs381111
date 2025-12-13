import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { content, language } = await request.json()

    if (!content) {
      return Response.json({ error: "Content is required" }, { status: 400 })
    }

    const languagePrompts = {
      ko: "다음 노트 내용을 3-5문장으로 간결하게 요약해주세요. 핵심 내용만 포함하세요:",
      en: "Please summarize the following note content in 3-5 sentences. Include only the key points:",
      zh: "请用3-5句话简洁地总结以下笔记内容。只包括关键点：",
      ja: "次のノート内容を3〜5文で簡潔に要約してください。重要なポイントのみを含めてください：",
    }

    const prompt = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `${prompt}\n\n${content}`,
    })

    return Response.json({ summary: text })
  } catch (error: any) {
    console.error("[v0] Error summarizing note:", error)
    return Response.json({ error: error.message || "Failed to summarize note" }, { status: 500 })
  }
}
