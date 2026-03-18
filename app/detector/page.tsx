"use client"

import { FormEvent, useState } from "react"
import { CircularGauge } from "@/components/charts/CircularGauge"
import { DisclaimerBanner } from "@/components/legal/DisclaimerBanner"
import { SentenceHighlights } from "@/components/editor/SentenceHighlights"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/ScrollReveal"
import { useLanguage } from "@/lib/i18n"

type DetectorPayload = {
  aiScorePercent: number
  humanScorePercent: number
  confidencePercent: number
  riskLevel: "low" | "medium" | "high"
  flaggedSentences: {
    text: string
    aiScorePercent: number
    reasons: string[]
  }[]
  reasons: string[]
  disclaimer?: string
}

const riskClass = {
  low: "success-pill",
  medium: "medium-pill",
  high: "danger-pill",
}

export default function DetectorPage() {
  const language = useLanguage()
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payload, setPayload] = useState<DetectorPayload | null>(null)

  const copy = {
    en: {
      title: "AI Text Detector",
      subtitle:
        "Detect AI-generated content with advanced analysis. Identify which parts of your text might sound machine-written.",
      paste: "Paste text to analyze",
      placeholder: "Paste your content here to detect if it was written by AI...",
      analyzing: "Analyzing...",
      run: "Detect AI Content",
      invalid: "Could not produce a valid detector result.",
      failed: "Unable to analyze text right now.",
      scoreCard: "Score card",
      aiLikelihood: "AI-likelihood",
      human: "Human",
      confidence: "Confidence",
      overview: "Overview",
      risk: "Risk",
      reasons: "Key indicators:",
      flagged: "Flagged sentences",
      empty:
        "Paste your content and click 'Detect AI Content' to see detailed analysis and scores.",
    },
    fr: {
      title: "Detecteur de texte IA",
      subtitle:
        "Utilisez le detecteur pour une estimation rapide. Les phrases signalees peuvent ameliorer les futures reformulations.",
      paste: "Collez le texte a analyser",
      placeholder: "Collez le texte pour estimer la probabilite IA contre humain...",
      analyzing: "Analyse...",
      run: "Lancer le detecteur",
      invalid: "Impossible de produire un resultat valide.",
      failed: "Analyse indisponible pour le moment.",
      scoreCard: "Carte de score",
      aiLikelihood: "Probabilite IA",
      human: "Humain",
      confidence: "Confiance",
      overview: "Vue d'ensemble",
      risk: "Risque",
      reasons: "Principales raisons :",
      flagged: "Phrases signalees",
      empty:
        "Aucune analyse pour le moment. Collez du texte et lancez le detecteur pour voir les scores.",
    },
    es: {
      title: "Detector de texto IA",
      subtitle:
        "Usa el detector para una comprobacion rapida. Las frases marcadas ayudan a mejorar futuras reescrituras.",
      paste: "Pega el texto para analizar",
      placeholder: "Pega el texto para estimar la probabilidad IA frente a humano...",
      analyzing: "Analizando...",
      run: "Ejecutar detector",
      invalid: "No se pudo generar un resultado valido.",
      failed: "No se puede analizar el texto ahora mismo.",
      scoreCard: "Tarjeta de puntuacion",
      aiLikelihood: "Probabilidad IA",
      human: "Humano",
      confidence: "Confianza",
      overview: "Resumen",
      risk: "Riesgo",
      reasons: "Principales razones:",
      flagged: "Frases marcadas",
      empty:
        "Todavia no hay analisis. Pega texto y ejecuta el detector para ver las puntuaciones.",
    },
    de: {
      title: "KI-Textdetektor",
      subtitle:
        "Nutzen Sie den Detektor fur eine schnelle Wahrscheinlichkeitseinschatzung. Markierte Satze helfen bei kunftigen Umschreibungen.",
      paste: "Text zur Analyse einfugen",
      placeholder: "Text einfugen, um die KI-gegen-Mensch-Wahrscheinlichkeit zu schatzen...",
      analyzing: "Analyse lauft...",
      run: "Detektor starten",
      invalid: "Kein gultiges Ergebnis konnte erstellt werden.",
      failed: "Text kann gerade nicht analysiert werden.",
      scoreCard: "Bewertung",
      aiLikelihood: "KI-Wahrscheinlichkeit",
      human: "Mensch",
      confidence: "Sicherheit",
      overview: "Uberblick",
      risk: "Risiko",
      reasons: "Hauptgrunde:",
      flagged: "Markierte Satze",
      empty:
        "Noch keine Analyse. Fugen Sie Text ein und starten Sie den Detektor, um die Bewertungen zu sehen.",
    },
    pt: {
      title: "Detector de texto IA",
      subtitle:
        "Use o detector para uma verificacao rapida. As frases sinalizadas ajudam a melhorar futuras reescritas.",
      paste: "Cole o texto para analisar",
      placeholder: "Cole o texto para estimar a probabilidade de IA versus humano...",
      analyzing: "Analisando...",
      run: "Executar detector",
      invalid: "Nao foi possivel gerar um resultado valido.",
      failed: "Nao foi possivel analisar o texto agora.",
      scoreCard: "Painel de pontuacao",
      aiLikelihood: "Probabilidade de IA",
      human: "Humano",
      confidence: "Confianca",
      overview: "Visao geral",
      risk: "Risco",
      reasons: "Principais motivos:",
      flagged: "Frases sinalizadas",
      empty:
        "Ainda nao ha analise. Cole o texto e execute o detector para ver as pontuacoes.",
    },
    it: {
      title: "Rilevatore di testo IA",
      subtitle:
        "Usa il rilevatore per un controllo rapido. Le frasi segnalate aiutano a migliorare le future riscritture.",
      paste: "Incolla il testo da analizzare",
      placeholder: "Incolla il testo per stimare la probabilita IA rispetto a umano...",
      analyzing: "Analisi in corso...",
      run: "Avvia rilevatore",
      invalid: "Impossibile produrre un risultato valido.",
      failed: "Impossibile analizzare il testo in questo momento.",
      scoreCard: "Scheda punteggio",
      aiLikelihood: "Probabilita IA",
      human: "Umano",
      confidence: "Affidabilita",
      overview: "Panoramica",
      risk: "Rischio",
      reasons: "Motivi principali:",
      flagged: "Frasi segnalate",
      empty:
        "Nessuna analisi disponibile. Incolla il testo e avvia il rilevatore per vedere i punteggi.",
    },
  }[language]

  const runDetection = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/detector", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = (await response.json()) as DetectorPayload

      if (!response.ok || typeof data.aiScorePercent !== "number" || typeof data.humanScorePercent !== "number") {
        throw new Error(copy.invalid)
      }

      data.humanScorePercent = Math.max(0, Math.min(100, 100 - Math.round(data.aiScorePercent)))
      setPayload(data)
    } catch (err) {
      setError((err as Error).message || copy.failed)
    } finally {
      setLoading(false)
    }
  }

  const aiScore = payload?.aiScorePercent ?? 0
  const humanScore = payload ? 100 - aiScore : 0

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="section-title text-[#0F172A]">{copy.title}</h1>
          <p className="text-sm text-[#475569]">{copy.subtitle}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <DisclaimerBanner />
      </ScrollReveal>

      <ScrollReveal delay={0.12}>
        <form onSubmit={runDetection} className="space-y-3">
          <Card className="border-[#E2E8F0]">
            <label className="text-sm font-semibold text-[#0F172A]" htmlFor="detectorText">
              {copy.paste}
            </label>
            <textarea
              id="detectorText"
              className="mt-2 min-h-[220px] w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm outline-none focus:border-[#0F4C81] sm:min-h-[260px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={copy.placeholder}
            />
          </Card>
          <Button type="submit" disabled={loading || !text.trim()} className="w-full sm:w-auto bg-[#0F4C81] hover:bg-[#0a3d66]">
            {loading ? copy.analyzing : copy.run}
          </Button>
        </form>
      </ScrollReveal>

      {error ? (
        <ScrollReveal delay={0.05}>
          <Card className="border border-red-200 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        </ScrollReveal>
      ) : null}

      {payload ? (
        <ScrollReveal delay={0.14}>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
            <Card className="border-[#E2E8F0]">
              <h2 className="mb-3 text-lg font-semibold text-[#0F172A]">{copy.scoreCard}</h2>
              <div className="flex justify-center">
                <CircularGauge value={aiScore} label={copy.aiLikelihood} />
              </div>
              <p className="mt-4 text-center text-sm leading-6">
                <span className="font-semibold text-[#28B04D]">{copy.human}: {humanScore}%</span>
                {" | "}
                <span className="font-semibold text-[#0F172A]">{copy.confidence}: {payload.confidencePercent}%</span>
              </p>
            </Card>

            <Card className="border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A]">{copy.overview}</h2>
              <p className="mt-1">
                <span className={`inline-flex rounded-full ${riskClass[payload.riskLevel]} mt-1`}>{copy.risk}: {payload.riskLevel}</span>
              </p>
              <p className="mt-4 text-sm text-[#475569]">{copy.reasons}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#475569]">
                {(payload.reasons || []).map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </Card>

            <Card className="lg:col-span-2 border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A]">{copy.flagged}</h2>
              <SentenceHighlights items={payload.flaggedSentences || []} />
            </Card>
          </div>
        </ScrollReveal>
      ) : (
        <ScrollReveal delay={0.14}>
          <Card className="border-[#E2E8F0]">
            <p className="text-sm text-[#475569]">
              {copy.empty}
            </p>
          </Card>
        </ScrollReveal>
      )}
    </div>
  )
}
