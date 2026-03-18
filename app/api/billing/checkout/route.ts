import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { initializePaystackTransaction } from "@/lib/services/paystack"
import { env } from "@/lib/env"
import { z } from "zod"
import { getCollection } from "@/lib/db"
import { BillingCycle, getCountryCodeFromHeaders, getPlanPrice, PlanName } from "@/lib/billing/pricing"

const checkoutSchema = z.object({
  plan: z.enum(["Starter", "Pro", "Max", "Team"]).default("Pro"),
  billingCycle: z.enum(["monthly", "annual"]).default("monthly"),
})

async function createCheckout(req: NextRequest, payload: { plan: PlanName; billingCycle: BillingCycle }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!user.email) return NextResponse.json({ error: "User email required for billing" }, { status: 400 })

  const subscriptions = await getCollection("subscriptions")
  const existing = await subscriptions.findOne({ firebase_uid: user.firebase_uid, status: "active" })
  if (existing) return NextResponse.json({ error: "Active subscription already exists" }, { status: 409 })

  const searchCountry = req.nextUrl.searchParams.get("country")
  const countryCode = searchCountry || getCountryCodeFromHeaders(req.headers)
  const price = getPlanPrice(payload.plan, payload.billingCycle, countryCode)
  if (!price.amount) return NextResponse.json({ error: "Invalid billable plan" }, { status: 400 })

  const reference = `hw_${user.firebase_uid}_${Date.now()}`
  const transaction = await initializePaystackTransaction({
    email: user.email,
    amount: price.amount * 100,
    currency: price.currency,
    reference,
    callback_url: `${env.APP_URL}/pricing?payment=callback&reference=${reference}`,
    metadata: {
      firebase_uid: user.firebase_uid,
      plan: payload.plan,
      billingCycle: payload.billingCycle,
      countryCode,
      pricingTier: price.tier,
      source: "humanwrite-web",
    },
  })

  return NextResponse.json({
    url: transaction.data.authorization_url,
    reference: transaction.data.reference,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any))
  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
  }

  return createCheckout(req, parsed.data)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parsed = checkoutSchema.safeParse({
    plan: searchParams.get("plan") || "Pro",
    billingCycle: searchParams.get("billingCycle") || "monthly",
  })

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/pricing?billing_error=1", req.url))
  }

  const response = await createCheckout(req, parsed.data)
  if (response.status === 401) {
    return NextResponse.redirect(new URL("/auth?next=/pricing", req.url))
  }

  if (response.status === 409) {
    return NextResponse.redirect(new URL("/settings?billing=active", req.url))
  }

  if (response.status !== 200) {
    return NextResponse.redirect(new URL("/pricing?billing_error=1", req.url))
  }

  const data = (await response.json()) as { url: string }
  return NextResponse.redirect(data.url)
}
