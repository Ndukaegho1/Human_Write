export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v))
}

export function humanizeBoolean(v: unknown): boolean {
  return v === true || v === "true"
}
