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

export default function ScoreCard({ location, isActive, onClick, context = {} }) {
  const [saveStatus, setSaveStatus] = useState(null);
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
    saveStatus === 'ok' ? '✅ Saved!' : saveStatus === 'err' ? '❌ Failed' : '💾 Save Location';

  return (
    <div
      onClick={onClick}
      className={`w-full text-left rounded-lg bg-[#1e293b] border border-[#334155] p-3 cursor-pointer transition-colors hover:border-slate-500 ${
        isActive ? 'border-l-4 border-l-[#3b82f6]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {rank}
          </span>
          <span className="text-sm font-semibold text-slate-100">Location #{rank}</span>
        </div>
        <div
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold text-slate-100"
          style={{ borderColor: color }}
        >
          {total}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 mb-3">
        <ScoreBar label="Population" score={s.populationScore} maxScore={20} color="#3b82f6" />
        <ScoreBar label="Income" score={s.incomeScore} maxScore={20} color="#22c55e" />
        <ScoreBar label="Anchors" score={s.anchorScore} maxScore={20} color="#eab308" />
        <ScoreBar label="Competitors" score={s.competitorScore} maxScore={20} color="#ef4444" />
        <ScoreBar label="Foot Traffic" score={s.footScore} maxScore={20} color="#a855f7" />
        <ScoreBar label="Catchment" score={s.catchmentScore} maxScore={20} color="#06b6d4" />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saveStatus !== null}
        className={`w-full text-xs font-medium py-1.5 rounded border transition-colors ${
          saveStatus === 'ok'
            ? 'bg-green-500/20 border-green-500/50 text-green-300'
            : saveStatus === 'err'
              ? 'bg-red-500/20 border-red-500/50 text-red-300'
              : 'bg-[#0f172a] border-[#334155] text-slate-300 hover:border-[#3b82f6] hover:text-white'
        }`}
      >
        {saveLabel}
      </button>
    </div>
  );
}
