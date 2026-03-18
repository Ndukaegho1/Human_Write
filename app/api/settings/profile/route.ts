import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getCollection } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { UserDoc } from "@/models/collections"

const schema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().trim().max(120).optional(),
  firstName: z.string().trim().max(60).optional(),
  lastName: z.string().trim().max(60).optional(),
  avatarUrl: z.string().trim().optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(req)
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json().catch(() => null)
    const payload = schema.parse(json)
    const users = await getCollection<UserDoc>("users")
    const now = new Date()

    const nextDisplayName =
      payload.displayName?.trim() ||
      [payload.firstName?.trim(), payload.lastName?.trim()].filter(Boolean).join(" ") ||
      currentUser.display_name ||
      undefined

    await users.updateOne(
      { firebase_uid: currentUser.firebase_uid },
      {
        $set: {
          email: payload.email ?? currentUser.email,
          display_name: nextDisplayName,
          first_name: payload.firstName ?? currentUser.first_name,
          last_name: payload.lastName ?? currentUser.last_name,
          avatar_url: payload.avatarUrl ?? currentUser.avatar_url,
          updated_at: now,
        },
      }
    )

    const updatedUser = await users.findOne({ firebase_uid: currentUser.firebase_uid })

    return NextResponse.json({
      ok: true,
      user: updatedUser,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Could not update profile." },
      { status: 400 }
    )
  }
}
