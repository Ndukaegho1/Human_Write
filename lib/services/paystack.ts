import { env } from "@/lib/env"

const PAYSTACK_BASE_URL = "https://api.paystack.co"

type InitializeTransactionPayload = {
  email: string
  amount: number
  callback_url: string
  reference: string
  currency?: string
  metadata?: Record<string, unknown>
}

type PaystackInitializeResponse = {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

type PaystackVerifyResponse = {
  status: boolean
  message: string
  data: {
    reference: string
    amount: number
    status: string
    currency: string
    metadata?: Record<string, unknown>
    customer?: {
      email?: string
    }
  }
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!env.PAYSTACK_SECRET_KEY) throw new Error("PAYSTACK_SECRET_KEY missing")

  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  const data = (await response.json().catch(() => null)) as T | null
  if (!response.ok || !data) {
    throw new Error("Paystack request failed")
  }

  return data
}

export async function initializePaystackTransaction(payload: InitializeTransactionPayload) {
  return paystackFetch<PaystackInitializeResponse>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackFetch<PaystackVerifyResponse>(`/transaction/verify/${reference}`, {
    method: "GET",
  })
}
