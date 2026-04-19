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
    <div className="flex flex-col gap-2 bg-[#1e293b] border border-[#334155] rounded-lg p-3">
      {LAYERS.map((l) => {
        const active = !!layers[l.key];
        return (
          <label
            key={l.key}
            className="flex items-center justify-between gap-3 text-xs text-slate-200 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: l.color }}
              />
              {l.label}
            </span>
            <span
              className={`relative inline-block w-8 h-4 rounded-full transition-colors ${
                active ? 'bg-[#3b82f6]' : 'bg-[#334155]'
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle?.(l.key)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span
                className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
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
