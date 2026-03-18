import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getUserFromRequest, hasPersistedUserId } from "@/lib/auth"
import { getCollection } from "@/lib/db"

const feedbackSchema = z.object({
  targetType: z.enum(["rewrite_result", "detector_request"]),
  targetId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  rating: z.enum(["like", "dislike"]),
  selectedVersion: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  notes: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!hasPersistedUserId(user)) {
    return NextResponse.json(
      { error: "Profile sync is still pending. Check Firebase and MongoDB configuration." },
      { status: 503 }
    )
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const parsed = feedbackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
  }

  const payload = parsed.data
  const targetCollection = payload.targetType === "rewrite_result" ? "rewrite_results" : "detector_requests"
  const targetCol = await getCollection(targetCollection)
  const targetExists = await targetCol.countDocuments({
    _id: new ObjectId(payload.targetId),
    firebase_uid: user.firebase_uid,
  })
  if (targetExists === 0) return NextResponse.json({ error: "Target not found" }, { status: 404 })

  const feedbackCol = await getCollection("feedback")
  const inserted = await feedbackCol.insertOne({
    _id: new ObjectId(),
    user_id: user._id,
    firebase_uid: user.firebase_uid,
    target_type: payload.targetType,
    target_id: new ObjectId(payload.targetId),
    rating: payload.rating,
    selected_version: payload.selectedVersion,
    notes: payload.notes,
    created_at: new Date(),
  })

  return NextResponse.json({ ok: true, feedbackId: inserted.insertedId.toString() })
}
