export function CircularGauge({ value, label }: { value: number; label: string }) {
  const safe = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-28 w-28 place-items-center sm:h-36 sm:w-36">
        <div className="absolute inset-0 rounded-full bg-slate-900/80" />
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: `conic-gradient(var(--hx-green) ${safe}%, rgba(255,255,255,0.07) ${safe}% 100%)`,
          }}
        />
        <div className="absolute inset-6 rounded-full bg-[#070f0c]" />
        <div className="relative z-10 text-center">
          <p className="text-2xl font-bold sm:text-3xl">{safe}%</p>
          <p className="max-w-[72px] text-[11px] leading-tight text-slate-400 sm:max-w-none sm:text-xs">{label}</p>
        </div>
      </div>
    </div>
  )
}
