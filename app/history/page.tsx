"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/ScrollReveal"

type HistoryItem = {
  id: string
  originalText: string
  selectedVersionText: string
  aiScorePercent: number
  detectorScore?: number
  createdAt: string
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/history")
        const data = (await response.json()) as { items?: HistoryItem[] }
        if (!response.ok || !Array.isArray(data.items)) throw new Error("Failed to load history.")
        setItems(data.items)
      } catch {
        setError("Could not fetch history yet. Showing empty state.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const removeItem = async (id: string) => {
    await fetch(`/api/history/${id}`, { method: "DELETE" }).then(() => {
      setItems((prev) => prev.filter((x) => x.id !== id))
    })
  }

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="section-title text-[#0F172A]">History</h1>
            <p className="text-sm text-[#475569]">Review prior rewrites and detection checks.</p>
          </div>
          <Link className="inline-flex items-center rounded-full bg-[#28B04D] px-4 py-2 text-sm font-medium text-white hover:bg-[#229640] transition-colors" href="/humanizer">
            New rewrite
          </Link>
        </div>
      </ScrollReveal>

      {error ? (
        <ScrollReveal delay={0.08}>
          <Card className="border-amber-200 bg-amber-50 text-amber-700">{error}</Card>
        </ScrollReveal>
      ) : null}

      {loading ? (
        <ScrollReveal delay={0.08}>
          <Card className="border-[#E2E8F0]">
            <p className="text-[#475569]">Loading history...</p>
          </Card>
        </ScrollReveal>
      ) : items.length === 0 ? (
        <ScrollReveal delay={0.08}>
          <Card className="border-[#E2E8F0]">
            <p className="text-sm text-[#475569]">No history found. Create a rewrite or detection check first.</p>
          </Card>
        </ScrollReveal>
      ) : (
        <section className="space-y-4">
          {items.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.06}>
              <Card className="border-[#E2E8F0]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#64748B]">{new Date(item.createdAt).toLocaleString()}</p>
                    <p className="mt-2 text-sm text-[#0F172A] line-clamp-2">Original: {item.originalText}</p>
                    <p className="mt-2 text-sm text-[#0F172A]">Selected output: {item.selectedVersionText}</p>
                    <p className="mt-2 text-xs text-[#64748B]">AI score: {item.aiScorePercent}%</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      Favorite
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </section>
      )}
    </div>
  )
}
