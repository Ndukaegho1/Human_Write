type PythonScorerMode = "light" | "balanced" | "strong"
type PythonConfidence = "low" | "medium" | "high"

type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status?: number; error: string; raw?: unknown }

type HumanizeStats = {
  original_word_count: number
  rewritten_word_count: number
  readability_before: number
  readability_after: number
}

export type PythonHumanizeResponse = {
  success: boolean
  original_text: string
  humanized_text: string
  tone: string
  mode: PythonScorerMode
  stats: HumanizeStats
}

export type PythonDetectSignals = {
  lexical_diversity: number
  sentence_variation: number
  repetition_ratio: number
  burstiness: number
  uniformity_flag: boolean
  punctuation_variation?: number
  transition_repetition?: number
  paragraph_uniformity?: number
}

export type PythonDetectResponse = {
  success: boolean
  ai_score: number
  human_score: number
  confidence: PythonConfidence
  signals: PythonDetectSignals
  verdict: string
  explanation: string
}

type HumanizeRequest = {
  text: string
  tone: string
  mode: PythonScorerMode
  strength: number
  preserve_meaning: boolean
}

type DetectRequest = {
  text: string
}

const PYTHON_TIMEOUT_MS = 12000

function getPythonScorerBaseUrl() {
  return process.env.PYTHON_SCORER_URL?.trim().replace(/\/$/, "") || null
}

async function postToPythonScorer<T>(path: string, payload: Record<string, unknown>): Promise<ServiceResult<T>> {
  const baseUrl = getPythonScorerBaseUrl()
  if (!baseUrl) {
    return { ok: false, error: "PYTHON_SCORER_URL not configured" }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PYTHON_TIMEOUT_MS)
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  try {
    const response = await fetch(`${baseUrl}${normalizedPath}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    const rawBody = await response.text()
    const data = rawBody ? (JSON.parse(rawBody) as T) : null

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: `${response.status} ${response.statusText}`,
        raw: data,
      }
    }

    if (
      !data ||
      (typeof data === "object" &&
        "success" in (data as { success?: unknown }) &&
        (data as { success?: unknown }).success === false)
    ) {
      return {
        ok: false,
        status: response.status,
        error: "Python scorer returned unsuccessful response",
        raw: data,
      }
    }

    return { ok: true, data }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Python scorer request failed"
    return { ok: false, error: message }
  } finally {
    clearTimeout(timeout)
  }
}

export function callPythonHumanize(payload: HumanizeRequest) {
  return postToPythonScorer<PythonHumanizeResponse>("/humanize", payload)
}

export function callPythonDetect(payload: DetectRequest) {
  return postToPythonScorer<PythonDetectResponse>("/detect", payload)
}
