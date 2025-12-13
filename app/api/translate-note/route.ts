import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { content, sourceLanguage, targetLanguage } = await req.json()

    if (!content) {
      return Response.json({ error: "Content is required" }, { status: 400 })
    }

    const languageNames = {
      ko: "Korean (한국어)",
      en: "English",
      zh: "Chinese (中文)",
      ja: "Japanese (日本語)",
    }

    const sourceLanguageName = languageNames[sourceLanguage as keyof typeof languageNames] || "the source language"
    const targetLanguageName = languageNames[targetLanguage as keyof typeof languageNames] || "the target language"

    const prompt = `You are a professional translator. Translate the following text from ${sourceLanguageName} to ${targetLanguageName}.

Instructions:
- Maintain the original meaning and tone
- Keep formatting (line breaks, bullet points, etc.)
- For technical terms, use appropriate terminology
- For news articles or formal text, maintain professional style
- For casual text, use natural conversational style

Original text:
${content}

Please provide ONLY the translated text without any explanations or additional comments.`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      maxOutputTokens: 3000,
    })

    return Response.json({ translatedContent: text })
  } catch (error) {
    console.error("AI translation error:", error)
    return Response.json({ error: "Failed to translate note" }, { status: 500 })
  }
}
