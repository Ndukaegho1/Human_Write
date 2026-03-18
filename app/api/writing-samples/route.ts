import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { writingSampleSchema } from "@/lib/validators"
import { getUserFromRequest } from "@/lib/auth"
import { getCollection } from "@/lib/db"
import { createEmbedding } from "@/lib/services/embeddings"
import { checkUsageLimit } from "@/lib/rateLimit"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const url = new URL(req.url)
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "25"), 100)
  const samples = await (await getCollection("writing_samples"))
    .find({ firebase_uid: user.firebase_uid })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray()
  return NextResponse.json({
    samples: samples.map((sample: any) => ({ ...sample, embedding: undefined })),
    total: samples.length,
  })
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const limit = await checkUsageLimit(user.firebase_uid, "rewrite", user.plan, "monthly")
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Monthly rewrite-like quota exceeded for learning samples", limit },
      { status: 429 }
    )
  }

  const parsed = writingSampleSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  // TODO: send `content` to a moderation pipeline before indexing and use summarization for metadata.
  const embedding = await createEmbedding(parsed.data.content)
  const insert = await (await getCollection("writing_samples")).insertOne({
    _id: new ObjectId(),
    user_id: user._id,
    firebase_uid: user.firebase_uid,
    title: parsed.data.title,
    content: parsed.data.content,
    source: parsed.data.source,
    embedding,
    created_at: new Date(),
  })
  return NextResponse.json({ ok: true, sampleId: insert.insertedId.toString() })
}
