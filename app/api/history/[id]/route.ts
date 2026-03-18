import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCollection } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

function isValidObjectId(value: string) {
  return /^[0-9a-fA-F]{24}$/.test(value)
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isValidObjectId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  const id = new ObjectId(params.id)
  const rewriteRequests = await getCollection("rewrite_requests")
  const rewriteResults = await getCollection("rewrite_results")
  const detectorRequests = await getCollection("detector_requests")

  const rewrite = await rewriteRequests.findOne({ _id: id, firebase_uid: user.firebase_uid })
  if (rewrite) {
    const versions = await rewriteResults.find({ request_id: id }).sort({ version: 1 }).toArray()
    return NextResponse.json({
      id: rewrite._id.toString(),
      kind: "rewrite",
      original_text: rewrite.input_text,
      mode: rewrite.mode,
      strength: rewrite.strength,
      created_at: rewrite.created_at,
      variants: versions,
    })
  }

  const detector = await detectorRequests.findOne({ _id: id, firebase_uid: user.firebase_uid })
  if (detector) {
    return NextResponse.json({
      id: detector._id.toString(),
      kind: "detector",
      original_text: detector.input_text,
      created_at: detector.created_at,
      detector_score: {
        ai_score_percent: detector.ai_score_percent,
        human_score_percent: detector.human_score_percent,
        confidence_percent: detector.confidence_percent,
        risk_level: detector.risk_level,
        flagged_sentences: detector.flagged_sentences,
        reasons: detector.reasons,
      },
    })
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isValidObjectId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const id = new ObjectId(params.id)
  const rewriteResults = await getCollection("rewrite_results")
  const rewriteRequests = await getCollection("rewrite_requests")
  const detectorRequests = await getCollection("detector_requests")

  const rewriteDelete = await rewriteRequests.deleteOne({ _id: id, firebase_uid: user.firebase_uid })
  if (rewriteDelete.deletedCount > 0) {
    await rewriteResults.deleteMany({ request_id: id })
    return NextResponse.json({ ok: true, kind: "rewrite" })
  }

  const detectorDelete = await detectorRequests.deleteOne({ _id: id, firebase_uid: user.firebase_uid })
  if (detectorDelete.deletedCount > 0) {
    return NextResponse.json({ ok: true, kind: "detector" })
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
