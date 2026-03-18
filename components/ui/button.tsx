import type { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "outline"
  size?: "sm" | "md"
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const base = "rounded-xl font-medium transition duration-200 border disabled:opacity-50 disabled:cursor-not-allowed"
  const pad = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"
  const look =
    variant === "primary"
      ? "bg-[var(--hx-green)] text-[#08100d] border-transparent hover:bg-[var(--hx-green-strong)]"
      : variant === "outline"
      ? "bg-white text-[#0F172A] border-[#CBD5E1] hover:bg-[#F8FAFC]"
      : variant === "danger"
      ? "border-rose-400/30 text-rose-200 bg-rose-500/20 hover:bg-rose-500/30"
      : "bg-transparent text-[#ecfff3] border-white/20 hover:border-[var(--hx-green)]/50 hover:bg-[var(--hx-green)]/10"
  return (
    <button {...props} className={`${base} ${pad} ${look} ${className || ""}`}>
      {children}
    </button>
  )
}
