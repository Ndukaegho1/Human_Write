import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import OpenAI from "openai"
import { env } from "@/lib/env"

const schema = z.object({
  text: z.string().min(30).max(12000),
})

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function fallbackSummary(text: string) {
  const sentences = splitSentences(text)
  const summary = sentences.slice(0, 2).join(" ")
  const bullets = sentences.slice(0, 4).map((item) => item.replace(/\s+/g, " "))
  return { summary: summary || text.slice(0, 280), bullets }
}

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  if (!env.OPENAI_API_KEY) {
    return NextResponse.json(fallbackSummary(parsed.data.text))
  }

  try {
    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY })
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Summarize user text. Return strict JSON: {"summary":"...","bullets":["...","...","..."]}. Keep meaning accurate.',
        },
        { role: "user", content: parsed.data.text },
      ],
    })

    const raw = completion.choices[0]?.message?.content
    const obj = raw ? JSON.parse(raw) : null
    const summary = typeof obj?.summary === "string" ? obj.summary : fallbackSummary(parsed.data.text).summary
    const bullets = Array.isArray(obj?.bullets)
      ? obj.bullets.map((item: unknown) => String(item)).slice(0, 6)
      : fallbackSummary(parsed.data.text).bullets
    return NextResponse.json({ summary, bullets })
  } catch {
    return NextResponse.json(fallbackSummary(parsed.data.text))
  }
}

