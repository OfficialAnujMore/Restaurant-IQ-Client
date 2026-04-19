export default function ScoreBar({ label, score = 0, maxScore = 20, value, color = '#3b82f6' }) {
  const pct = Math.max(0, Math.min(100, (score / maxScore) * 100));
  const display = value ?? `${Math.round(score)}/${maxScore}`;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.64rem] leading-tight text-slate-500">{label}</span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-cyan-100/70">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[0.64rem] leading-tight text-slate-400">{display}</span>
    </div>
  );
}
