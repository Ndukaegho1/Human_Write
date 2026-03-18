import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getCollection } from "@/lib/db"
import { checkUsageLimit } from "@/lib/rateLimit"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const subscriptions = await getCollection("subscriptions")
  const current = await subscriptions.findOne({ firebase_uid: user.firebase_uid })
  const rewrite = await checkUsageLimit(user.firebase_uid, "rewrite", user.plan, "monthly")
  const detect = await checkUsageLimit(user.firebase_uid, "detect", user.plan, "monthly")
  return NextResponse.json({
    plan: user.plan,
    current_subscription: current ?? null,
    rewrite_limit: rewrite,
    detect_limit: detect,
    usage_capabilities: {
      rewrite_variations: 3,
      detector_sentence_markers: true,
      custom_voice_profile: user.plan === "pro",
      vector_retrieval: user.plan === "pro",
    },
  })
}
