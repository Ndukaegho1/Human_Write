import { NextRequest, NextResponse } from "next/server"
import {
  getCountryCodeFromHeaders,
  getPricingContext,
  inferCountryCodeFromIpAddress,
  inferCountryCodeFromClientSignals,
} from "@/lib/billing/pricing"

export const dynamic = "force-dynamic"
export const revalidate = 0

function getIpFromHeaders(headers: Headers) {
  const xForwarded = headers.get("x-forwarded-for")
  if (xForwarded) return xForwarded.split(",")[0]?.trim() || null

  return (
    headers.get("x-real-ip") ||
    headers.get("x-client-ip") ||
    headers.get("cf-connecting-ip") ||
    null
  )
}

export async function GET(req: NextRequest) {
  const searchCountry = req.nextUrl.searchParams.get("country")
  const clientLocale = req.headers.get("x-client-locale")
  const clientTimeZone = req.headers.get("x-client-timezone")
  const headerCountry = getCountryCodeFromHeaders(req.headers)
  const ipFromHeaders = getIpFromHeaders(req.headers)
  const ipFromRequest = (req as unknown as { ip?: string }).ip
  const resolvedIp = ipFromHeaders || ipFromRequest
  const ipCountry =
    headerCountry ? null : await inferCountryCodeFromIpAddress(resolvedIp)

  const countryCode =
    searchCountry ||
    headerCountry ||
    ipCountry ||
    inferCountryCodeFromClientSignals(clientLocale, clientTimeZone)
  const pricing = getPricingContext(countryCode)

  return NextResponse.json(
    {
      countryCode: pricing.countryCode,
      tier: pricing.tier,
      regionLabel: pricing.regionLabel,
      currency: pricing.currency,
      currencySymbol: pricing.currencySymbol,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  )
}
