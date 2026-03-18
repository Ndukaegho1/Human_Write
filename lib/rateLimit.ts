import { getCollection } from "@/lib/db"
import { UsageLogDoc, UserDoc, UsageAction, Plan } from "@/models/collections"
import { ObjectId } from "mongodb"

const PLAN_LIMITS: Record<string, Record<UsageAction, number>> = {
  free: {
    rewrite: 30,
    detect: 50,
  },
  pro: {
    rewrite: 500,
    detect: 1000,
  },
}

const PLAN_DAILY_LIMITS: Record<string, Record<UsageAction, number>> = {
  free: {
    rewrite: 3,
    detect: 8,
  },
  pro: {
    rewrite: 50,
    detect: 120,
  },
}

export type UsageWindow = "daily" | "monthly"

function getWindowStart(window: UsageWindow) {
  const now = new Date()
  if (window === "daily") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export async function checkUsageLimit(
  firebaseUid: string,
  action: UsageAction,
  plan: Plan,
  window: UsageWindow = "monthly"
) {
  const usageLogs = await getCollection<UsageLogDoc>("usage_logs")
  const startOfWindow = getWindowStart(window)
  const count = await usageLogs.countDocuments({
    firebase_uid: firebaseUid,
    action,
    created_at: { $gte: startOfWindow },
    status: "success",
  })
  const limit = (window === "daily" ? PLAN_DAILY_LIMITS[plan] : PLAN_LIMITS[plan])[action]
  return {
    ok: count < limit,
    limit,
    used: count,
    plan,
    window,
  }
}

export async function logUsage(input: {
  user: Pick<UserDoc, "plan" | "firebase_uid"> & { _id: ObjectId }
  action: UsageAction
  requestId?: ObjectId
  tokens?: number
  status: UsageLogDoc["status"]
  model?: UsageLogDoc["model"]
  latencyMs?: number
  errorCode?: string
}) {
  const logs = await getCollection<UsageLogDoc>("usage_logs")
  await logs.insertOne({
    _id: new ObjectId(),
    user_id: input.user._id,
    firebase_uid: input.user.firebase_uid,
    action: input.action,
    tokens: input.tokens ?? 0,
    model: input.model,
    request_id: input.requestId,
    created_at: new Date(),
    plan_snapshot: input.user.plan,
    status: input.status,
    latency_ms: input.latencyMs,
    error_code: input.errorCode,
  })
}
