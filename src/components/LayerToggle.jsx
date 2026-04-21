const LAYERS = [
  { key: 'competitors', label: 'Competitors', color: '#ef4444' },
  { key: 'universities', label: 'Universities', color: '#eab308' },
  { key: 'malls', label: 'Shopping Malls', color: '#a855f7' },
  { key: 'top5', label: 'Top 5 Locations', color: '#22c55e' },
  { key: 'grid', label: 'Candidate Grid', color: '#64748b' },
  { key: 'rentPressure', label: 'Rent Pressure', color: '#a855f7' },
];

export default function LayerToggle({ layers = {}, onToggle }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[16px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(236,254,255,0.72)_100%)] p-3 shadow-[0_16px_32px_rgba(8,145,178,0.14)] backdrop-blur-xl">
      {LAYERS.map((l) => {
        const active = !!layers[l.key];
        return (
          <label
            key={l.key}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-1 text-xs text-slate-700 transition hover:bg-cyan-50/70"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: l.color }}
              />
              {l.label}
            </span>
            <span
              className={`relative inline-block h-5 w-9 rounded-full transition-colors ${
                active ? 'bg-cyan-700' : 'bg-cyan-200'
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle?.(l.key)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span
                className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                  active ? 'translate-x-4' : ''
                }`}
              />
            </span>
          </label>
        );
      })}
    </div>
  );
}
