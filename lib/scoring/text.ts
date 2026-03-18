export const SentenceSplitter = {
  split(text: string) {
    const raw = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
    return raw.length ? raw : [text.trim()]
  },
}

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .match(/\b[\p{L}\p{N}][\p{L}\p{N}'-]*\b/gu) ?? []
}
