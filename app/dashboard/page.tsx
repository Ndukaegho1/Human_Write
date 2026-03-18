import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/animation/ScrollReveal"

const cards = [
  { title: "Rewrites this month", value: "0 / 30", helper: "Free plan baseline" },
  { title: "Detector checks", value: "0 / 50", helper: "Based on your current plan" },
  { title: "Voice samples", value: "0", helper: "Saved for personalization" },
]

const actions = [
  ["Open Humanizer", "/humanizer"],
  ["Run AI Detector", "/detector"],
  ["View history", "/history"],
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <ScrollReveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <h1 className="section-title text-[#0F172A]">Dashboard</h1>
            <p className="text-sm text-[#475569]">Your workbench summary and quick actions.</p>
          </div>
          <Link
            className="inline-flex w-full justify-center rounded-full bg-[#28B04D] px-4 py-3 text-sm font-semibold text-white sm:w-auto sm:py-2 hover:bg-[#229640] transition-colors"
            href="/pricing"
          >
            Upgrade to Pro
          </Link>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((item) => (
            <Card key={item.title} className="border-[#E2E8F0]">
              <p className="text-sm text-[#475569]">{item.title}</p>
              <p className="mt-2 text-3xl font-black text-[#0F172A]">{item.value}</p>
              <p className="mt-2 text-xs text-[#64748B]">{item.helper}</p>
            </Card>
          ))}
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.12}>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {actions.map(([label, href]) => (
            <Card key={href} className="border-[#E2E8F0]">
              <p className="text-sm text-[#475569]">Quick action</p>
              <h3 className="mt-2 text-xl font-semibold text-[#0F172A]">{label}</h3>
              <Link className="mt-3 inline-flex w-full justify-center rounded-lg border border-[#0F4C81] px-3 py-2 sm:w-auto text-[#0F4C81] hover:bg-[#0F4C81]/5 transition-colors" href={href}>
                Open
              </Link>
            </Card>
          ))}
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.16}>
        <section>
          <Card className="border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#0F172A]">Recent activity</h2>
            <p className="mt-2 text-sm text-[#475569]">No activity yet. Start with a rewrite or detector check.</p>
          </Card>
        </section>
      </ScrollReveal>
    </div>
  )
}
