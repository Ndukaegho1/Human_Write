import { z } from "zod"

export const humanizeSchema = z.object({
  text: z.string().min(20, "minimum 20 chars").max(6000, "max 6000 chars"),
  mode: z.enum(["standard", "casual", "professional", "concise", "more_human"]),
  strength: z.enum(["low", "medium", "high"]),
})

export const detectorSchema = z.object({
  text: z.string().min(40).max(8000),
})

export const voiceProfileSchema = z.object({
  tone_preferences: z.array(z.string()).optional().default([]),
  banned_phrases: z.array(z.string()).optional().default([]),
  preferred_vocabulary: z.array(z.string()).optional().default([]),
  sentence_style: z.enum(["short", "balanced", "long"]).default("balanced"),
  warmth: z.enum(["low", "medium", "high"]).default("medium"),
})

export const writingSampleSchema = z.object({
  title: z.string().max(80).optional(),
  content: z.string().min(20).max(5000),
  source: z.enum(["upload", "manual"]).default("manual"),
})
