"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/animation/ScrollReveal"
import { CheckIcon, XIcon, SparklesIcon, ZapIcon, CrownIcon, UsersIcon, ChevronDownIcon } from "./icons"
import { useLanguage } from "@/lib/i18n"

type BillingCycle = "monthly" | "annual"

interface Plan {
  name: string
  description: string
  monthlyWords: number
  detectorChecks: number
  features: string[]
  cta: boolean
  popular?: boolean
}

type RegionPricing = {
  countryCode: string | null
  tier: "discounted" | "standard" | "premium"
  regionLabel: string
  currency: string
  currencySymbol: string
}

const plans: Plan[] = [
  {
    name: "Free",
    description: "Perfect for trying out HumanWrite",
    monthlyWords: 500,
    detectorChecks: 10,
    features: [
      "Basic rewrite modes",
      "Limited history (7 days)",
      "Standard support",
      "No voice learning",
    ],
    cta: false,
  },
  {
    name: "Starter",
    description: "Great for casual content creators",
    monthlyWords: 5000,
    detectorChecks: 50,
    features: [
      "Core humanizer modes",
      "Saved history (30 days)",
      "Basic personalization",
      "Email support",
    ],
    cta: false,
  },
  {
    name: "Pro",
    description: "For serious writers & professionals",
    monthlyWords: 25000,
    detectorChecks: 200,
    features: [
      "All rewrite modes",
      "Adaptive voice learning",
      "Saved writing samples",
      "Longer text limits",
      "Priority processing",
      "Priority support",
    ],
    cta: true,
    popular: true,
  },
  {
    name: "Max",
    description: "For heavy users & businesses",
    monthlyWords: 100000,
    detectorChecks: 1000,
    features: [
      "Everything in Pro",
      "Advanced voice personalization",
      "Premium usage limits",
      "Fair use optimization",
      "Dedicated support",
    ],
    cta: false,
  },
  {
    name: "Team",
    description: "For agencies & content teams",
    monthlyWords: 250000,
    detectorChecks: 5000,
    features: [
      "Up to 10 seats",
      "Pooled word allowance",
      "Shared team voice profile",
      "Team analytics",
      "Admin controls",
      "Invoice billing",
      "Custom integrations",
    ],
    cta: false,
  },
]

const planPrices: Record<string, { monthly: number; annual: number }> = {
  Free: { monthly: 0, annual: 0 },
  Starter: { monthly: 9, annual: 7 },
  Pro: { monthly: 29, annual: 24 },
  Max: { monthly: 79, annual: 65 },
  Team: { monthly: 149, annual: 119 },
}

const tierPrices: Record<NonNullable<RegionPricing["tier"]>, Record<string, { monthly: number; annual: number }>> = {
  discounted: {
    Free: { monthly: 0, annual: 0 },
    Starter: { monthly: 4000, annual: 3200 },
    Pro: { monthly: 12000, annual: 10000 },
    Max: { monthly: 30000, annual: 25000 },
    Team: { monthly: 60000, annual: 50000 },
  },
  standard: planPrices,
  premium: {
    Free: { monthly: 0, annual: 0 },
    Starter: { monthly: 12, annual: 10 },
    Pro: { monthly: 39, annual: 33 },
    Max: { monthly: 99, annual: 85 },
    Team: { monthly: 199, annual: 169 },
  },
}

const allFeatures = [
  { name: "Monthly words", key: "words" },
  { name: "AI detector checks", key: "detector" },
  { name: "Rewrite modes", key: "modes" },
  { name: "History storage", key: "history" },
  { name: "Voice learning", key: "voice" },
  { name: "Writing samples", key: "samples" },
  { name: "Text length limit", key: "textLimit" },
  { name: "Priority processing", key: "priority" },
  { name: "Team seats", key: "seats" },
  { name: "Team analytics", key: "analytics" },
  { name: "Invoice billing", key: "invoice" },
]

const featureValues: Record<string, Record<string, string | boolean>> = {
  Free: {
    words: "500",
    detector: "10",
    modes: "Basic",
    history: "7 days",
    voice: false,
    samples: false,
    textLimit: "500 words",
    priority: false,
    seats: "1",
    analytics: false,
    invoice: false,
  },
  Starter: {
    words: "5,000",
    detector: "50",
    modes: "Core",
    history: "30 days",
    voice: false,
    samples: "5",
    textLimit: "2,000 words",
    priority: false,
    seats: "1",
    analytics: false,
    invoice: false,
  },
  Pro: {
    words: "25,000",
    detector: "200",
    modes: "All",
    history: "Unlimited",
    voice: true,
    samples: "50",
    textLimit: "10,000 words",
    priority: true,
    seats: "1",
    analytics: false,
    invoice: false,
  },
  Max: {
    words: "100,000",
    detector: "1,000",
    modes: "All",
    history: "Unlimited",
    voice: "Advanced",
    samples: "Unlimited",
    textLimit: "25,000 words",
    priority: true,
    seats: "3",
    analytics: false,
    invoice: false,
  },
  Team: {
    words: "250,000+",
    detector: "5,000+",
    modes: "All",
    history: "Unlimited",
    voice: "Shared",
    samples: "Unlimited",
    textLimit: "Unlimited",
    priority: true,
    seats: "10",
    analytics: true,
    invoice: true,
  },
}

export default function PricingPage() {
  const language = useLanguage()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [showComparison, setShowComparison] = useState(false)
  const [regionPricing, setRegionPricing] = useState<RegionPricing>({
    countryCode: null,
    tier: "standard",
    regionLabel: "Standard global pricing",
    currency: "USD",
    currencySymbol: "$",
  })
  const [detectedCountryLabel, setDetectedCountryLabel] = useState("your location")

  const copy = {
    en: {
      title: "Simple, word-based pricing",
      subtitle: "Pay based on how many words you need to humanize. Upgrade anytime.",
      monthly: "Monthly",
      annual: "Annual",
      save: "Save 20%",
      popular: "Most Popular",
      comparison: "feature comparison",
      show: "Show",
      hide: "Hide",
      faq: "Frequently asked questions",
      usageNote: "Note on usage",
      usageText:
        "HumanWrite usage is designed for writing support and quality improvement. Detector scores are statistical signals and are not legal or academic guarantees. Please use responsibly.",
      regionalText:
        "Regional pricing is estimated from your location and may be adjusted at checkout if our payment provider reports a different billing country.",
    },
    fr: {
      title: "Tarification simple basee sur les mots",
      subtitle: "Payez selon le nombre de mots a humaniser. Passez a un niveau superieur a tout moment.",
      monthly: "Mensuel",
      annual: "Annuel",
      save: "Economisez 20 %",
      popular: "Le plus populaire",
      comparison: "comparaison des fonctionnalites",
      show: "Afficher",
      hide: "Masquer",
      faq: "Questions frequentes",
      usageNote: "Note d'utilisation",
      usageText:
        "HumanWrite est concu pour l'assistance a l'ecriture et l'amelioration de la qualite. Les scores du detecteur sont des signaux statistiques et non des garanties juridiques ou academiques.",
      regionalText:
        "La tarification regionale est estimee selon votre position et peut etre ajustee au paiement si le pays de facturation differe.",
    },
    es: {
      title: "Precios simples por palabra",
      subtitle: "Paga segun cuantas palabras necesites humanizar. Mejora cuando quieras.",
      monthly: "Mensual",
      annual: "Anual",
      save: "Ahorra 20 %",
      popular: "Mas popular",
      comparison: "comparacion de funciones",
      show: "Mostrar",
      hide: "Ocultar",
      faq: "Preguntas frecuentes",
      usageNote: "Nota de uso",
      usageText:
        "HumanWrite esta pensado para apoyo de escritura y mejora de calidad. Las puntuaciones del detector son senales estadisticas y no garantias legales ni academicas.",
      regionalText:
        "El precio regional se estima segun tu ubicacion y puede ajustarse en el pago si el pais de facturacion es diferente.",
    },
    de: {
      title: "Einfache wortbasierte Preise",
      subtitle: "Zahlen Sie danach, wie viele Worter Sie humanisieren mussen. Jederzeit upgraden.",
      monthly: "Monatlich",
      annual: "Jahrlich",
      save: "20 % sparen",
      popular: "Am beliebtesten",
      comparison: "Funktionsvergleich",
      show: "Anzeigen",
      hide: "Ausblenden",
      faq: "Haufige Fragen",
      usageNote: "Hinweis zur Nutzung",
      usageText:
        "HumanWrite ist fur Schreibunterstutzung und Qualitatsverbesserung gedacht. Detektorwerte sind statistische Signale und keine rechtlichen oder akademischen Garantien.",
      regionalText:
        "Die regionale Preisgestaltung wird anhand Ihres Standorts geschatzt und kann beim Checkout angepasst werden.",
    },
    pt: {
      title: "Precos simples por palavra",
      subtitle: "Pague com base em quantas palavras voce precisa humanizar. Faca upgrade quando quiser.",
      monthly: "Mensal",
      annual: "Anual",
      save: "Economize 20%",
      popular: "Mais popular",
      comparison: "comparacao de recursos",
      show: "Mostrar",
      hide: "Ocultar",
      faq: "Perguntas frequentes",
      usageNote: "Nota de uso",
      usageText:
        "O HumanWrite foi criado para apoio a escrita e melhoria de qualidade. As pontuacoes do detector sao sinais estatisticos e nao garantias legais ou academicas.",
      regionalText:
        "O preco regional e estimado pela sua localizacao e pode ser ajustado no checkout se o pais de cobranca for diferente.",
    },
    it: {
      title: "Prezzi semplici basati sulle parole",
      subtitle: "Paga in base a quante parole devi umanizzare. Passa di piano quando vuoi.",
      monthly: "Mensile",
      annual: "Annuale",
      save: "Risparmia il 20%",
      popular: "Piu popolare",
      comparison: "confronto funzionalita",
      show: "Mostra",
      hide: "Nascondi",
      faq: "Domande frequenti",
      usageNote: "Nota sull'uso",
      usageText:
        "HumanWrite e pensato per supporto alla scrittura e miglioramento della qualita. I punteggi del rilevatore sono segnali statistici e non garanzie legali o accademiche.",
      regionalText:
        "Il prezzo regionale e stimato dalla tua posizione e puo essere regolato al checkout se il paese di fatturazione risulta diverso.",
    },
  }[language]

  const priceFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: regionPricing.currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  })

  const formatAmount = (amount: number) => {
    try {
      return priceFormatter.format(amount)
    } catch {
      return `${regionPricing.currencySymbol} ${amount.toLocaleString()}`
    }
  }

  const regionDisplayName = () => {
    if (!regionPricing.countryCode) return detectedCountryLabel
    try {
      const regionDisplay = new Intl.DisplayNames([language], { type: "region" })
      return `${regionDisplay.of(regionPricing.countryCode)} (${regionPricing.countryCode})`
    } catch {
      return `${detectedCountryLabel} (${regionPricing.countryCode})`
    }
  }

  useEffect(() => {
    const locale = typeof navigator !== "undefined" ? navigator.languages?.join(",") || navigator.language || "" : ""
    const timeZone = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone || "" : ""

    fetch("/api/billing/region", {
      cache: "no-store",
      headers: {
        "x-client-locale": locale,
        "x-client-timezone": timeZone,
      },
    })
      .then((response) => response.json())
      .then((data: RegionPricing) => {
        if (data?.tier) setRegionPricing(data)
        if (data?.countryCode) {
          const regionLabel = (() => {
            try {
              const regionDisplay = new Intl.DisplayNames(["en"], { type: "region" })
              return regionDisplay.of(data.countryCode) || data.countryCode
            } catch {
              return data.countryCode
            }
          })()
          setDetectedCountryLabel(regionLabel)
        }
      })
      .catch(() => {
        // keep standard pricing fallback
      })
  }, [])

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="section-title text-[#0F172A]">{copy.title}</h1>
          <p className="mt-3 text-[#475569]">{copy.subtitle}</p>
          <p className="mt-2 text-sm text-[#64748B]">
            {regionPricing.regionLabel}
            {regionPricing.countryCode ? ` for ${regionDisplayName()}` : " for your detected location"}.
          </p>
          <p className="mt-1 text-xs text-[#64748B]">
            Auto-detected billing currency: {regionPricing.currency} ({regionPricing.currencySymbol})
          </p>
        </div>
      </ScrollReveal>

      {/* Billing Toggle */}
      <ScrollReveal delay={0.05}>
        <div className="flex justify-center">
          <div className="inline-flex w-full max-w-md flex-col gap-1 rounded-xl border border-[#E2E8F0] bg-white p-1 sm:w-auto sm:flex-row sm:items-center">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#0F4C81] text-white"
                  : "text-[#475569] hover:text-[#0F4C81]"
              }`}
            >
              {copy.monthly}
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                billingCycle === "annual"
                  ? "bg-[#0F4C81] text-white"
                  : "text-[#475569] hover:text-[#0F4C81]"
              }`}
            >
              {copy.annual}
              <span className="text-xs bg-[#28B04D] text-white px-2 py-0.5 rounded-full">
                {copy.save}
              </span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Plan Cards */}
      <ScrollReveal delay={0.1}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {plans.map((plan) => {
            const prices = tierPrices[regionPricing.tier][plan.name]
            const price = billingCycle === "monthly" ? prices.monthly : prices.annual
            const query = new URLSearchParams({
              plan: plan.name,
              billingCycle,
            })
            if (regionPricing.countryCode) {
              query.set("country", regionPricing.countryCode)
            }
            const href =
              plan.name === "Free"
                ? "/humanizer"
                : `/api/billing/checkout?${query.toString()}`

            return (
              <Link key={plan.name} href={href} className="block">
                <Card
                  className={`relative border-[#E2E8F0] flex flex-col h-full hover:border-[#28B04D] transition-all cursor-pointer ${
                    plan.popular ? "border-[#28B04D] ring-2 ring-[#28B04D]" : ""
                  }`}
                >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#28B04D] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {copy.popular}
                    </span>
                  </div>
                )}

                <div className="p-5 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.name === "Free" && <SparklesIcon className="w-5 h-5 text-[#0F4C81]" />}
                    {plan.name === "Starter" && <ZapIcon className="w-5 h-5 text-[#0F4C81]" />}
                    {plan.name === "Pro" && <CrownIcon className="w-5 h-5 text-[#28B04D]" />}
                    {plan.name === "Max" && <CrownIcon className="w-5 h-5 text-[#F59E0B]" />}
                    {plan.name === "Team" && <UsersIcon className="w-5 h-5 text-[#0F4C81]" />}
                    <h3 className="text-lg font-semibold text-[#0F172A]">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-[#475569] mb-4">{plan.description}</p>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-[#0F172A]">
                      {formatAmount(price)}
                    </span>
                    <span className="text-sm text-[#475569]">
                      /{billingCycle === "annual" ? "month equivalent" : "month"}
                    </span>
                    {billingCycle === "annual" && price > 0 && (
                      <p className="text-xs text-[#64748B] mt-1">
                        Billed {formatAmount(prices.annual * 12)}/year
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-[#475569] mb-4">
                    <span className="font-semibold text-[#0F172A]">{plan.monthlyWords.toLocaleString()}</span> words/month
                    <br />
                    <span className="font-semibold text-[#0F172A]">{plan.detectorChecks}</span> detector checks
                  </div>

                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckIcon className="w-4 h-4 text-[#28B04D] shrink-0 mt-0.5" />
                        <span className="text-[#475569]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
              </Link>
            )
          })}
        </div>
      </ScrollReveal>

      {/* Feature Comparison Toggle */}
      <ScrollReveal delay={0.15}>
        <div className="text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 text-sm text-[#0F4C81] hover:underline transition-colors"
          >
            {showComparison ? copy.hide : copy.show} {copy.comparison}
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showComparison ? "rotate-180" : ""}`} />
          </button>
        </div>
      </ScrollReveal>

      {/* Feature Comparison Table */}
      {showComparison && (
        <ScrollReveal>
          <Card className="overflow-hidden border-[#E2E8F0]">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="text-left p-4 font-semibold text-[#0F172A]">Feature</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="p-4 font-semibold text-center text-[#0F172A]">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature) => (
                    <tr key={feature.key} className="border-b border-[#E2E8F0]">
                      <td className="p-4 text-[#475569]">{feature.name}</td>
                      {plans.map((plan) => {
                        const value = featureValues[plan.name][feature.key]
                        return (
                          <td key={plan.name} className="p-4 text-center">
                            {typeof value === "boolean" ? (
                              value ? (
                                <CheckIcon className="w-5 h-5 text-[#28B04D] mx-auto" />
                              ) : (
                                <XIcon className="w-5 h-5 text-[#94A3B8] mx-auto" />
                              )
                            ) : (
                              <span className="text-[#0F172A]">{value}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </ScrollReveal>
      )}

      {/* FAQ Section */}
      <ScrollReveal delay={0.2}>
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title text-[#0F172A] text-center mb-6">{copy.faq}</h2>
          <div className="space-y-3">
            <details className="border border-[#E2E8F0] rounded-xl p-4 group">
              <summary className="cursor-pointer font-medium text-[#0F172A] flex items-center justify-between list-none">
                <span>How are words counted?</span>
                <ChevronDownIcon className="w-5 h-5 text-[#475569] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-[#475569]">
                Words are counted based on the input text you submit for humanization. The output doesn't count toward your usage. One word is approximately 5 characters including spaces.
              </p>
            </details>

            <details className="border border-[#E2E8F0] rounded-xl p-4 group">
              <summary className="cursor-pointer font-medium text-[#0F172A] flex items-center justify-between list-none">
                <span>What happens if I exceed my word limit?</span>
                <ChevronDownIcon className="w-5 h-5 text-[#475569] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-[#475569]">
                When you approach 80% of your limit, you'll receive a warning. Once exceeded, you can either upgrade to a higher tier or wait until your billing cycle resets.
              </p>
            </details>

            <details className="border border-[#E2E8F0] rounded-xl p-4 group">
              <summary className="cursor-pointer font-medium text-[#0F172A] flex items-center justify-between list-none">
                <span>Can I change plans anytime?</span>
                <ChevronDownIcon className="w-5 h-5 text-[#475569] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-[#475569]">
                Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle.
              </p>
            </details>

            <details className="border border-[#E2E8F0] rounded-xl p-4 group">
              <summary className="cursor-pointer font-medium text-[#0F172A] flex items-center justify-between list-none">
                <span>Is annual billing really 20% off?</span>
                <ChevronDownIcon className="w-5 h-5 text-[#475569] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-[#475569]">
                Yes! Annual billing gives you 2 months free compared to monthly billing. You'll be charged the full annual amount upfront, but you'll save significantly over the year.
              </p>
            </details>
          </div>
        </div>
      </ScrollReveal>

      {/* Usage Note */}
      <ScrollReveal delay={0.25}>
        <Card className="border-[#E2E8F0] max-w-2xl mx-auto">
          <h3 className="font-semibold text-[#0F172A]">{copy.usageNote}</h3>
          <p className="mt-2 text-sm text-[#475569]">
            {copy.usageText}
          </p>
          <p className="mt-3 text-sm text-[#64748B]">
            {copy.regionalText}
          </p>
        </Card>
      </ScrollReveal>
    </div>
  )
}
