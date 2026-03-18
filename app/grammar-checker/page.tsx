"use client"

import { FormEvent, useState } from "react"
import { ScrollReveal } from "@/components/animation/ScrollReveal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type GrammarIssue = {
  issue: string
  suggestion: string
}

type GrammarResponse = {
  correctedText: string
  issues: GrammarIssue[]
}

export default function GrammarCheckerPage() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GrammarResponse | null>(null)

  const runGrammarCheck = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await fetch("/api/grammar-checker", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = (await response.json()) as GrammarResponse
      if (!response.ok || !data.correctedText) throw new Error("Could not run grammar check.")
      setResult(data)
    } catch (err) {
      setError((err as Error).message || "Grammar check failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="section-title accent-heading">Grammar Checker</h1>
          <p className="text-sm text-[#bad8c2]">Fix grammar and clarity while preserving your intended meaning.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.06}>
        <form onSubmit={runGrammarCheck} className="space-y-3">
          <Card className="border-white/20">
            <label htmlFor="grammarText" className="text-sm font-semibold">
              Paste text
            </label>
            <textarea
              id="grammarText"
              className="mt-2 min-h-[220px] w-full rounded-xl border border-white/20 bg-[#08110d] p-4 text-sm outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your draft for grammar and style corrections..."
            />
          </Card>
          <Button type="submit" disabled={loading || text.trim().length < 8}>
            {loading ? "Checking..." : "Run Grammar Check"}
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
              <h2 className="text-lg font-semibold">Corrected Text</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[#cde7d2]">{result.correctedText}</p>
            </Card>
            <Card className="border-white/20">
              <h2 className="text-lg font-semibold">Detected Issues</h2>
              {result.issues.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-[#c6e2cd]">
                  {result.issues.map((item) => (
                    <li key={`${item.issue}-${item.suggestion}`}>
                      {item.issue} {"->"} {item.suggestion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-[#c6e2cd]">No major issues detected.</p>
              )}
            </Card>
          </div>
        </ScrollReveal>
      ) : null}
    </div>
  )
}
