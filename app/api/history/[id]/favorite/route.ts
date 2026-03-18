import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCollection } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

function isValidObjectId(value: string) {
  return /^[0-9a-fA-F]{24}$/.test(value)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isValidObjectId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  let isFavorite = true
  try {
    const body = await req.json()
    if (typeof body?.isFavorite === "boolean") isFavorite = body.isFavorite
  } catch {
    // default true when no body is sent
  }

  const id = new ObjectId(params.id)
  const results = await getCollection("rewrite_results")
  const result = await results.updateOne(
    { _id: id, firebase_uid: user.firebase_uid },
    { $set: { is_favorite: isFavorite, saved: true } }
  )
  if (result.matchedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true, is_favorite: isFavorite })
}
