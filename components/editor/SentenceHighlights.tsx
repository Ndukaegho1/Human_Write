export function SentenceHighlights({
  items,
}: {
  items: { text: string; aiScorePercent: number; reasons: string[] }[]
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.text} className="rounded-xl border border-amber-300/35 bg-amber-300/5 p-4">
          <p className="break-words text-sm leading-6 text-[#f4e6c8]">{item.text}</p>
          <p className="mt-1 text-xs text-amber-200">AI score: {item.aiScorePercent}%</p>
          <p className="break-words text-xs leading-5 text-amber-200">Reasons: {item.reasons.join(", ")}</p>
        </div>
      ))}
    </div>
  )
}
