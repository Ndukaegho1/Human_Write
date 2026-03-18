import type { HTMLAttributes } from "react"

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section
      {...props}
      className={`glass-card p-4 sm:p-5 lg:p-6 ${className ?? ""}`}
    >
      {children}
    </section>
  )
}
