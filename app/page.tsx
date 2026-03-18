"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/ScrollReveal"

// Icons
const Wand2Icon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h0"/><path d="M17.8 6.2L19 5"/><path d="M3 21l9-9"/><path d="M12.2 6.2L11 5"/>
  </svg>
)

const ScanEyeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><path d="M2 12s3 7 10 7"/>
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)

const CopyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
)

const MODES = ["standard", "casual", "professional", "concise", "more_human"] as const
const STRENGTHS = ["low", "medium", "high"] as const
type Mode = (typeof MODES)[number]
type Strength = (typeof STRENGTHS)[number]

type Variant = { version: 1 | 2 | 3; text: string; resultId?: string }
type HumanizerResponse = {
  variants: Variant[]
  detectorHints?: string[]
}

type DetectorPayload = {
  aiScorePercent: number
  humanScorePercent: number
  confidencePercent: number
  riskLevel: "low" | "medium" | "high"
  flaggedSentences: { text: string; aiScorePercent: number; reasons: string[] }[]
  reasons: string[]
}

const riskClass = {
  low: "success-pill",
  medium: "medium-pill",
  high: "danger-pill",
}

export default function HomePage() {
  const [sourceText, setSourceText] = useState("")
  const [mode, setMode] = useState<Mode>("standard")
  const [strength, setStrength] = useState<Strength>("medium")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Variant[]>([])
  
  const [detectorText, setDetectorText] = useState("")
  const [detectorLoading, setDetectorLoading] = useState(false)
  const [detectorError, setDetectorError] = useState<string | null>(null)
  const [detectorResult, setDetectorResult] = useState<DetectorPayload | null>(null)

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: sourceText, mode, strength }),
      })

      const payload = (await response.json().catch(() => null)) as HumanizerResponse | null
      if (!response.ok || !payload?.variants?.length) {
        throw new Error(payload?.detectorHints?.join(", ") || "Humanizer API returned no variants.")
      }

      setResults(payload.variants.slice(0, 3).map((v) => ({ ...v, text: v.text })))
    } catch (err) {
      setError((err as Error).message || "Unable to rewrite this text. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const runDetector = async () => {
    setDetectorLoading(true)
    setDetectorError(null)

    try {
      const response = await fetch("/api/detector", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: detectorText }),
      })

      const payload = (await response.json()) as DetectorPayload
      if (!response.ok || typeof payload.aiScorePercent !== "number") {
        throw new Error("Could not produce a valid detector result.")
      }

      payload.humanScorePercent = Math.max(0, 100 - Math.round(payload.aiScorePercent))
      setDetectorResult(payload)
    } catch (err) {
      setDetectorError((err as Error).message || "Unable to analyze this text. Please try again.")
    } finally {
      setDetectorLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <ScrollReveal>
        <section className="glass-card p-6 md:p-8 floating-orb">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="max-w-3xl">
              <p className="hero-pill">AI Writing Enhancement</p>
              <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-black accent-heading">
                Transform Your Writing from Robotic to Remarkable
              </h1>
              <p className="mt-3 text-base text-[#475569]">
                Bypass AI detection, humanize your content, and write with confidence. Join thousands of writers creating authentic, engaging content that connects with readers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/humanizer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#28B04D] px-4 py-3 font-medium text-white hover:bg-[#229640] transition-colors"
              >
                <SparklesIcon className="w-4 h-4" />
                Start Humanizing Free
              </Link>
              <Link
                href="/detector"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F4C81] px-4 py-3 text-sm font-medium text-[#0F4C81] hover:bg-[#0F4C81]/5 transition-colors"
              >
                <ScanEyeIcon className="w-4 h-4" />
                Check AI Score
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Tools Grid */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Humanizer Card */}
        <ScrollReveal delay={0.05}>
          <Card className="border-[#E2E8F0]">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#28B04D]/10 rounded-xl flex items-center justify-center">
                  <Wand2Icon className="w-5 h-5 text-[#28B04D]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A]">Humanizer</h2>
                  <p className="text-sm text-[#475569]">Transform AI-generated text into natural, human-sounding content</p>
                </div>
              </div>

              <textarea
                className="w-full min-h-[180px] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm outline-none focus:border-[#0F4C81]"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Paste your text here to transform it into natural, human-like writing..."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-[#0F172A] mb-2">Mode</p>
                  <div className="flex flex-wrap gap-2">
                    {MODES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setMode(item)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          mode === item
                            ? "border-[#28B04D] bg-[#28B04D]/10 text-[#28B04D]"
                            : "border-[#E2E8F0] text-[#475569] hover:border-[#28B04D]"
                        }`}
                      >
                        {item === "more_human" ? "more-human" : item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#0F172A] mb-2">Strength</p>
                  <div className="flex gap-2">
                    {STRENGTHS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setStrength(item)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          strength === item
                            ? "border-[#28B04D] bg-[#28B04D]/10 text-[#28B04D]"
                            : "border-[#E2E8F0] text-[#475569] hover:border-[#28B04D]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => submit()} 
                disabled={loading || !sourceText.trim()}
                className="w-full bg-[#28B04D] hover:bg-[#229640]"
              >
                {loading ? "Rewriting..." : "Transform Text Now"}
              </Button>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((variant) => (
                    <div key={variant.version} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#0F172A]">Version {variant.version}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(variant.text)}
                          className="text-xs text-[#0F4C81] hover:underline flex items-center gap-1"
                        >
                          <CopyIcon className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-[#475569]">{variant.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#E2E8F0] p-5 text-sm text-[#475569] text-center">
                  Your humanized results will appear here. Choose the best option and copy it!
                </div>
              )}
            </div>
          </Card>
        </ScrollReveal>

        {/* Detector Card */}
        <ScrollReveal delay={0.1}>
          <Card className="border-[#E2E8F0]">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0F4C81]/10 rounded-xl flex items-center justify-center">
                  <ScanEyeIcon className="w-5 h-5 text-[#0F4C81]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A]">AI Detector</h2>
                  <p className="text-sm text-[#475569]">Detect AI-generated content and ensure your writing passes scrutiny</p>
                </div>
              </div>

              <textarea
                className="w-full min-h-[180px] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm outline-none focus:border-[#0F4C81]"
                value={detectorText}
                onChange={(e) => setDetectorText(e.target.value)}
                placeholder="Paste your content here to analyze if it sounds AI-written..."
              />

              <Button 
                onClick={runDetector} 
                disabled={detectorLoading || !detectorText.trim()}
                className="w-full bg-[#0F4C81] hover:bg-[#0a3d66]"
              >
                {detectorLoading ? "Analyzing..." : "Detect AI Content"}
              </Button>

              {detectorError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {detectorError}
                </div>
              )}

              {detectorResult ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
                      <p className="text-xs uppercase tracking-wide text-[#475569]">AI Score</p>
                      <p className="mt-1 text-2xl font-bold text-[#0F4C81]">{detectorResult.aiScorePercent}%</p>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
                      <p className="text-xs uppercase tracking-wide text-[#475569]">Human Score</p>
                      <p className="mt-1 text-2xl font-bold text-[#28B04D]">{detectorResult.humanScorePercent}%</p>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
                      <p className="text-xs uppercase tracking-wide text-[#475569]">Confidence</p>
                      <p className="mt-1 text-2xl font-bold text-[#0F172A]">{detectorResult.confidencePercent}%</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex rounded-full ${riskClass[detectorResult.riskLevel]}`}>
                      Risk: {detectorResult.riskLevel}
                    </span>
                    <span className="text-xs text-[#475569]">
                      Results are probabilistic estimates — use as one factor in your assessment.
                    </span>
                  </div>

                  {detectorResult.reasons.length > 0 && (
                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <p className="text-sm font-semibold text-[#0F172A] mb-2">Why it might be AI-generated</p>
                      <ul className="list-disc pl-5 text-sm text-[#475569] space-y-1">
                        {detectorResult.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#E2E8F0] p-5 text-sm text-[#475569] text-center">
                  Your AI detection results will appear here with detailed analysis.
                </div>
              )}
            </div>
          </Card>
        </ScrollReveal>
      </section>
    </div>
  )
}
