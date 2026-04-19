export default function ScoreBar({ label, score = 0, maxScore = 20, value, color = '#3b82f6' }) {
  const pct = Math.max(0, Math.min(100, (score / maxScore) * 100));
  const display = value ?? `${Math.round(score)}/${maxScore}`;

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[0.65rem] text-slate-400 leading-tight">{label}</span>
      <div className="h-1 w-full rounded-full bg-[#0f172a] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[0.65rem] text-slate-500 leading-tight">{display}</span>
    </div>
  );
}
