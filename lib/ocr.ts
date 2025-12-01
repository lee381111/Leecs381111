import Tesseract from "tesseract.js"

export async function extractTextFromImage(imageFile: File, language = "kor+eng"): Promise<string> {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imageFile, language, {
      logger: (m) => console.log("[v0] OCR Progress:", m),
    })
    return text
  } catch (error) {
    console.error("[v0] OCR Error:", error)
    throw new Error("Failed to extract text from image")
  }
}

export function getOCRLanguage(appLanguage: string): string {
  const languageMap: Record<string, string> = {
    ko: "kor+eng",
    en: "eng",
    zh: "chi_sim+eng",
    ja: "jpn+eng",
  }
  return languageMap[appLanguage] || "eng"
}
