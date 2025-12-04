export async function POST(request: Request) {
  // 이 파일은 더 이상 사용되지 않습니다.
  // 요약 기능은 components/notes-section.tsx의 extractiveSummary 함수에서 처리됩니다.
  return Response.json(
    { error: "This endpoint is deprecated. Summarization is now handled client-side." },
    { status: 410 },
  )
}
