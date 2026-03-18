import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getCollection } from "@/lib/db"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const type = url.searchParams.get("type") ?? "all"
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "20"), 100)
  const include = type.toLowerCase()
  if (!["all", "rewrite", "detector", "favorites"].includes(include)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }

  const rewriteRequests = await getCollection("rewrite_requests")
  const detectorRequests = await getCollection("detector_requests")
  const rewriteResults = await getCollection("rewrite_results")

  const rows: any[] = []

  if (include === "all" || include === "rewrite" || include === "favorites") {
    const favoriteFilter =
      include === "favorites" ? { firebase_uid: user.firebase_uid, is_favorite: true } : { firebase_uid: user.firebase_uid }

    const targetRequests = await (include === "favorites"
      ? rewriteResults.distinct("request_id", favoriteFilter)
      : rewriteRequests.find({ firebase_uid: user.firebase_uid }).project({ _id: 1 }).toArray())

    const requestIds = include === "favorites" ? targetRequests : targetRequests.map((r: any) => r._id)
    const requests = await rewriteRequests
      .find({
        firebase_uid: user.firebase_uid,
        _id: { $in: requestIds },
      })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray()

    for (const request of requests) {
      const versions = await rewriteResults.find({ request_id: request._id }).sort({ version: 1 }).toArray()
      const parsedVersions = versions.map((row) => ({
        id: row._id.toString(),
        version: row.version,
        text: row.output_text,
        ranking: row.ranking,
        saved: row.saved,
        is_favorite: row.is_favorite,
        createdAt: row.created_at,
      }))
      rows.push({
        id: request._id.toString(),
        kind: "rewrite",
        original_text: request.input_text,
        mode: request.mode,
        strength: request.strength,
        created_at: request.created_at,
        detected_tone: request.detected_tone,
        selected_version: versions.find((row) => row.is_favorite)?.version ?? null,
        generated_versions: parsedVersions,
        detector_score: null,
      })
    }
  }

  if (include === "all" || include === "detector") {
    const detections = await detectorRequests
      .find({ firebase_uid: user.firebase_uid })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray()
    for (const detection of detections) {
      rows.push({
        id: detection._id.toString(),
        kind: "detector",
        original_text: detection.input_text,
        created_at: detection.created_at,
        generated_versions: [],
        selected_version: null,
        detector_score: {
          ai_score_percent: detection.ai_score_percent,
          human_score_percent: detection.human_score_percent,
          confidence_percent: detection.confidence_percent,
          risk_level: detection.risk_level,
          flagged_sentences: detection.flagged_sentences,
          reasons: detection.reasons,
        },
      })
    }
  }

  const items = rows.sort((a: any, b: any) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, limit)
  return NextResponse.json({ items })
}
