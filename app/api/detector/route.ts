import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { detectorSchema } from "@/lib/validators"
import { getUserFromRequest } from "@/lib/auth"
import { getCollection } from "@/lib/db"
import { computeDetectionScore } from "@/lib/scoring/detector"
import { clamp } from "@/lib/utils"
import { checkUsageLimit, logUsage } from "@/lib/rateLimit"
import { DetectorRequestDoc, RiskLevel } from "@/models/collections"
import { callPythonDetect, PythonDetectResponse } from "@/lib/pythonScorer"

const PYTHON_CONFIDENCE_PERCENT: Record<"low" | "medium" | "high", number> = {
  low: 46,
  medium: 72,
  high: 90,
}

type HeuristicDetectionScore = {
  aiScorePercent: number
  humanScorePercent: number
  confidencePercent: number
  riskLevel: RiskLevel
  flaggedSentences: { text: string; aiScorePercent: number; reasons: string[] }[]
  reasons: string[]
  disclaimer: string
}

function deriveRiskLevel(aiScorePercent: number): RiskLevel {
  if (aiScorePercent >= 78) return "high"
  if (aiScorePercent >= 40) return "medium"
  return "low"
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean).map((value) => value.trim()))]
}

function pythonSignalsToReasons(response: PythonDetectResponse) {
  const reasons: string[] = []
  if (response.signals.lexical_diversity < 0.35) {
    reasons.push("Low lexical diversity and repeated wording.")
  }
  if (response.signals.sentence_variation < 0.25) {
    reasons.push("Low sentence-length variation.")
  }
  if (response.signals.repetition_ratio > 0.18) {
    reasons.push("Higher word repetition ratio detected.")
  }
  if (response.signals.burstiness < 0.3) {
    reasons.push("Low burstiness and rhythm variation in sentence construction.")
  }
  if (response.signals.uniformity_flag) {
    reasons.push("Paragraph uniformity appears elevated.")
  }
  if (typeof response.signals.punctuation_variation === "number" && response.signals.punctuation_variation < 0.2) {
    reasons.push("Punctuation patterns are limited.")
  }
  if (typeof response.signals.transition_repetition === "number" && response.signals.transition_repetition > 0.2) {
    reasons.push("Transition phrases are repeated.")
  }
  if (typeof response.signals.paragraph_uniformity === "number" && response.signals.paragraph_uniformity > 0.7) {
    reasons.push("Paragraph structure is fairly uniform.")
  }

  return reasons
}

function mapPythonDetectionToLegacy(response: PythonDetectResponse, fallback: HeuristicDetectionScore): HeuristicDetectionScore {
  const aiScorePercent = clamp(Math.round(response.ai_score), 0, 100)
  const humanScorePercent = clamp(Math.round(response.human_score), 0, 100)
  const confidencePercent = clamp(
    PYTHON_CONFIDENCE_PERCENT[response.confidence] ?? 72,
    20,
    100
  )

  const reasons = uniqueStrings([
    response.verdict,
    response.explanation,
    ...pythonSignalsToReasons(response),
    ...fallback.reasons,
  ])

  return {
    aiScorePercent,
    humanScorePercent,
    confidencePercent,
    riskLevel: deriveRiskLevel(aiScorePercent),
    flaggedSentences: fallback.flaggedSentences,
    reasons,
    disclaimer: fallback.disclaimer,
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = detectorSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
  }

  // Daily window is used here to avoid burst abuse and keep costs predictable.
  const limit = await checkUsageLimit(user.firebase_uid, "detect", user.plan, "daily")
  if (!limit.ok) return NextResponse.json({ error: "Usage limit exceeded", limit }, { status: 429 })

  const started = Date.now()
  const requestId = new ObjectId()

  try {
    const heuristic = await computeDetectionScore(parsed.data.text)
    const python = await callPythonDetect({ text: parsed.data.text })

    const result = python.ok ? mapPythonDetectionToLegacy(python.data, heuristic) : heuristic
    const pipelineSource = python.ok ? "python_service" : "heuristic"

    const collection = await getCollection<DetectorRequestDoc>("detector_requests")
    await collection.insertOne({
      _id: requestId,
      user_id: user._id,
      firebase_uid: user.firebase_uid,
      input_text: parsed.data.text,
      ai_score_percent: result.aiScorePercent,
      human_score_percent: result.humanScorePercent,
      confidence_percent: result.confidencePercent,
      risk_level: result.riskLevel,
      flagged_sentences: result.flaggedSentences.map((item) => ({
        text: item.text,
        ai_score_percent: item.aiScorePercent,
        reasons: item.reasons,
      })),
      reasons: result.reasons,
      disclaimer: result.disclaimer,
      created_at: new Date(),
      latency_ms: Date.now() - started,
      created_by_pipeline: pipelineSource,
    })

    await logUsage({
      user: { ...user, _id: user._id },
      action: "detect",
      requestId,
      status: "success",
      model: pipelineSource === "python_service" ? "gpt-4o-mini" : "heuristic",
      tokens: 0,
      latencyMs: Date.now() - started,
    })

    return NextResponse.json({
      requestId: requestId.toString(),
      ...result,
      usage: { used: limit.used + 1, limit: limit.limit },
      window: limit.window,
      pipeline: pipelineSource,
      detectorHints: python.ok ? ["python scorer used"] : undefined,
    })
  } catch (error: any) {
    await logUsage({
      user: { ...user, _id: user._id },
      action: "detect",
      requestId,
      status: "error",
      errorCode: error?.message,
      latencyMs: Date.now() - started,
    })
    return NextResponse.json({ error: "Detection failed" }, { status: 500 })
  }
}

