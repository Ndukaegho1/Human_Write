import { Button } from "@/components/ui/button"

export function DualTextPanel({
  original,
  variants,
  onCopy,
  onReplace,
  onSave,
}: {
  original: string
  variants: { version: 1 | 2 | 3; text: string; resultId?: string }[]
  onCopy: (text: string) => void
  onReplace: (text: string) => void
  onSave: (version: number, text: string, resultId?: string) => void
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <article className="glass-card border-white/20 p-4">
        <h3 className="mb-2 font-semibold">Original</h3>
        <textarea
          className="h-72 w-full rounded-xl border border-white/20 bg-[#08110d] p-4 text-sm"
          value={original}
          readOnly
        />
      </article>
      <article className="space-y-4">
        {variants.map((v) => (
          <div key={v.version} className="glass-card border-white/20 p-4">
            <h4 className="mb-2 text-sm font-semibold">Rewrite #{v.version}</h4>
            <p className="min-h-20 whitespace-pre-wrap text-sm text-[#cde6d1]">{v.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => onCopy(v.text)}>
                Copy
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onReplace(v.text)}>
                Replace
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onSave(v.version, v.text, v.resultId)}>
                Save
              </Button>
            </div>
          </div>
        ))}
      </article>
    </section>
  )
}
