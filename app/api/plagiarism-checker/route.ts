import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  text: z.string().min(40).max(15000),
})

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

function buildNgrams(words: string[], size: number) {
  const list: string[] = []
  for (let i = 0; i <= words.length - size; i += 1) list.push(words.slice(i, i + size).join(" "))
  return list
}

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  const text = parsed.data.text
  const normalized = normalize(text)
  const words = normalized.split(" ").filter(Boolean)
  const ngrams = buildNgrams(words, 4)
  const unique = new Set(ngrams)
  const repetitionRatio = ngrams.length ? 1 - unique.size / ngrams.length : 0

  const sentences = splitSentences(text)
  const matches = sentences
    .map((line) => {
      const w = normalize(line).split(" ").filter(Boolean)
      const local = buildNgrams(w, 3)
      const localUnique = new Set(local)
      const lineOverlap = local.length ? Math.round((1 - localUnique.size / local.length) * 100) : 0
      return { text: line, matchPercent: Math.max(0, Math.min(100, lineOverlap)), note: "Pattern overlap estimate" }
    })
    .filter((item) => item.matchPercent >= 35)
    .slice(0, 8)

  const plagiarismRiskPercent = Math.max(
    0,
    Math.min(100, Math.round(repetitionRatio * 100 * 1.35 + matches.length * 4))
  )
  const originalityPercent = Math.max(0, 100 - plagiarismRiskPercent)

  return NextResponse.json({
    originalityPercent,
    plagiarismRiskPercent,
    confidencePercent: 62,
    matches,
    disclaimer:
      "This is an estimate based on internal text-overlap signals. It is not a definitive plagiarism verdict and does not query external proprietary databases in this MVP mode.",
  })
}

