import { z } from "zod"

const schema = z.object({
  MONGODB_URI: z.string().default(""),
  FIREBASE_PROJECT_ID: z.string().default(""),
  FIREBASE_CLIENT_EMAIL: z.string().default(""),
  FIREBASE_PRIVATE_KEY: z.string().default(""),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().default(""),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().default(""),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().default(""),
  OPENAI_API_KEY: z.string().default(""),
  PAYSTACK_SECRET_KEY: z.string().default(""),
  PAYSTACK_WEBHOOK_SECRET: z.string().default(""),
  PAYSTACK_CURRENCY: z.string().default("NGN"),
  STRIPE_SECRET_KEY: z.string().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().default(""),
  STRIPE_PRICE_ID_PRO: z.string().default(""),
  APP_URL: z.string().url().default("http://localhost:3000"),
})

export const env = schema.parse(process.env)
export const hasMongoConfig = Boolean(env.MONGODB_URI)
export const hasFirebaseAdminConfig = Boolean(
  env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY
)
