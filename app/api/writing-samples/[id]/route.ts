import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getUserFromRequest } from "@/lib/auth"
import { getCollection } from "@/lib/db"

const patchSampleSchema = z.object({
  title: z.string().max(80).optional(),
  content: z.string().min(20).max(5000).optional(),
  source: z.enum(["upload", "manual"]).optional(),
})

function isValidObjectId(input: string) {
  return /^[0-9a-fA-F]{24}$/.test(input)
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(_req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isValidObjectId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  const id = new ObjectId(params.id)
  const sample = await (await getCollection("writing_samples")).findOne({ _id: id, firebase_uid: user.firebase_uid })
  if (!sample) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ...sample, embedding: undefined })
}

export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(_req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isValidObjectId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  let body: unknown
  try {
    body = await _req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const parsed = patchSampleSchema.parse(body)
  const updatePayload: Record<string, any> = { ...parsed, updated_at: new Date() }

  const id = new ObjectId(params.id)
  const result = await (await getCollection("writing_samples")).updateOne(
    { _id: id, firebase_uid: user.firebase_uid },
    { $set: updatePayload }
  )
  if (result.matchedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(_req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isValidObjectId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const id = new ObjectId(params.id)
  const result = await (await getCollection("writing_samples")).deleteOne({ _id: id, firebase_uid: user.firebase_uid })
  if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
