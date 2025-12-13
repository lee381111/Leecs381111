export function extractiveSummarize(text: string, sentenceCount = 3): string {
  // Split into sentences
  const sentences = text
    .replace(/([.?!])\s*(?=[A-Z가-힣])/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 10)

  if (sentences.length <= sentenceCount) {
    return text
  }

  // Score sentences by word frequency
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  const wordFreq: Record<string, number> = {}

  words.forEach((word) => {
    if (word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })

  // Score each sentence
  const sentenceScores = sentences.map((sentence) => {
    const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || []
    const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0)
    return { sentence, score }
  })

  // Get top sentences
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))

  return topSentences.map((s) => s.sentence).join(" ")
}
