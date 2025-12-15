import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: prompt,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in /api/generate-text:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}
