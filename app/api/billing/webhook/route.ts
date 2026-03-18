import { NextRequest, NextResponse } from "next/server"
import { env } from "@/lib/env"
import { getCollection } from "@/lib/db"
import { ObjectId } from "mongodb"
import crypto from "crypto"
import { getPlanPrice } from "@/lib/billing/pricing"

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-paystack-signature")
  const body = await req.text()

  const expectedSignature = crypto.createHmac("sha512", env.PAYSTACK_SECRET_KEY).update(body).digest("hex")
  if (!signature || signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid Paystack signature" }, { status: 400 })
  }

  const now = new Date()
  const subscriptions = await getCollection("subscriptions")
  const users = await getCollection("users")
  const event = JSON.parse(body) as any

  if (event.event === "charge.success") {
    const payload = event.data as any
    const metadata = payload?.metadata || {}
    const firebaseUid = metadata.firebase_uid
    const plan = metadata.plan || "Pro"
    const billingCycle = metadata.billingCycle || "monthly"
    const countryCode = metadata.countryCode || null

    if (!firebaseUid) {
      return NextResponse.json({ error: "Missing firebase uid in metadata" }, { status: 400 })
    }

    const expected = getPlanPrice(plan, billingCycle, countryCode)
    if (payload.amount !== expected.amount * 100) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
    }

    const user = await users.findOne({ firebase_uid: firebaseUid })
    await subscriptions.updateOne(
      { firebase_uid: firebaseUid },
      {
        $set: {
          user_id: user ? user._id : new ObjectId(),
          firebase_uid: firebaseUid,
          paystack_customer_code: payload.customer?.customer_code || null,
          paystack_reference: payload.reference,
          status: "active",
          plan: String(plan).toLowerCase(),
          billing_cycle: billingCycle,
          billing_provider: "paystack",
          billing_currency: expected.currency,
          billing_country_code: countryCode,
          updated_at: now,
          current_period_start: now,
          current_period_end:
            billingCycle === "annual"
              ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
              : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
        },
        $setOnInsert: { _id: new ObjectId(), created_at: now },
      },
      { upsert: true }
    )

    await users.updateOne(
      { firebase_uid: firebaseUid },
      {
        $set: {
          plan: String(plan).toLowerCase(),
          updated_at: now,
        },
      }
    )
  }

  return NextResponse.json({ received: true, type: event.event })
}
