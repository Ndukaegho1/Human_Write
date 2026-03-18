"use client"

import { FormEvent, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/ScrollReveal"

const toneOptions = ["warm", "balanced", "direct", "formal", "empathetic"]
const styleOptions = ["short sentences", "mixed rhythm", "descriptive", "concise", "storytelling"]

export default function VoiceProfilePage() {
  const [tonePrefs, setTonePrefs] = useState("balanced")
  const [bannedPhrases, setBannedPhrases] = useState("")
  const [vocabulary, setVocabulary] = useState("")
  const [sentenceStyle, setSentenceStyle] = useState("mixed rhythm")
  const [sampleText, setSampleText] = useState("")
  const [samples, setSamples] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const response = await fetch("/api/voice-profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tone: tonePrefs,
        bannedPhrases: bannedPhrases.split("\n").map((p) => p.trim()).filter(Boolean),
        preferredVocabulary: vocabulary.split(",").map((p) => p.trim()).filter(Boolean),
        sentenceStyle,
      }),
    })
    setMessage(response.ok ? "Profile saved." : "Unable to save profile. Try again.")
  }

  const uploadSample = async (e: FormEvent) => {
    e.preventDefault()
    if (!sampleText.trim()) return

    const response = await fetch("/api/writing-samples", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sampleText }),
    })
    if (!response.ok) {
      setMessage("Unable to upload sample. Try again.")
      return
    }
    setSamples((prev) => [sampleText, ...prev])
    setSampleText("")
    setMessage("Sample uploaded.")
  }

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="section-title text-[#0F172A]">My Voice Profile</h1>
          <p className="text-sm text-[#475569]">Personalize future rewrites by storing preferences and writing examples.</p>
        </div>
      </ScrollReveal>

      <div className="grid gap-4 md:grid-cols-2">
        <ScrollReveal delay={0.05}>
          <Card className="border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#0F172A]">Tone & style controls</h2>
            <form onSubmit={saveProfile} className="space-y-3">
              <label className="mt-3 block text-sm font-medium text-[#0F172A]">Preferred tone</label>
              <select
                value={tonePrefs}
                onChange={(e) => setTonePrefs(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-[#0F172A]"
              >
                {toneOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label className="mt-4 block text-sm font-medium text-[#0F172A]">Sentence style</label>
              <select
                value={sentenceStyle}
                onChange={(e) => setSentenceStyle(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-[#0F172A]"
              >
                {styleOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label className="mt-4 block text-sm font-medium text-[#0F172A]">Banned phrases (one per line)</label>
              <textarea
                value={bannedPhrases}
                onChange={(e) => setBannedPhrases(e.target.value)}
                className="h-24 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-sm text-[#0F172A]"
                placeholder="e.g. in my opinion"
              />

              <label className="mt-4 block text-sm font-medium text-[#0F172A]">Preferred vocabulary (comma-separated)</label>
              <input
                value={vocabulary}
                onChange={(e) => setVocabulary(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-[#0F172A]"
                placeholder="e.g. streamline, concise, practical"
              />

              <Button type="submit" className="mt-4 bg-[#28B04D] hover:bg-[#229640]">
                Save profile
              </Button>
            </form>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card className="border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#0F172A]">Writing sample upload</h2>
            <p className="mt-2 text-sm text-[#475569]">Add real writing samples so rankers can match your tone better.</p>
            <form onSubmit={uploadSample} className="space-y-3">
              <textarea
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                className="mt-3 h-40 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-sm text-[#0F172A]"
                placeholder="Paste one strong writing sample..."
              />
              <Button type="submit" className="bg-[#0F4C81] hover:bg-[#0a3d66]">Upload sample</Button>
            </form>

            <div className="mt-5">
              <h3 className="text-sm font-semibold text-[#0F172A]">Uploaded samples</h3>
              {samples.length === 0 ? (
                <p className="mt-2 text-sm text-[#475569]">No samples yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {samples.map((sample, index) => (
                    <li key={`${sample}-${index}`} className="rounded-lg border border-[#E2E8F0] p-2 text-sm text-[#475569]">
                      {sample.slice(0, 130)}...
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {message ? <p className="text-sm text-[#28B04D]">{message}</p> : null}
    </div>
  )
}
