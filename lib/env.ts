import { z } from "zod"

const schema = z.object({
  MONGODB_URI: z.string().min(1),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().min(1),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
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
