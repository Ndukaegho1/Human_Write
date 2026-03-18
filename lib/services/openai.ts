import OpenAI from "openai"
import { HumanizerMode, RewriteStrength } from "@/models/collections"
import { env } from "@/lib/env"

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null

export async function generateRewriteVariants(params: {
  inputText: string
  mode: HumanizerMode
  strength: RewriteStrength
  systemPrompt: string
}): Promise<string[]> {
  if (!client) {
    return [
      "OpenAI key missing: this is a local placeholder rewrite variant #1.",
      "OpenAI key missing: this is a local placeholder rewrite variant #2.",
      "OpenAI key missing: this is a local placeholder rewrite variant #3.",
    ]
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: params.strength === "high" ? 0.8 : params.strength === "medium" ? 0.6 : 0.4,
    messages: [
      { role: "system", content: params.systemPrompt },
      {
        role: "user",
        content: `Rewrite in 3 variants, preserve meaning. Input:\n\n${params.inputText}\n\nMode=${params.mode} | Strength=${params.strength}`,
      },
    ],
    n: 3,
  })

  return (
    completion.choices
      .map((choice) => choice.message?.content?.trim())
      .filter(Boolean) as string[]
  )
}
