import { ObjectId } from "mongodb"

export type Plan = "free" | "pro"
export type Role = "user" | "admin"
export type HumanizerMode = "standard" | "casual" | "professional" | "concise" | "more_human"
export type RewriteStrength = "low" | "medium" | "high"
export type RiskLevel = "low" | "medium" | "high"
export type UsageAction = "rewrite" | "detect"
export type SentenceStyle = "short" | "balanced" | "long"

export interface UserDoc {
  _id: ObjectId
  firebase_uid: string
  email: string
  display_name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  plan: Plan
  role: Role
  created_at: Date
  updated_at: Date
  metadata?: Record<string, unknown>
}

export interface SubscriptionDoc {
  _id: ObjectId
  user_id: ObjectId
  firebase_uid: string
  stripe_customer_id: string
  stripe_subscription_id?: string
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete"
  plan: Plan
  current_period_start: Date
  current_period_end: Date
  created_at: Date
  updated_at: Date
}

export interface RewriteRequestDoc {
  _id: ObjectId
  user_id: ObjectId
  firebase_uid: string
  input_text: string
  mode: HumanizerMode
  strength: RewriteStrength
  detected_tone?: string[]
  source?: "web" | "api"
  status: "pending" | "done" | "failed"
  created_at: Date
  latency_ms?: number
  request_tokens?: number
}

export interface RewriteResultDoc {
  _id: ObjectId
  request_id: ObjectId
  user_id: ObjectId
  firebase_uid: string
  version: 1 | 2 | 3
  output_text: string
  ranking: {
    naturalness: number
    clarity: number
    style_match: number
    final_score: number
  }
  saved: boolean
  is_favorite: boolean
  created_at: Date
}

export interface VoiceProfileDoc {
  _id: ObjectId
  user_id: ObjectId
  firebase_uid: string
  tone_preferences: string[]
  banned_phrases: string[]
  preferred_vocabulary: string[]
  sentence_style: SentenceStyle
  warmth: "low" | "medium" | "high"
  updated_at: Date
}

export interface WritingSampleDoc {
  _id: ObjectId
  user_id: ObjectId
  firebase_uid: string
  title?: string
  content: string
  embedding?: number[]
  summary?: string
  source: "upload" | "manual"
  created_at: Date
}

export interface DetectorRequestDoc {
  _id: ObjectId
  user_id: ObjectId
  firebase_uid: string
  input_text: string
  ai_score_percent: number
  human_score_percent: number
  confidence_percent: number
  risk_level: RiskLevel
  flagged_sentences: {
    text: string
    ai_score_percent: number
    reasons: string[]
  }[]
  reasons: string[]
  disclaimer: string
  latency_ms?: number
  created_at: Date
  created_by_pipeline: "heuristic" | "python_service"
}

export interface UsageLogDoc {
  _id: ObjectId
  user_id: ObjectId
  firebase_uid: string
  action: UsageAction
  tokens: number
  model?: "gpt-4o" | "gpt-4o-mini" | "heuristic"
  request_id?: ObjectId
  created_at: Date
  plan_snapshot: Plan
  status: "success" | "blocked" | "error"
  latency_ms?: number
  error_code?: string
  ip_hash?: string
  user_agent_hash?: string
}

export interface FeedbackDoc {
  _id: ObjectId
  user_id: ObjectId
  firebase_uid: string
  target_type: "rewrite_result" | "detector_request"
  target_id: ObjectId
  rating: "like" | "dislike"
  selected_version?: 1 | 2 | 3
  notes?: string
  created_at: Date
}
