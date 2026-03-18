import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getUserFromRequest, hasPersistedUserId } from "@/lib/auth"
import { getCollection } from "@/lib/db"
import { humanizeSchema } from "@/lib/validators"
import { generateVariants, rankVariants } from "@/lib/humanizer/pipeline"
import { pickRelevantSamples, getVoiceProfile } from "@/lib/humanizer/voice"
import { checkUsageLimit, logUsage } from "@/lib/rateLimit"
import { RewriteRequestDoc, RewriteResultDoc } from "@/models/collections"
import { callPythonHumanize } from "@/lib/pythonScorer"
import { buildLocalRewriteVariants } from "@/lib/services/openai"

type LegacyHumanizeMode = "standard" | "casual" | "professional" | "concise" | "more_human"
type LegacyStrength = "low" | "medium" | "high"

const HUMANIZE_MODE_MAP: Record<LegacyHumanizeMode, "light" | "balanced" | "strong"> = {
  standard: "balanced",
  casual: "light",
  professional: "balanced",
  concise: "light",
  more_human: "strong",
}

const HUMANIZE_STRENGTH_MAP: Record<LegacyStrength, number> = {
  low: 30,
  medium: 60,
  high: 90,
}

async function buildRankedVariants(input: {
  text: string
  mode: LegacyHumanizeMode
  strength: LegacyStrength
  firebaseUid?: string
}) {
  const pythonInput = {
    text: input.text,
    tone: "professional",
    mode: HUMANIZE_MODE_MAP[input.mode],
    strength: HUMANIZE_STRENGTH_MAP[input.strength],
    preserve_meaning: true,
  }

  const pythonResponse = await callPythonHumanize(pythonInput)
  const pythonWorked = pythonResponse.ok && !!pythonResponse.data?.humanized_text?.trim()
  const candidates: string[] = []

  if (pythonWorked) {
    candidates.push((pythonResponse.data?.humanized_text || "").trim())
  }

  try {
    const generated = input.firebaseUid
      ? await (async () => {
          const profile = await getVoiceProfile(input.firebaseUid!)
          const samples = await pickRelevantSamples(input.firebaseUid!, input.text)
          return generateVariants({
            inputText: input.text,
            mode: input.mode,
            strength: input.strength,
            userContext: profile,
            samples,
          })
        })()
      : await generateVariants({
          inputText: input.text,
          mode: input.mode,
          strength: input.strength,
          userContext: null,
          samples: [],
        })

    candidates.push(...generated)
  } catch {
    // Guest mode should still work even when optional services are unavailable.
  }

  const fallbackPool = buildLocalRewriteVariants(input.text, input.mode, input.strength)
  for (const fallback of fallbackPool) {
    if (candidates.length >= 3) break
    candidates.push(fallback)
  }

  const uniqueCandidates = [...new Set(candidates.map((item) => item.trim()).filter(Boolean))]
  for (const fallback of fallbackPool) {
    if (uniqueCandidates.length >= 3) break
    if (!uniqueCandidates.includes(fallback)) {
      uniqueCandidates.push(fallback)
    }
  }

  while (uniqueCandidates.length < 3) {
    uniqueCandidates.push(input.text.trim().replace(/\s+/g, " "))
  }

  return {
    ranked: rankVariants(input.text, uniqueCandidates.slice(0, 3)).slice(0, 3),
    pythonWorked,
  }
}

export async function POST(req: NextRequest) {
  const payload = humanizeSchema.safeParse(await req.json())
  if (!payload.success) {
    return NextResponse.json({ error: "Invalid payload", details: payload.error.flatten() }, { status: 400 })
  }

  const authUser = await getUserFromRequest(req)
  const user = hasPersistedUserId(authUser) ? authUser : null
  const requestId = new ObjectId()
  const started = Date.now()

  if (!user) {
    const { ranked, pythonWorked } = await buildRankedVariants({
      text: payload.data.text,
      mode: payload.data.mode,
      strength: payload.data.strength,
    })

    return NextResponse.json({
      requestId: requestId.toString(),
      selectedVersion: 1,
      guestMode: true,
      variants: ranked.map((item, idx) => ({
        version: idx + 1,
        text: item.text,
        ranking: item.ranking,
      })),
      ranking: ranked.map((item, idx) => ({ version: idx + 1, score: item.ranking.final_score })),
      pipeline: pythonWorked ? "python_service" : "local_fallback",
    })
  }

  const limit = await checkUsageLimit(user.firebase_uid, "rewrite", user.plan)
  if (!limit.ok) return NextResponse.json({ error: "Usage limit exceeded", limit }, { status: 429 })

  const requestCollection = await getCollection<RewriteRequestDoc>("rewrite_requests")
  const resultCollection = await getCollection<RewriteResultDoc>("rewrite_results")
  const requestDoc: RewriteRequestDoc = {
    _id: requestId,
    user_id: user._id,
    firebase_uid: user.firebase_uid,
    input_text: payload.data.text,
    mode: payload.data.mode,
    strength: payload.data.strength,
    detected_tone: [],
    source: "web",
    status: "pending",
    created_at: new Date(),
  }

  try {
    // TODO: Add safety moderation check before generation (toxicity, prompts injection, disallowed content).
    await requestCollection.insertOne(requestDoc)

    const { ranked, pythonWorked } = await buildRankedVariants({
      text: payload.data.text,
      mode: payload.data.mode,
      strength: payload.data.strength,
      firebaseUid: user.firebase_uid,
    })

    const normalizedVariants = ranked.map((item, idx) => ({
      request_id: requestId,
      version: (idx + 1) as 1 | 2 | 3,
      output_text: item.text,
      ranking: item.ranking,
      saved: false,
      is_favorite: false,
      created_at: new Date(),
      _id: new ObjectId(),
      user_id: user._id,
      firebase_uid: user.firebase_uid,
    }))

    // TODO: swap with vectorized style-match scoring when embedding index is available in Atlas.
    const saved = await resultCollection.insertMany(normalizedVariants)
    await requestCollection.updateOne(
      { _id: requestId },
      {
        $set: {
          status: "done",
          latency_ms: Date.now() - started,
        },
      }
    )

    await logUsage({
      user: { ...user, _id: user._id },
      action: "rewrite",
      requestId,
      status: "success",
      model: pythonWorked ? "gpt-4o-mini" : "heuristic",
      tokens: 0,
      latencyMs: Date.now() - started,
    })

    return NextResponse.json({
      requestId: requestId.toString(),
      selectedVersion: 1,
      variants: ranked.map((item, idx) => ({
        version: idx + 1,
        text: item.text,
        ranking: item.ranking,
        resultId: saved.insertedIds[idx]?.toString(),
      })),
      // TODO: plug in future reranker model to improve best-3 selection quality.
      ranking: ranked.map((item, idx) => ({ version: idx + 1, score: item.ranking.final_score })),
      usage: { used: limit.used + 1, limit: limit.limit },
      window: limit.window,
      pipeline: pythonWorked ? "python_service" : "local_fallback",
    })
  } catch (error: any) {
    await requestCollection.updateOne(
      { _id: requestId },
      { $set: { status: "failed", latency_ms: Date.now() - started } }
    )
    await logUsage({
      user: { ...user, _id: user._id },
      action: "rewrite",
      status: "error",
      requestId,
      errorCode: error?.message,
      latencyMs: Date.now() - started,
    })
    return NextResponse.json({ error: "Rewrite failed" }, { status: 500 })
  }
}
