import { tokenize, SentenceSplitter } from "./text"

function normalize(v: number, min: number, max: number) {
  return Math.max(0, Math.min(1, (v - min) / Math.max(1, max - min)))
}

export function computeSignals(text: string) {
  const sentences = SentenceSplitter.split(text)
  const words = tokenize(text)
  const unique = new Set(words)
  const uniqueRatio = unique.size / Math.max(1, words.length)

  const lower = text.toLowerCase()
  const repeats = (lower.match(/\b(\w+)\b.*\b\1\b/gi) ?? []).length
  const transitions = (lower.match(/\b(however|therefore|moreover|furthermore|additionally|in addition|consequently)\b/gi) ?? [])
    .length
  const genericPhrases = ["in today's world", "in conclusion", "it is important to note", "to summarize"]
  const genericHits = genericPhrases.filter((p) => lower.includes(p)).length

  const sentenceLengths = sentences.map((s) => s.trim().split(/\s+/).length)
  const meanLength =
    sentenceLengths.reduce((acc, v) => acc + v, 0) / Math.max(1, sentenceLengths.length)
  const variance =
    sentenceLengths.reduce((acc, v) => acc + Math.pow(v - meanLength, 2), 0) /
    Math.max(1, sentenceLengths.length)
  const burstiness = Math.sqrt(variance)
  const uniformity = 100 - Math.min(100, variance * 20)

  const predictability =
    Math.min(1, sentences.length > 0 ? sentences.filter((s) => /however|therefore|moreover|furthermore/.test(s.toLowerCase())).length / sentences.length : 0)

  return {
    repetition: Math.min(100, repeats * 18),
    burstiness: normalize(burstiness, 0, 8) * 100,
    predictability: Math.round(predictability * 100),
    sentence_uniformity: Math.round(uniformity),
    vocab_diversity: Math.round((1 - uniqueRatio) * 100),
    transition_overuse: Math.min(100, Math.round((transitions / 8) * 100)),
    generic_phrasing: Math.round((genericHits / genericPhrases.length) * 100),
    stylistic_consistency: Math.max(0, 100 - Math.abs(50 - Math.min(100, uniqueRatio * 160))),
  }
}
