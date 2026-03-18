import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { checkUsageLimit } from "@/lib/rateLimit"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const rewriteMonthly = await checkUsageLimit(user.firebase_uid, "rewrite", user.plan, "monthly")
  const detectMonthly = await checkUsageLimit(user.firebase_uid, "detect", user.plan, "monthly")
  const rewriteDaily = await checkUsageLimit(user.firebase_uid, "rewrite", user.plan, "daily")
  const detectDaily = await checkUsageLimit(user.firebase_uid, "detect", user.plan, "daily")

  return NextResponse.json({
    plan: user.plan,
    monthly: { rewrite: rewriteMonthly, detect: detectMonthly },
    daily: { rewrite: rewriteDaily, detect: detectDaily },
  })
}
