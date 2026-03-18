import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import OpenAI from "openai"
import { env } from "@/lib/env"

const schema = z.object({
  text: z.string().min(8).max(12000),
})

function fallbackGrammar(text: string) {
  const correctedText = text
    .replace(/\s{2,}/g, " ")
    .replace(/\bi\b/g, "I")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim()

  const issues: { issue: string; suggestion: string }[] = []
  if (text.includes("  ")) issues.push({ issue: "Double spaces", suggestion: "Use a single space between words." })
  if (/\bi\b/.test(text)) issues.push({ issue: "Lowercase pronoun I", suggestion: 'Use uppercase "I".' })
  return { correctedText, issues }
}

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  if (!env.OPENAI_API_KEY) {
    return NextResponse.json(fallbackGrammar(parsed.data.text))
  }

  try {
    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY })
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Fix grammar while preserving meaning. Return strict JSON: {"correctedText":"...","issues":[{"issue":"...","suggestion":"..."}]}.',
        },
        { role: "user", content: parsed.data.text },
      ],
    })

    const raw = completion.choices[0]?.message?.content
    const obj = raw ? JSON.parse(raw) : null
    const correctedText =
      typeof obj?.correctedText === "string" ? obj.correctedText : fallbackGrammar(parsed.data.text).correctedText
    const issues = Array.isArray(obj?.issues)
      ? obj.issues
          .map((item: any) => ({ issue: String(item?.issue ?? ""), suggestion: String(item?.suggestion ?? "") }))
          .filter((item: { issue: string; suggestion: string }) => item.issue && item.suggestion)
          .slice(0, 10)
      : fallbackGrammar(parsed.data.text).issues
    return NextResponse.json({ correctedText, issues })
  } catch {
    return NextResponse.json(fallbackGrammar(parsed.data.text))
  }
}

