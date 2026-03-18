import { NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

const PLAN_PRICE_ESTIMATES: Record<string, number> = {
  free: 0,
  starter: 9,
  pro: 29,
  max: 79,
  team: 149,
}

type PlanDistributionItem = {
  plan: string
  users: number
}

type AdminRecentUser = {
  id: string
  email: string
  name: string
  role: string
  plan: string
  createdAt: string
  usage: number
}

type ActionCount = {
  action: string
  count: number
}

function normalizePlan(plan: unknown) {
  return String(plan || "free").toLowerCase()
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const users = await getCollection("users")
  const subs = await getCollection("subscriptions")
  const rw = await getCollection("rewrite_requests")
  const dt = await getCollection("detector_requests")
  const usage = await getCollection("usage_logs")

  const url = new URL(req.url)
  const days = Math.max(1, Number(url.searchParams.get("days") ?? "30"))
  const from = new Date()
  from.setDate(from.getDate() - days)

  const avgLatency = async (action: "rewrite" | "detect") => {
    const rows = await usage
      .aggregate([{ $match: { action, latency_ms: { $ne: null }, created_at: { $gte: from } } }, { $group: { _id: null, average: { $avg: "$latency_ms" } } }])
      .toArray()
    return rows[0]?.average ?? 0
  }

  const [errorRateRows, tokenUsageRows, totalActiveUsers, requestRows, planDistributionRows, activeSubscriptionRows, recentUsersRaw] =
    await Promise.all([
      usage.aggregate([{ $match: { created_at: { $gte: from } } }, { $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
      usage.aggregate([{ $match: { created_at: { $gte: from } } }, { $group: { _id: null, totalTokens: { $sum: "$tokens" } } }]).toArray(),
      users.aggregate([{ $match: { updated_at: { $gte: from } } }, { $group: { _id: null, count: { $sum: 1 } } }]).toArray(),
      usage.aggregate([{ $match: { created_at: { $gte: from } } }, { $group: { _id: "$action", count: { $sum: 1 } } }]).toArray(),
      users
        .aggregate([
          { $group: { _id: "$plan", users: { $sum: 1 } } },
          { $sort: { users: -1, _id: 1 } },
        ])
        .toArray(),
      subs.aggregate([{ $match: { status: "active" } }, { $group: { _id: "$plan", users: { $sum: 1 } } }]).toArray(),
      users
        .find(
          {},
          {
            projection: {
              email: 1,
              display_name: 1,
              first_name: 1,
              last_name: 1,
              role: 1,
              plan: 1,
              created_at: 1,
            },
          }
        )
        .sort({ created_at: -1 })
        .limit(8)
        .toArray(),
    ])

  const totalUsers = await users.countDocuments()
  const paidUsers = await subs.countDocuments({ status: "active" })

  const recentUserIds = recentUsersRaw.map((item: any) => item._id)
  const recentUserUsageRows =
    recentUserIds.length === 0
      ? []
      : await usage
          .aggregate([
            { $match: { user_id: { $in: recentUserIds }, created_at: { $gte: from }, status: "success" } },
            { $group: { _id: "$user_id", usage: { $sum: "$tokens" } } },
          ])
          .toArray()

  const recentUsageByUser = new Map(
    recentUserUsageRows.map((item: any) => [String(item._id), Number(item.usage ?? 0)])
  )

  const requestByAction: ActionCount[] = requestRows.map((item: any) => ({
    action: item._id,
    count: Number(item.count ?? 0),
  }))

  const planDistribution = planDistributionRows.map((item: any) => ({
    plan: normalizePlan(item._id),
    users: Number(item.users ?? 0),
  })) as PlanDistributionItem[]

  const activePlanDistribution = activeSubscriptionRows.map((item: any) => ({
    plan: normalizePlan(item._id),
    users: Number(item.users ?? 0),
  })) as PlanDistributionItem[]

  const estimatedMonthlyRevenue = activePlanDistribution.reduce((total, item) => {
    return total + item.users * (PLAN_PRICE_ESTIMATES[item.plan] ?? 0)
  }, 0)

  return NextResponse.json({
    window_days: days,
    total_users: totalUsers,
    paid_users: paidUsers,
    rewrite_volume: await rw.countDocuments({ created_at: { $gte: from } }),
    detector_volume: await dt.countDocuments({ created_at: { $gte: from } }),
    avg_latency_rewrite_ms: await avgLatency("rewrite"),
    avg_latency_detect_ms: await avgLatency("detect"),
    token_usage: Number(tokenUsageRows[0]?.totalTokens ?? 0),
    error_rate_by_status: errorRateRows,
    active_users_this_period: totalActiveUsers[0]?.count ?? 0,
    request_count_by_action: requestByAction,
    plan_distribution: planDistribution,
    active_plan_distribution: activePlanDistribution,
    recent_users: recentUsersRaw.map((rawUser: any): AdminRecentUser => ({
      id: String(rawUser._id),
      email: rawUser.email ?? "",
      name:
        rawUser.display_name ||
        [rawUser.first_name, rawUser.last_name].filter(Boolean).join(" ") ||
        rawUser.email?.split("@")[0] ||
        "Unknown",
      role: rawUser.role || "user",
      plan: normalizePlan(rawUser.plan),
      createdAt: rawUser.created_at ? new Date(rawUser.created_at).toISOString() : new Date().toISOString(),
      usage: recentUsageByUser.get(String(rawUser._id)) ?? 0,
    })),
    estimated_monthly_revenue: estimatedMonthlyRevenue,
    plan_revenue_by_plan: activePlanDistribution.map((item) => ({
      plan: item.plan,
      users: item.users,
      revenue: item.users * (PLAN_PRICE_ESTIMATES[item.plan] ?? 0),
    })),
    note: "Only users with role=admin can access this endpoint.",
  })
}
