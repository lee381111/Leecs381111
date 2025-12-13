import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { ocrText } = await request.json()

    if (!ocrText) {
      return Response.json({ error: "No OCR text provided" }, { status: 400 })
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY!,
    })

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are an expert at organizing business card information. I have extracted the following text from a business card using OCR. Please organize it into a structured JSON format.

OCR Text:
${ocrText}

Organize this into the following JSON format:
{
  "name": "full name of the person",
  "company": "company name",
  "position": "job title or position",
  "phone": "phone number (keep original format with dashes/spaces)",
  "email": "email address",
  "address": "full address if available",
  "notes": "any additional information like website, fax, social media"
}

Rules:
- Extract information accurately from the OCR text
- If a field cannot be determined, use empty string ""
- Preserve original formatting for phone numbers
- Handle Korean, English, Chinese, and Japanese text
- Return ONLY valid JSON, no other text

JSON:`,
    })

    let extractedData
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0])
      } else {
        extractedData = JSON.parse(text)
      }
    } catch (e) {
      console.error("[v0] Failed to parse AI response:", text)
      return Response.json({ error: "Failed to extract card information" }, { status: 500 })
    }

    return Response.json({ data: extractedData })
  } catch (error: any) {
    console.error("[v0] Business card extraction error:", error)
    return Response.json({ error: error.message || "Failed to extract card information" }, { status: 500 })
  }
}
