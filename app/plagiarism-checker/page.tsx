"use client"

import { FormEvent, useState } from "react"
import { ScrollReveal } from "@/components/animation/ScrollReveal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type MatchItem = {
  text: string
  matchPercent: number
  note: string
}

type PlagiarismResponse = {
  originalityPercent: number
  plagiarismRiskPercent: number
  confidencePercent: number
  matches: MatchItem[]
  disclaimer: string
}

export default function PlagiarismCheckerPage() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PlagiarismResponse | null>(null)

  const runCheck = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await fetch("/api/plagiarism-checker", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = (await response.json()) as PlagiarismResponse
      if (!response.ok || typeof data.originalityPercent !== "number") {
        throw new Error("Could not run plagiarism check.")
      }
      setResult(data)
    } catch (err) {
      setError((err as Error).message || "Plagiarism check failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="section-title accent-heading">Plagiarism Checker</h1>
          <p className="text-sm text-[#bad8c2]">Estimate originality risk with sentence-level overlap hints.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.06}>
        <form onSubmit={runCheck} className="space-y-3">
          <Card className="border-white/20">
            <label htmlFor="plagiarismText" className="text-sm font-semibold">
              Paste text
            </label>
            <textarea
              id="plagiarismText"
              className="mt-2 min-h-[220px] w-full rounded-xl border border-white/20 bg-[#08110d] p-4 text-sm outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste text to estimate originality and overlap risk..."
            />
          </Card>
          <Button type="submit" disabled={loading || text.trim().length < 40}>
            {loading ? "Checking..." : "Run Plagiarism Check"}
          </Button>
        </form>
      </ScrollReveal>

      {error ? (
        <ScrollReveal delay={0.08}>
          <Card className="border-rose-300/30 bg-rose-500/10">
            <p className="text-sm text-rose-100">{error}</p>
          </Card>
        </ScrollReveal>
      ) : null}

      {result ? (
        <ScrollReveal delay={0.1}>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-white/20">
              <h2 className="text-lg font-semibold">Score</h2>
              <p className="mt-2 text-sm text-[#d6efda]">Originality: {result.originalityPercent}%</p>
              <p className="text-sm text-[#d6efda]">Plagiarism risk: {result.plagiarismRiskPercent}%</p>
              <p className="text-sm text-[#d6efda]">Confidence: {result.confidencePercent}%</p>
              <p className="mt-3 text-xs text-[#b8d5be]">{result.disclaimer}</p>
            </Card>
            <Card className="border-white/20">
              <h2 className="text-lg font-semibold">Potential Matches</h2>
              {result.matches.length ? (
                <ul className="mt-2 space-y-2 text-sm text-[#c6e2cd]">
                  {result.matches.map((item) => (
                    <li key={`${item.text}-${item.matchPercent}`} className="rounded-lg border border-white/10 p-3">
                      <p className="text-xs text-[#dbf4de]">Match: {item.matchPercent}%</p>
                      <p className="mt-1">{item.text}</p>
                      <p className="mt-1 text-xs text-[#a8c7b0]">{item.note}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-[#c6e2cd]">No major overlap patterns detected.</p>
              )}
            </Card>
          </div>
        </ScrollReveal>
      ) : null}
    </div>
  )
}

