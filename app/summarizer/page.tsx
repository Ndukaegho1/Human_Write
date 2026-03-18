"use client"

import { FormEvent, useState } from "react"
import { ScrollReveal } from "@/components/animation/ScrollReveal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type SummarizerResponse = {
  summary: string
  bullets: string[]
}

export default function SummarizerPage() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SummarizerResponse | null>(null)

  const runSummarizer = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await fetch("/api/summarizer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = (await response.json()) as SummarizerResponse
      if (!response.ok || !data.summary) throw new Error("Could not summarize this text.")
      setResult(data)
    } catch (err) {
      setError((err as Error).message || "Summarizer failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="section-title accent-heading">Summarizer</h1>
          <p className="text-sm text-[#bad8c2]">Create a concise summary and key bullets from long text.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.06}>
        <form onSubmit={runSummarizer} className="space-y-3">
          <Card className="border-white/20">
            <label htmlFor="summarizerText" className="text-sm font-semibold">
              Paste text
            </label>
            <textarea
              id="summarizerText"
              className="mt-2 min-h-[220px] w-full rounded-xl border border-white/20 bg-[#08110d] p-4 text-sm outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste article, report, or notes to summarize..."
            />
          </Card>
          <Button type="submit" disabled={loading || text.trim().length < 30}>
            {loading ? "Summarizing..." : "Generate Summary"}
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
          <Card className="border-white/20">
            <h2 className="text-lg font-semibold">Summary</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-[#cde7d2]">{result.summary}</p>
            <h3 className="mt-5 text-sm font-semibold text-[#ddf5df]">Key points</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-[#c6e2cd]">
              {result.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        </ScrollReveal>
      ) : null}
    </div>
  )
}

