"use client"

import { FormEvent, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/ScrollReveal"
import { useLanguage } from "@/lib/i18n"

const MODES = ["standard", "casual", "professional", "concise", "more_human"] as const
const STRENGTHS = ["low", "medium", "high"] as const
type Mode = (typeof MODES)[number]
type Strength = (typeof STRENGTHS)[number]

type Variant = { version: 1 | 2 | 3; text: string; resultId?: string }
type HumanizerResponse = {
  variants: Variant[]
  detectorHints?: string[]
}

export default function HumanizerPage() {
  const language = useLanguage()
  const [sourceText, setSourceText] = useState("")
  const [mode, setMode] = useState<Mode>("standard")
  const [strength, setStrength] = useState<Strength>("medium")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Variant[]>([])
  const [selectedVersion, setSelectedVersion] = useState<number>(1)

  const copy = {
    en: {
      title: "Humanizer",
      subtitle:
        "Transform any AI-generated text into natural, human-sounding content that bypasses AI detection.",
      input: "Input",
      output: "Output",
      placeholder: "Paste your AI-generated text here to transform it into natural, human-like writing...",
      rewriteMode: "Rewrite mode",
      rewriteStrength: "Rewrite strength",
      moreHuman: "more-human",
      generating: "Transforming...",
      generate: "Transform Text Now",
      option: "Version",
      copy: "Copy",
      replaceInput: "Use This Version",
      save: "Save",
      empty: 'Paste your text on the left and click "Transform" to see your humanized results here.',
    },
    fr: {
      title: "Humaniseur",
      subtitle:
        "Choisissez un style et un niveau de force. HumanWrite renvoie trois alternatives naturelles a comparer.",
      input: "Entree",
      output: "Sortie",
      placeholder: "Collez le texte pour le rendre plus naturel et plus humain...",
      rewriteMode: "Mode de reformulation",
      rewriteStrength: "Force de reformulation",
      moreHuman: "plus-humain",
      generating: "Generation...",
      generate: "Generer 3 reformulations",
      option: "Option",
      copy: "Copier",
      replaceInput: "Remplacer l'entree",
      save: "Enregistrer",
      empty: 'Entrez du texte a gauche et cliquez sur "Generer" pour voir les resultats ici.',
    },
    es: {
      title: "Humanizador",
      subtitle:
        "Elige un estilo y un nivel de intensidad. HumanWrite devuelve tres alternativas naturales para comparar.",
      input: "Entrada",
      output: "Salida",
      placeholder: "Pega el texto para que suene mas natural y humano...",
      rewriteMode: "Modo de reescritura",
      rewriteStrength: "Intensidad de reescritura",
      moreHuman: "mas-humano",
      generating: "Generando...",
      generate: "Generar 3 reescrituras",
      option: "Opcion",
      copy: "Copiar",
      replaceInput: "Reemplazar entrada",
      save: "Guardar",
      empty: 'Escribe texto a la izquierda y haz clic en "Generar" para ver los resultados aqui.',
    },
    de: {
      title: "Humanizer",
      subtitle:
        "Wahle Stil und Starke. HumanWrite liefert drei naturlich klingende Alternativen zum Vergleichen.",
      input: "Eingabe",
      output: "Ausgabe",
      placeholder: "Text einfugen, damit er naturlicher und menschlicher klingt...",
      rewriteMode: "Umschreibemodus",
      rewriteStrength: "Umschreibestarke",
      moreHuman: "menschlicher",
      generating: "Wird erstellt...",
      generate: "3 Umschreibungen erstellen",
      option: "Option",
      copy: "Kopieren",
      replaceInput: "Eingabe ersetzen",
      save: "Speichern",
      empty: 'Geben Sie links Text ein und klicken Sie auf "Erstellen", um die Ergebnisse hier zu sehen.',
    },
    pt: {
      title: "Humanizador",
      subtitle:
        "Escolha um estilo e um nivel de intensidade. O HumanWrite retorna tres alternativas naturais para comparar.",
      input: "Entrada",
      output: "Saida",
      placeholder: "Cole o texto para deixa-lo mais natural e humano...",
      rewriteMode: "Modo de reescrita",
      rewriteStrength: "Intensidade da reescrita",
      moreHuman: "mais-humano",
      generating: "Gerando...",
      generate: "Gerar 3 reescritas",
      option: "Opcao",
      copy: "Copiar",
      replaceInput: "Substituir entrada",
      save: "Salvar",
      empty: 'Digite texto a esquerda e clique em "Gerar" para ver os resultados aqui.',
    },
    it: {
      title: "Umanizzatore",
      subtitle:
        "Scegli uno stile e un livello di intensita. HumanWrite restituisce tre alternative naturali da confrontare.",
      input: "Input",
      output: "Output",
      placeholder: "Incolla il testo per renderlo piu naturale e umano...",
      rewriteMode: "Modalita di riscrittura",
      rewriteStrength: "Intensita della riscrittura",
      moreHuman: "piu-umano",
      generating: "Generazione...",
      generate: "Genera 3 riscritture",
      option: "Opzione",
      copy: "Copia",
      replaceInput: "Sostituisci input",
      save: "Salva",
      empty: 'Inserisci il testo a sinistra e fai clic su "Genera" per vedere i risultati qui.',
    },
  }[language]

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          mode,
          strength,
        }),
      })

      const payload = (await response.json().catch(() => null)) as HumanizerResponse | null

      if (!response.ok || !payload?.variants?.length) {
        throw new Error(payload?.detectorHints?.join(", ") || "Humanizer API returned no variants.")
      }

      setResults(payload.variants.slice(0, 3).map((v) => ({ ...v, text: v.text })))
    } catch (err) {
      setError((err as Error).message || "Unable to rewrite this text. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const handleReplace = (text: string) => {
    setSourceText(text)
  }

  const handleSave = async (version: number, text: string, resultId?: string) => {
    if (!resultId) return
    await fetch(`/api/history/${resultId}/save`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ saved: true, version }),
    }).catch(() => {
      // no-op; saving is best effort
    })
  }

  const selectedResult = results.find((r) => r.version === selectedVersion)

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="section-title text-[#0F172A]">{copy.title}</h1>
          <p className="text-sm text-[#475569]">{copy.subtitle}</p>
        </div>
      </ScrollReveal>

      {/* Split Screen Layout */}
      <div className="grid min-h-[520px] gap-6 xl:grid-cols-2 xl:items-stretch">
        {/* Left Panel - Input */}
        <ScrollReveal delay={0.05}>
          <Card className="flex h-full flex-col border-[#E2E8F0]">
            <div className="border-b border-[#E2E8F0] p-4">
              <h2 className="font-semibold text-[#0F172A]">{copy.input}</h2>
            </div>
            
            <div className="flex-1 space-y-4 p-4">
              <textarea
                id="sourceText"
                className="h-56 w-full resize-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm outline-none focus:border-[#0F4C81] sm:h-64 lg:h-72 xl:h-80"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={copy.placeholder}
              />

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{copy.rewriteMode}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {MODES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setMode(item)}
                        className={`rounded-full border px-3 py-1 text-sm transition-all ${
                          mode === item
                            ? "border-[#28B04D] bg-[#28B04D]/10 text-[#28B04D]"
                            : "border-[#E2E8F0] text-[#475569] hover:border-[#28B04D]"
                        }`}
                      >
                        {item === "more_human" ? copy.moreHuman : item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{copy.rewriteStrength}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STRENGTHS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setStrength(item)}
                        className={`rounded-full border px-3 py-1 text-sm transition-all ${
                          strength === item
                            ? "border-[#28B04D] bg-[#28B04D]/10 text-[#28B04D]"
                            : "border-[#E2E8F0] text-[#475569] hover:border-[#28B04D]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] p-4">
              <Button 
                type="submit" 
                disabled={loading || !sourceText.trim()} 
                onClick={submit}
                className="w-full bg-[#28B04D] hover:bg-[#229640]"
              >
                {loading ? copy.generating : copy.generate}
              </Button>
            </div>
          </Card>
        </ScrollReveal>

        {/* Right Panel - Output */}
        <ScrollReveal delay={0.1}>
          <Card className="flex h-full flex-col border-[#E2E8F0]">
            <div className="border-b border-[#E2E8F0] p-4">
              <h2 className="font-semibold text-[#0F172A]">{copy.output}</h2>
            </div>

            {error ? (
              <div className="flex-1 p-4">
                <div className="border border-red-200 bg-red-50 rounded-xl p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <>
                {/* Version Tabs */}
                <div className="border-b border-[#E2E8F0] p-4">
                  <div className="flex flex-wrap gap-2">
                    {results.map((variant) => (
                      <button
                        key={variant.version}
                        onClick={() => setSelectedVersion(variant.version)}
                        className={`min-w-[110px] flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                          selectedVersion === variant.version
                            ? "bg-[#28B04D] border border-[#28B04D] text-white"
                            : "border border-[#E2E8F0] text-[#475569] hover:border-[#28B04D]"
                        }`}
                      >
                        {copy.option} {variant.version}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result Content */}
                <div className="flex-1 p-4">
                  <div className="min-h-[260px] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 overflow-auto xl:h-full">
                    <p className="whitespace-pre-wrap text-sm text-[#475569] leading-relaxed">
                      {selectedResult?.text || "Select an option above"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-[#E2E8F0] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Button 
                      size="sm" 
                      onClick={() => selectedResult && handleCopy(selectedResult.text)}
                      disabled={!selectedResult}
                      className="w-full sm:w-auto bg-[#0F4C81] hover:bg-[#0a3d66]"
                    >
                      {copy.copy}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => selectedResult && handleReplace(selectedResult.text)}
                      disabled={!selectedResult}
                      className="w-full sm:w-auto border-[#E2E8F0]"
                    >
                      {copy.replaceInput}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => selectedResult && handleSave(selectedVersion, selectedResult.text, selectedResult.resultId)}
                      disabled={!selectedResult}
                      className="w-full sm:w-auto"
                    >
                      {copy.save}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 p-4">
                <div className="h-full flex items-center justify-center border border-[#E2E8F0] border-dashed rounded-xl">
                  <p className="text-sm text-[#475569] text-center px-4">
                    {copy.empty}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}
