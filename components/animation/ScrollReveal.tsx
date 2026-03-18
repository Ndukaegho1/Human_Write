"use client"

import { motion, useInView } from "framer-motion"
import { ReactNode, useRef } from "react"

type MarginType = `${number}px ${number}px ${number}px ${number}px`

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  rootMargin?: MarginType
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  duration = 0.48,
  rootMargin = "0px 0px -120px 0px" as MarginType,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const inView = useInView(ref, {
    margin: rootMargin,
    amount: 0.08,
    once: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
