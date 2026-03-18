import Link from "next/link"

const footerColumns: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: "Core Tools",
    links: [
      ["Humanizer", "/humanizer"],
      ["AI Detector", "/detector"],
    ],
  },
  {
    title: "Plans",
    links: [
      ["Pricing", "/pricing"],
      ["Free Plan", "/pricing"],
      ["Pro Plan", "/pricing"],
      ["For Teams", "/pricing"],
      ["Billing Settings", "/settings"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Trust Center", "/trust-center"],
      ["Careers", "/careers"],
      ["Help Center", "/help-center"],
      ["Contact Us", "/contact-us"],
      ["Resources", "/resources"],
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--hx-border)]/70 bg-[var(--hx-footer-bg)] px-4 py-10 text-[var(--hx-footer-text)] md:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-card)] p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--hx-footer-muted)]">HumanWrite</p>
              <h3 className="mt-2 text-2xl font-semibold">Write naturally, confidently, and in your own voice.</h3>
            </div>
            <Link
              href="/auth"
              className="w-full rounded-xl bg-[var(--hx-green)] px-5 py-3 text-center text-sm font-semibold text-[#15240c] transition hover:bg-[var(--hx-green-strong)] sm:w-auto"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-3">
              <h3 className="text-lg font-semibold">{column.title}</h3>
              <ul className="space-y-2 text-[15px] text-[var(--hx-footer-muted)]">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="transition hover:text-[var(--hx-green)]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--hx-border)] pt-5 text-sm text-[var(--hx-footer-muted)] md:flex-row md:items-center md:justify-between">
          <p>(c) {new Date().getFullYear()} HumanWrite. Built for better writing, not deception.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/trust-center" className="transition hover:text-[var(--hx-green)]">
              Privacy
            </Link>
            <Link href="/trust-center" className="transition hover:text-[var(--hx-green)]">
              Terms
            </Link>
            <Link href="/contact-us" className="transition hover:text-[var(--hx-green)]">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
