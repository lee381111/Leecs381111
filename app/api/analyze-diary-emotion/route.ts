import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { content, language } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const prompts = {
      ko: `다음은 사용자의 일기 내용입니다. 일기를 분석하여 감정 상태와 조언을 제공해주세요.

일기 내용:
${content}

다음 형식으로 응답해주세요:
1. 감정 상태: (긍정적/부정적/중립 중 하나와 구체적인 감정 설명)
2. 감정 점수: (1-10점, 10점이 가장 긍정적)
3. 주요 감정: (기쁨, 슬픔, 분노, 불안, 평온 등)
4. 조언: (따뜻하고 공감하는 조언 2-3문장)

친근하고 따뜻한 말투로 작성해주세요.`,
      en: `Here is the user's diary entry. Please analyze it and provide emotional insights and advice.

Diary content:
${content}

Please respond in the following format:
1. Emotional State: (Positive/Negative/Neutral with specific description)
2. Emotion Score: (1-10, where 10 is most positive)
3. Main Emotions: (Joy, Sadness, Anger, Anxiety, Calm, etc.)
4. Advice: (Warm and empathetic advice in 2-3 sentences)

Please use a friendly and warm tone.`,
      zh: `以下是用户的日记内容。请分析并提供情绪见解和建议。

日记内容：
${content}

请按以下格式回复：
1. 情绪状态：（积极/消极/中立及具体描述）
2. 情绪评分：（1-10分，10分最积极）
3. 主要情绪：（喜悦、悲伤、愤怒、焦虑、平静等）
4. 建议：（温暖且有同理心的建议2-3句）

请使用友好温暖的语气。`,
      ja: `以下はユーザーの日記です。分析して感情の洞察とアドバイスを提供してください。

日記内容：
${content}

以下の形式で回答してください：
1. 感情状態：（ポジティブ/ネガティブ/中立と具体的な説明）
2. 感情スコア：（1-10点、10点が最もポジティブ）
3. 主な感情：（喜び、悲しみ、怒り、不安、穏やか など）
4. アドバイス：（温かく共感的なアドバイス2-3文）

親しみやすく温かい口調で書いてください。`,
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: prompts[language as keyof typeof prompts] || prompts.ko,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing diary emotion:", error)
    return NextResponse.json({ error: "Failed to analyze emotion" }, { status: 500 })
  }
}
