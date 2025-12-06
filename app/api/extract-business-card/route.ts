export async function POST(request: Request) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return Response.json({ error: "No image data provided" }, { status: 400 })
    }

    // Since we don't have a vision model or OCR capability on the server,
    // we'll return a helpful message asking the user to manually input the information
    // In a production environment, you would integrate with an OCR service like Google Cloud Vision

    return Response.json({
      data: {
        name: "",
        company: "",
        position: "",
        phone: "",
        email: "",
        address: "",
        notes: "명함 사진이 업로드되었습니다. 정보를 직접 입력해주세요.",
      },
    })
  } catch (error: any) {
    console.error("[v0] Business card extraction error:", error)
    return Response.json({ error: error.message || "Failed to extract card information" }, { status: 500 })
  }
}
