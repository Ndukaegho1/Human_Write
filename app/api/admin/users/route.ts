import { NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

function escapeRegexInput(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function normalizePlan(plan: unknown) {
  return String(plan || "free").toLowerCase()
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const searchParams = new URL(req.url).searchParams
  const query = searchParams.get("q")?.trim() || ""
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
  const limit = Math.max(5, Math.min(100, Number(searchParams.get("limit") ?? "25")))
  const skip = (page - 1) * limit

  const users = await getCollection("users")
  const usage = await getCollection("usage_logs")
  const subscriptions = await getCollection("subscriptions")

  const match: Record<string, unknown> = {}
  if (query) {
    const queryRegex = new RegExp(escapeRegexInput(query), "i")
    match.$or = [
      { email: queryRegex },
      { display_name: queryRegex },
      { first_name: queryRegex },
      { last_name: queryRegex },
      { role: queryRegex },
    ]
  }

  const total = await users.countDocuments(match)
  const rows = await users
    .find(match, {
      projection: {
        email: 1,
        display_name: 1,
        first_name: 1,
        last_name: 1,
        role: 1,
        plan: 1,
        created_at: 1,
        firebase_uid: 1,
      },
      sort: { created_at: -1 },
      skip,
      limit,
    })
    .toArray()

  const userIds = rows.map((row: any) => row._id)
  const firebaseUids = rows.map((row: any) => row.firebase_uid)

  const usageRows =
    userIds.length === 0
      ? []
      : await usage
          .aggregate([{ $match: { user_id: { $in: userIds }, status: "success" } }, { $group: { _id: "$user_id", usage: { $sum: "$tokens" } } }])
          .toArray()

  const subsRows =
    firebaseUids.length === 0
      ? []
      : await subscriptions
          .find(
            { firebase_uid: { $in: firebaseUids }, status: "active" },
            { projection: { firebase_uid: 1, plan: 1, status: 1 } }
          )
          .toArray()

  const usageByUser = new Map(usageRows.map((item: any) => [String(item._id), Number(item.usage ?? 0)]))
  const activeSubscriptionsByFirebaseUid = new Set(subsRows.map((item: any) => item.firebase_uid))

  return NextResponse.json({
    users: rows.map((row: any) => ({
      id: String(row._id),
      email: row.email ?? "",
      name:
        row.display_name ||
        [row.first_name, row.last_name].filter(Boolean).join(" ") ||
        row.email?.split("@")[0] ||
        "Unknown",
      role: row.role || "user",
      plan: normalizePlan(row.plan),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      usage: usageByUser.get(String(row._id)) ?? 0,
      hasActiveSubscription: activeSubscriptionsByFirebaseUid.has(row.firebase_uid),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  })
}
