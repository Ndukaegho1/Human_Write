import { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import type { DecodedIdToken } from "firebase-admin/auth"
import { firebaseAdminAuth } from "@/lib/firebase/server"
import { getCollection } from "@/lib/db"
import { UserDoc } from "@/models/collections"

type DecodedFirebaseToken = DecodedIdToken

export type AuthUser = Omit<UserDoc, "_id"> & {
  _id?: ObjectId
  syncDeferred?: boolean
  syncError?: string
}

export type PersistedAuthUser = AuthUser & {
  _id: ObjectId
}

function extractNameParts(decoded: DecodedFirebaseToken) {
  const claims = decoded as DecodedFirebaseToken & { given_name?: string; family_name?: string }
  const given = claims.given_name?.trim()
  const family = claims.family_name?.trim()

  if (given || family) {
    return { first_name: given, last_name: family }
  }

  const fullName = decoded.name?.trim() ?? ""
  if (!fullName) {
    return { first_name: undefined, last_name: undefined }
  }

  const [first, ...rest] = fullName.split(/\s+/)
  return {
    first_name: first || undefined,
    last_name: rest.length ? rest.join(" ") : undefined,
  }
}

export async function verifyFirebaseUserFromRequest(req: NextRequest): Promise<DecodedFirebaseToken | null> {
  const authorization = req.headers.get("authorization")
  if (!authorization?.startsWith("Bearer ")) return null
  if (!firebaseAdminAuth) return null

  const token = authorization.substring("Bearer ".length)
  try {
    return await firebaseAdminAuth.verifyIdToken(token)
  } catch {
    return null
  }
}

export function buildFallbackUserFromToken(decoded: DecodedFirebaseToken): AuthUser {
  const now = new Date()
  const names = extractNameParts(decoded)
  return {
    firebase_uid: decoded.uid,
    email: decoded.email ?? "",
    display_name: decoded.name,
    first_name: names.first_name,
    last_name: names.last_name,
    avatar_url: decoded.picture,
    plan: "free",
    role: "user",
    created_at: now,
    updated_at: now,
    syncDeferred: true,
  }
}

export async function syncUserFromToken(decoded: DecodedFirebaseToken): Promise<AuthUser> {
  const fallbackUser = buildFallbackUserFromToken(decoded)
  const users = await getCollection<UserDoc>("users")
  const now = new Date()
  const names = extractNameParts(decoded)

  const existing = await users.findOne({ firebase_uid: decoded.uid })
  if (!existing) {
    const inserted = await users.insertOne({
      firebase_uid: decoded.uid,
      email: decoded.email ?? "",
      display_name: decoded.name,
      first_name: names.first_name,
      last_name: names.last_name,
      avatar_url: decoded.picture,
      plan: "free",
      role: "user",
      created_at: now,
      updated_at: now,
    } as UserDoc)

    return {
      ...fallbackUser,
      _id: inserted.insertedId,
      created_at: now,
      updated_at: now,
      syncDeferred: false,
    }
  }

  const updated = await users.findOneAndUpdate(
    { firebase_uid: decoded.uid },
    {
      $set: {
        email: decoded.email,
        display_name: decoded.name,
        first_name: names.first_name,
        last_name: names.last_name,
        avatar_url: decoded.picture,
        updated_at: now,
      },
    },
    { returnDocument: "after", includeResultMetadata: true }
  )

  if (!updated?.value) {
    const refreshed = await users.findOne({ firebase_uid: decoded.uid })
    if (refreshed) return refreshed as AuthUser
    return fallbackUser
  }

  return {
    ...(updated.value as UserDoc),
    syncDeferred: false,
  }
}

export function hasPersistedUserId(user: AuthUser | null): user is PersistedAuthUser {
  return Boolean(user?._id)
}

export async function getUserFromRequest(req: NextRequest) {
  const decoded = await verifyFirebaseUserFromRequest(req)
  if (!decoded) return null
  try {
    return await syncUserFromToken(decoded)
  } catch (error) {
    const fallbackUser = buildFallbackUserFromToken(decoded)
    fallbackUser.syncError = error instanceof Error ? error.message : "Profile sync failed"
    return fallbackUser
  }
}
