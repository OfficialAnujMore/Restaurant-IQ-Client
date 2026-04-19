import { useState } from 'react';
import ScoreBar from './ScoreBar.jsx';
import { saveLocation } from '../services/api.js';

const RANK_COLORS = {
  1: '#22c55e',
  2: '#84cc16',
  3: '#eab308',
  4: '#f97316',
  5: '#ef4444',
};

export default function ScoreCard({ location, isActive, onClick, context = {}, onLoadHeatmap, onOpenInsights }) {
  const [saveStatus, setSaveStatus] = useState(null);
  const [heatmapStatus, setHeatmapStatus] = useState('idle');
  const rank = location.rank ?? '-';
  const color = RANK_COLORS[rank] || '#64748b';
  const s = location.scores || {};
  const total = Math.round(location.totalScore ?? 0);

  async function handleSave(e) {
    e.stopPropagation();
    try {
      await saveLocation({
        rank: location.rank,
        lat: location.lat,
        lng: location.lng,
        city: context.city,
        category: context.category,
        totalScore: location.totalScore,
        scores: s,
        population: location.population,
        medianIncome: location.medianIncome,
        nearestAnchor: location.nearestAnchor,
        competitorCount: location.competitorCount,
      });
      setSaveStatus('ok');
    } catch {
      setSaveStatus('err');
    } finally {
      setTimeout(() => setSaveStatus(null), 2000);
    }
  }

  const saveLabel =
    saveStatus === 'ok' ? 'Saved' : saveStatus === 'err' ? 'Failed' : 'Save Location';
  const hasPopulation = location.population !== undefined && location.population !== null;
  const hasIncome = location.medianIncome !== undefined && location.medianIncome !== null;
  const locationMeta = [
    {
      label: 'Income',
      value: hasIncome ? `$${location.medianIncome.toLocaleString()}` : 'Data unavailable',
    },
    {
      label: 'Anchor',
      value: location.nearestAnchor || '—',
    },
    {
      label: 'Competitors',
      value:
        location.competitorCount !== undefined && location.competitorCount !== null
          ? String(location.competitorCount)
          : '—',
    },
  ];

  return (
    <div
      onClick={onClick}
      className={`w-full cursor-pointer rounded-[14px] border p-3 text-left transition duration-200 hover:-translate-y-[1px] ${
        isActive
          ? 'border-cyan-200 bg-[linear-gradient(180deg,#f3feff_0%,#ebfdff_100%)] shadow-[0_20px_36px_rgba(8,145,178,0.16)]'
          : 'border-cyan-100 bg-[rgba(255,255,255,0.88)] shadow-[0_14px_30px_rgba(8,145,178,0.1)] hover:border-cyan-200'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-[0_10px_20px_rgba(15,23,42,0.18)]"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
          >
            {rank}
          </span>
          <div>
            <span className="block text-sm font-semibold text-slate-900">Location #{rank}</span>
            <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
              Recommended zone
            </span>
          </div>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full border bg-white text-xs font-bold text-slate-700"
          style={{ borderColor: `${color}55` }}
        >
          {total}
        </div>
      </div>

      <div className="mb-2 rounded-[10px] border border-cyan-100 bg-cyan-50/70 px-3 py-2">
        <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Population
        </div>
        <div className="mt-0.5 text-sm font-semibold text-slate-800">
          {hasPopulation ? location.population.toLocaleString() : 'Data unavailable'}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-x-2 gap-y-1.5">
        <ScoreBar label="Population" score={s.populationScore} maxScore={20} color="#3b82f6" />
        <ScoreBar label="Income" score={s.incomeScore} maxScore={20} color="#22c55e" />
        <ScoreBar label="Anchors" score={s.anchorScore} maxScore={20} color="#eab308" />
        <ScoreBar label="Competitors" score={s.competitorScore} maxScore={20} color="#ef4444" />
        <ScoreBar label="Foot Traffic" score={s.footScore} maxScore={20} color="#a855f7" />
        <ScoreBar label="Catchment" score={s.catchmentScore} maxScore={20} color="#06b6d4" />
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        {locationMeta.map((item) => (
          <div
            key={item.label}
            className="rounded-[10px] border border-cyan-100 bg-white/72 px-2.5 py-2"
          >
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {item.label}
            </div>
            <div className="mt-1 truncate text-xs font-medium text-slate-700">{item.value}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saveStatus !== null}
        className={`w-full rounded-[10px] border px-3 py-2.5 text-xs font-medium transition ${
          saveStatus === 'ok'
            ? 'border-green-200 bg-green-50 text-green-700'
            : saveStatus === 'err'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-cyan-100 bg-cyan-50/60 text-slate-600 hover:border-cyan-200 hover:bg-white hover:text-slate-900'
        }`}
      >
        {saveLabel}
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onOpenInsights?.({ location, context }); }}
        className="mt-2 w-full rounded-[10px] border border-purple-100 bg-purple-50/60 px-3 py-2.5 text-xs font-medium text-purple-700 transition hover:border-purple-200 hover:bg-white hover:text-purple-900"
      >
        Generate Insights
      </button>

      {onLoadHeatmap && (
        <button
          type="button"
          onClick={async (e) => {
            e.stopPropagation();
            setHeatmapStatus('loading');
            try {
              await onLoadHeatmap(location.lat, location.lng);
              setHeatmapStatus('success');
              setTimeout(() => setHeatmapStatus('idle'), 2000);
            } catch {
              setHeatmapStatus('error');
              setTimeout(() => setHeatmapStatus('idle'), 2000);
            }
          }}
          disabled={heatmapStatus === 'loading'}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px 12px',
            background:
              heatmapStatus === 'success'
                ? '#16a34a'
                : heatmapStatus === 'error'
                  ? '#dc2626'
                  : 'linear-gradient(135deg,#0f766e 0%,#0891b2 100%)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '16px',
            color: 'white',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: heatmapStatus === 'loading' ? 'not-allowed' : 'pointer',
            opacity: heatmapStatus === 'loading' ? 0.7 : 1,
            boxShadow: '0 16px 30px rgba(8,145,178,0.2)',
            transition: 'all 0.2s',
          }}
        >
          {heatmapStatus === 'idle' && 'Show Rent Pressure Map'}
          {heatmapStatus === 'loading' && 'Analyzing...'}
          {heatmapStatus === 'success' && 'Loaded'}
          {heatmapStatus === 'error' && 'Failed - Try Again'}
        </button>
      )}
    </div>
  );
}
