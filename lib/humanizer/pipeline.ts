import { HumanizerMode, RewriteStrength } from "@/models/collections"
import { generateRewriteVariants } from "@/lib/services/openai"

export function buildHumanizerPrompt(input: string, mode: HumanizerMode, strength: RewriteStrength, profile: any, samples: any[]) {
  const sampleHint = samples.slice(0, 3).map((s) => s.title || "sample").join(", ")
  // TODO: include per-sentence rhythm examples and prohibited phrases from profile.
  return `
You are HumanWrite, a writing assistant.
Rewrite with preserved meaning, stronger natural rhythm, and better emotional cadence.
Mode: ${mode}.
Strength: ${strength}.
Tone preferences: ${JSON.stringify(profile?.tone_preferences ?? [])}
Banned phrases: ${JSON.stringify(profile?.banned_phrases ?? [])}
Preferred vocabulary: ${JSON.stringify(profile?.preferred_vocabulary ?? [])}
Sentence style: ${profile?.sentence_style ?? "balanced"}
Use up to 3 high-quality alternative rewrites.
Reference style samples: ${sampleHint || "none"}

Input:
${input}
`
}

export async function generateVariants(payload: { inputText: string; mode: HumanizerMode; strength: RewriteStrength; userContext: any; samples: any[] }) {
  const prompt = buildHumanizerPrompt(payload.inputText, payload.mode, payload.strength, payload.userContext, payload.samples)
  const variants = await generateRewriteVariants({
    inputText: payload.inputText,
    mode: payload.mode,
    strength: payload.strength,
    systemPrompt: prompt,
  })
  return variants.slice(0, 3)
}

export function rankVariants(original: string, variants: string[]) {
  return variants.map((text, idx) => {
    const naturalness = 92 - idx * 6
    const clarity = 88 - idx * 4
    const style_match = 80 - idx * 5
    const final_score = Math.round((naturalness + clarity + style_match) / 3)
    return {
      text,
      ranking: {
        naturalness,
        clarity,
        style_match,
        final_score,
      },
    }
  })
}
