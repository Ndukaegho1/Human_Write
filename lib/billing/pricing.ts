export type BillingCycle = "monthly" | "annual"
export type PlanName = "Free" | "Starter" | "Pro" | "Max" | "Team"
export type PricingTier = "discounted" | "standard" | "premium"

type CountryPricingContext = {
  countryCode: string | null
  tier: PricingTier
  regionLabel: string
  currency: string
  currencySymbol: string
}

const COUNTRY_TO_CURRENCY: Record<string, { currency: string; currencySymbol: string }> = {
  NG: { currency: "NGN", currencySymbol: "₦" },
  GH: { currency: "GHS", currencySymbol: "₵" },
  KE: { currency: "KES", currencySymbol: "KSh" },
  UG: { currency: "UGX", currencySymbol: "USh" },
  TZ: { currency: "TZS", currencySymbol: "TSh" },
  RW: { currency: "RWF", currencySymbol: "RF" },
  ZM: { currency: "ZMW", currencySymbol: "K" },
  IN: { currency: "INR", currencySymbol: "₹" },
  PK: { currency: "PKR", currencySymbol: "₨" },
  BD: { currency: "BDT", currencySymbol: "৳" },
  LK: { currency: "LKR", currencySymbol: "Rs" },
  NP: { currency: "NPR", currencySymbol: "Rs" },
  US: { currency: "USD", currencySymbol: "$" },
  CA: { currency: "CAD", currencySymbol: "CA$" },
  GB: { currency: "GBP", currencySymbol: "£" },
  IE: { currency: "EUR", currencySymbol: "€" },
  DE: { currency: "EUR", currencySymbol: "€" },
  NL: { currency: "EUR", currencySymbol: "€" },
  BE: { currency: "EUR", currencySymbol: "€" },
  LU: { currency: "EUR", currencySymbol: "€" },
  AT: { currency: "EUR", currencySymbol: "€" },
  CH: { currency: "CHF", currencySymbol: "CHF" },
  SE: { currency: "SEK", currencySymbol: "kr" },
  NO: { currency: "NOK", currencySymbol: "kr" },
  DK: { currency: "DKK", currencySymbol: "kr" },
  FI: { currency: "EUR", currencySymbol: "€" },
  IT: { currency: "EUR", currencySymbol: "€" },
  ES: { currency: "EUR", currencySymbol: "€" },
  PT: { currency: "EUR", currencySymbol: "€" },
  AU: { currency: "AUD", currencySymbol: "A$" },
  NZ: { currency: "NZD", currencySymbol: "NZ$" },
  SG: { currency: "SGD", currencySymbol: "S$" },
  JP: { currency: "JPY", currencySymbol: "¥" },
  KR: { currency: "KRW", currencySymbol: "₩" },
  AE: { currency: "AED", currencySymbol: "د.إ" },
}

function getCurrencyInfo(countryCode: string | null) {
  if (!countryCode) return { currency: "USD", currencySymbol: "$" }
  return COUNTRY_TO_CURRENCY[countryCode] ?? { currency: "USD", currencySymbol: "$" }
}

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Africa/Lagos": "NG",
  "Africa/Accra": "GH",
  "Africa/Nairobi": "KE",
  "Africa/Kampala": "UG",
  "Africa/Dar_es_Salaam": "TZ",
  "Africa/Kigali": "RW",
  "Asia/Kolkata": "IN",
  "Asia/Karachi": "PK",
  "Asia/Dhaka": "BD",
  "Asia/Colombo": "LK",
  "Asia/Kathmandu": "NP",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "Europe/London": "GB",
  "Europe/Dublin": "IE",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Vienna": "AT",
  "Europe/Zurich": "CH",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Helsinki": "FI",
  "Europe/Rome": "IT",
  "Europe/Madrid": "ES",
  "Europe/Lisbon": "PT",
  "Australia/Sydney": "AU",
  "Pacific/Auckland": "NZ",
  "Asia/Singapore": "SG",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Dubai": "AE",
}

const DISCOUNTED_COUNTRIES = new Set([
  "NG",
  "GH",
  "KE",
  "UG",
  "TZ",
  "RW",
  "ZM",
  "IN",
  "PK",
  "BD",
  "LK",
  "NP",
])

const PREMIUM_COUNTRIES = new Set([
  "US",
  "CA",
  "GB",
  "IE",
  "DE",
  "FR",
  "NL",
  "BE",
  "LU",
  "AT",
  "CH",
  "SE",
  "NO",
  "DK",
  "FI",
  "IS",
  "IT",
  "ES",
  "PT",
  "AU",
  "NZ",
  "SG",
  "JP",
  "KR",
  "AE",
])

const BASE_PRICES: Record<Exclude<PlanName, "Free">, Record<PricingTier, { monthly: number; annual: number }>> = {
  Starter: {
    discounted: { monthly: 4000, annual: 3200 },
    standard: { monthly: 9, annual: 7 },
    premium: { monthly: 12, annual: 10 },
  },
  Pro: {
    discounted: { monthly: 12000, annual: 10000 },
    standard: { monthly: 29, annual: 24 },
    premium: { monthly: 39, annual: 33 },
  },
  Max: {
    discounted: { monthly: 30000, annual: 25000 },
    standard: { monthly: 79, annual: 65 },
    premium: { monthly: 99, annual: 85 },
  },
  Team: {
    discounted: { monthly: 60000, annual: 50000 },
    standard: { monthly: 149, annual: 119 },
    premium: { monthly: 199, annual: 169 },
  },
}

export function getPricingContext(countryCode?: string | null): CountryPricingContext {
  const normalized = countryCode?.toUpperCase() || null
  const currencyInfo = getCurrencyInfo(normalized)

  if (normalized && DISCOUNTED_COUNTRIES.has(normalized)) {
    return {
      countryCode: normalized,
      tier: "discounted",
      regionLabel: "Lower-cost market pricing",
      ...currencyInfo,
    }
  }

  if (normalized && PREMIUM_COUNTRIES.has(normalized)) {
    return {
      countryCode: normalized,
      tier: "premium",
      regionLabel: "Premium market pricing",
      ...currencyInfo,
    }
  }

  return {
    countryCode: normalized,
    tier: "standard",
    regionLabel: "Standard global pricing",
    ...currencyInfo,
  }
}

export function getPlanPrice(plan: PlanName, cycle: BillingCycle, countryCode?: string | null) {
  if (plan === "Free") {
    return {
      amount: 0,
      displayAmount: 0,
      currency: getPricingContext(countryCode).currency,
      currencySymbol: getPricingContext(countryCode).currencySymbol,
      tier: getPricingContext(countryCode).tier,
    }
  }

  const context = getPricingContext(countryCode)
  const amount = BASE_PRICES[plan][context.tier][cycle]

  return {
    amount,
    displayAmount: amount,
    currency: context.currency,
    currencySymbol: context.currencySymbol,
    tier: context.tier,
  }
}

export function getCountryCodeFromHeaders(headers: Headers) {
  return (
    headers.get("x-country-code") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-client-country") ||
    headers.get("x-forwarded-for-country") ||
    headers.get("x-real-country") ||
    null
  )
}

export function inferCountryCodeFromClientSignals(locale?: string | null, timeZone?: string | null) {
  const regionFromLocale =
    locale
      ?.split(",")
      .map((part) => part.trim())
      .find(Boolean)
      ?.match(/[-_]([A-Za-z]{2})$/)?.[1]
      ?.toUpperCase() || null

  if (regionFromLocale) {
    return regionFromLocale
  }

  if (timeZone && TIMEZONE_TO_COUNTRY[timeZone]) {
    return TIMEZONE_TO_COUNTRY[timeZone]
  }

  return null
}

export async function inferCountryCodeFromIpAddress(ip?: string | null) {
  if (!ip) return null
  const normalized = ip.replace(/^\[|\]$/g, "").trim()
  const cleanIp = normalized.replace(/:\d+$/, "").trim()
  if (!cleanIp || cleanIp === "127.0.0.1" || cleanIp === "::1" || cleanIp === "localhost") return null

  const endpoint = `https://ipapi.co/${encodeURIComponent(cleanIp)}/json/`
  try {
    const response = await fetch(endpoint, { method: "GET", cache: "no-store" })
    if (!response.ok) return null
    const payload = await response.json()
    const country = typeof payload?.country_code === "string" ? payload.country_code.toUpperCase() : null
    if (country && /^[A-Z]{2}$/.test(country)) return country
  } catch {
    // Keep fallback quiet to avoid blocking pricing on geolocation failure
  }

  return null
}
