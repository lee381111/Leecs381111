import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { text, sourceLang } = await request.json()

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the given text from ${sourceLang} to English, Chinese (Simplified), and Japanese. 
          
Return ONLY a valid JSON object with this exact format:
{
  "en": "English translation",
  "zh": "Chinese translation",
  "ja": "Japanese translation"
}

Do not include any other text or explanation.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 500,
    })

    const result = completion.choices[0]?.message?.content || ""
    const translations = JSON.parse(result)

    return NextResponse.json({ translations })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
