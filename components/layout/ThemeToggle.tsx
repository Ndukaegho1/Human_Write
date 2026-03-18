"use client"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem("hw-theme")
    const isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches
    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  return (
    <button
      onClick={() => {
        const next = !dark
        setDark(next)
        document.documentElement.classList.toggle("dark", next)
        localStorage.setItem("hw-theme", next ? "dark" : "light")
      }}
      className="rounded-full border border-[var(--hx-border)] px-3 py-1 text-xs text-[var(--hx-nav-text)] hover:border-[var(--hx-green)] hover:text-[var(--hx-green)]"
    >
      {dark ? "Switch to Light" : "Switch to Dark"}
    </button>
  )
}
