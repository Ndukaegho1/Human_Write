import OpenAI from "openai"
import { env } from "@/lib/env"

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null

export async function createEmbedding(text: string): Promise<number[] | null> {
  if (!client) return null
  const r = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  })
  return r.data?.[0]?.embedding ?? null
}

export async function similarityVectorSearch(_: number[], candidates: number[]): Promise<number> {
  // Placeholder for cosine similarity in later vector db or Atlas vector index.
  if (!_.length || !candidates.length) return 0
  const a = _
  const b = candidates
  const n = Math.min(a.length, b.length)
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < n; i++) {
    dot += a[i]! * b[i]!
    normA += a[i]! * a[i]!
    normB += b[i]! * b[i]!
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}
