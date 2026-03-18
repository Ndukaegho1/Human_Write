import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getUserFromRequest } from "@/lib/auth"
import { getCollection } from "@/lib/db"
import { voiceProfileSchema } from "@/lib/validators"
import { z } from "zod"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const collection = await getCollection("voice_profiles")
  const profile = await collection.findOne({ firebase_uid: user.firebase_uid })
  const defaults = {
    tone_preferences: [],
    banned_phrases: [],
    preferred_vocabulary: [],
    sentence_style: "balanced",
    warmth: "medium",
  }
  return NextResponse.json(profile ? { ...defaults, ...profile } : defaults)
}

function sanitizeUpdate(body: unknown) {
  const patchSchema = z.object({
    tone_preferences: z.array(z.string()).optional(),
    banned_phrases: z.array(z.string()).optional(),
    preferred_vocabulary: z.array(z.string()).optional(),
    sentence_style: z.enum(["short", "balanced", "long"]).optional(),
    warmth: z.enum(["low", "medium", "high"]).optional(),
  })
  return patchSchema.parse(body)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const parsed = voiceProfileSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
  }
  const collection = await getCollection("voice_profiles")
  await collection.updateOne(
    { firebase_uid: user.firebase_uid },
    {
      $set: {
        user_id: user._id,
        ...parsed.data,
        updated_at: new Date(),
      },
      $setOnInsert: { _id: new ObjectId() },
    },
    { upsert: true }
  )
  return NextResponse.json({ ok: true })
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = sanitizeUpdate(body)
  const collection = await getCollection("voice_profiles")
  const result = await collection.updateOne(
    { firebase_uid: user.firebase_uid },
    { $set: { user_id: user._id, ...parsed, updated_at: new Date() } },
    { upsert: true }
  )
  return NextResponse.json({ ok: true, upserted: result.upsertedCount > 0 })
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const collection = await getCollection("voice_profiles")
  await collection.deleteOne({ firebase_uid: user.firebase_uid })
  return NextResponse.json({ ok: true })
}
