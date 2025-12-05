import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { content, language } = await req.json()

    if (!content || content.trim().length < 20) {
      return Response.json({ error: "Content too short for analysis" }, { status: 400 })
    }

    const prompts = {
      ko: `다음 일기 내용을 분석하여 JSON 형식으로 답변해주세요:
{
  "emotion": "긍정적|부정적|중립",
  "score": 1~10 사이의 감정 강도,
  "mainEmotions": ["행복", "기쁨"] 형식으로 주요 감정 2-3개,
  "advice": "따뜻한 조언 2-3문장"
}

일기 내용:
${content}`,
      en: `Analyze the following diary entry and respond in JSON format:
{
  "emotion": "positive|negative|neutral",
  "score": emotional intensity between 1-10,
  "mainEmotions": ["happiness", "joy"] main emotions 2-3 items,
  "advice": "warm advice 2-3 sentences"
}

Diary content:
${content}`,
      zh: `分析以下日记内容并以JSON格式回答：
{
  "emotion": "积极|消极|中立",
  "score": 1-10之间的情感强度,
  "mainEmotions": ["快乐", "喜悦"] 主要情感2-3项,
  "advice": "温暖的建议2-3句"
}

日记内容：
${content}`,
      ja: `次の日記の内容を分析してJSON形式で回答してください：
{
  "emotion": "ポジティブ|ネガティブ|中立",
  "score": 1~10の感情強度,
  "mainEmotions": ["幸せ", "喜び"] 主な感情2-3個,
  "advice": "温かいアドバイス2-3文"
}

日記内容：
${content}`,
    }

    const prompt = prompts[language as keyof typeof prompts] || prompts.ko

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      maxOutputTokens: 1000,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0])
      return Response.json(analysis)
    }

    return Response.json({
      emotion: "중립",
      score: 5,
      mainEmotions: ["평온"],
      advice: "일기를 작성해주셔서 감사합니다.",
    })
  } catch (error) {
    console.error("AI emotion analysis error:", error)
    return Response.json({ error: "Failed to analyze emotion" }, { status: 500 })
  }
}
