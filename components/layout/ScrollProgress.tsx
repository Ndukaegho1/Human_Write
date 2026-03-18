"use client"

import { motion, useScroll } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-[var(--hx-green)] to-[#ffffff]"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
