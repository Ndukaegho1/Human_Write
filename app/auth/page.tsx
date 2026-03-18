import { AuthForm } from "@/components/auth/AuthForm"
import { ScrollReveal } from "@/components/animation/ScrollReveal"

export default function AuthPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1.1fr_1fr]">
      <ScrollReveal>
        <section className="glass-card floating-orb p-8">
          <p className="hero-pill">Welcome back</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight accent-heading">Log in or Get Started</h1>
          <p className="mt-3 max-w-md text-sm text-[var(--hx-muted)]">
            Access HumanWrite with a simple account flow for Humanizer and AI Detector.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[var(--hx-nav-text)]">
            <li className="inline-flex items-center gap-2 rounded-xl border border-[var(--hx-border)] px-3 py-2">Fast rewrite workflow</li>
            <li className="inline-flex items-center gap-2 rounded-xl border border-[var(--hx-border)] px-3 py-2">Adaptive voice profile</li>
            <li className="inline-flex items-center gap-2 rounded-xl border border-[var(--hx-border)] px-3 py-2">Detection + history tracking</li>
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.06}>
        <section className="glass-card p-6 md:p-8">
          <AuthForm />
        </section>
      </ScrollReveal>
    </div>
  )
}
