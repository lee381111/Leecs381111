import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return Response.json({ error: "No image data provided" }, { status: 400 })
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY!,
    })

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are an expert OCR system for business cards. Extract ALL text from this business card image and organize it into the following JSON fields. Be accurate and extract exactly what you see:

{
  "name": "full name of the person",
  "company": "company name",
  "position": "job title or position",
  "phone": "phone number (keep original format)",
  "email": "email address",
  "address": "full address if available",
  "notes": "any additional information like website, fax, social media, or other details"
}

Important:
- Extract text EXACTLY as it appears on the card
- If a field is not found, leave it as empty string ""
- For Korean cards, extract Korean text
- For English cards, extract English text
- Phone numbers: keep original format (with dashes, spaces, etc.)
- Notes field: include any extra information like website URL, LinkedIn, WeChat, etc.
- Return ONLY the JSON object, no other text

Business Card Image Data: ${imageData}`,
    })

    // Parse the AI response
    let extractedData
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0])
      } else {
        extractedData = JSON.parse(text)
      }
    } catch (e) {
      console.error("Failed to parse AI response:", text)
      return Response.json({ error: "Failed to extract card information" }, { status: 500 })
    }

    return Response.json({ data: extractedData })
  } catch (error: any) {
    console.error("Business card extraction error:", error)
    return Response.json({ error: error.message || "Failed to extract card information" }, { status: 500 })
  }
}
