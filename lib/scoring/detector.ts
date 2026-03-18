import { computeSignals } from "./signals"
import { clamp } from "@/lib/utils"
import { SentenceSplitter } from "./text"
import { RiskLevel } from "@/models/collections"

const WEIGHTS = {
  repetition: 0.14,
  burstiness: 0.18,
  predictability: 0.16,
  sentence_uniformity: 0.14,
  vocab_diversity: 0.12,
  transition_overuse: 0.12,
  generic_phrasing: 0.14,
  stylistic_consistency: 0.10,
}

export async function computeDetectionScore(text: string) {
  const signals = computeSignals(text)
  // TODO: Optional future Python/ML scoring service can be invoked here and blended with heuristic score.
  const weighted = Object.entries(WEIGHTS).reduce((acc, [key, weight]) => {
    const k = key as keyof typeof WEIGHTS
    return acc + (signals[k] as number) * weight
  }, 0)

  const aiScorePercent = Math.round(clamp(weighted))
  const humanScorePercent = 100 - aiScorePercent
  const reasons = Object.entries(signals)
    .filter(([, v]) => Number(v) > 58)
    .map(([k]) => `signal=${k}`)

  const sentences = SentenceSplitter.split(text)
  const flaggedSentences = sentences
    .map((sentence) => {
      const s = computeSignals(sentence)
      const sScore = Math.round(
        0.35 * s.repetition +
          0.25 * s.predictability * 1 +
          0.2 * s.sentence_uniformity +
          0.2 * s.generic_phrasing
      )
      const list = Object.entries(s)
        .filter(([, v]) => Number(v) > 62)
        .map(([k]) => `sentence_${k}`)
      return { text: sentence, aiScorePercent: clamp(sScore, 0, 100), reasons: list }
    })
    .filter((x) => x.aiScorePercent >= 70 || x.reasons.length >= 2)

  const confidencePercent = Math.min(
    100,
    Math.round(40 + Math.min(60, Math.max(0, (text.length - 100) / 20)))
  )
  const riskLevel: RiskLevel = aiScorePercent >= 70 ? "high" : aiScorePercent >= 40 ? "medium" : "low"
  const disclaimer =
    "Result is probabilistic and should be treated as guidance, not as definitive proof of AI-generated content."

  return {
    aiScorePercent,
    humanScorePercent,
    confidencePercent,
    riskLevel,
    flaggedSentences,
    reasons,
    disclaimer,
  }
}
