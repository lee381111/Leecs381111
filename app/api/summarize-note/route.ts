import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { content, language } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const languageInstructions = {
      ko: "한국어로 답변해주세요.",
      en: "Please respond in English.",
      zh: "请用中文回答。",
      ja: "日本語で回答してください。",
    }

    const prompts = {
      ko: `다음 노트 내용을 간결하게 요약해주세요. 핵심 내용만 3-5개의 문장으로 정리해주세요.

노트 내용:
${content}

요약:`,
      en: `Please summarize the following note content concisely. Organize the key points in 3-5 sentences.

Note content:
${content}

Summary:`,
      zh: `请简洁地总结以下笔记内容。用3-5句话整理关键内容。

笔记内容：
${content}

摘要：`,
      ja: `次のノート内容を簡潔に要約してください。要点を3〜5文で整理してください。

ノート内容：
${content}

要約：`,
    }

    const prompt = prompts[language as keyof typeof prompts] || prompts.ko
    const instruction = languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.ko

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `${instruction}\n\n${prompt}`,
      maxTokens: 500,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("[v0] Error summarizing note:", error)
    return NextResponse.json({ error: "Failed to summarize note" }, { status: 500 })
  }
}
