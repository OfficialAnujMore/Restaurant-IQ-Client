import { useEffect, useState } from 'react';
import { getSavedLocations, deleteLocation } from '../services/api.js';

const RANK_COLORS = {
  1: '#22c55e',
  2: '#84cc16',
  3: '#eab308',
  4: '#f97316',
  5: '#ef4444',
};

export default function SavedPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await getSavedLocations();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id) {
    try {
      await deleteLocation(id);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[16px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(236,254,255,0.72)_100%)] py-6 text-center text-xs text-slate-500 shadow-[0_18px_40px_rgba(8,145,178,0.16)] backdrop-blur-xl">
        Loading saved…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[16px] border border-dashed border-cyan-200 bg-white/70 py-10 text-center text-xs text-slate-500 shadow-[0_18px_40px_rgba(8,145,178,0.12)]">
        No saved locations yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((it) => {
        const color = RANK_COLORS[it.rank] || '#64748b';
        return (
          <div
            key={it._id}
            className="flex items-center gap-3 rounded-[16px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(236,254,255,0.72)_100%)] p-4 shadow-[0_18px_40px_rgba(8,145,178,0.16)] backdrop-blur-xl"
          >
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-[0_10px_20px_rgba(15,23,42,0.14)]"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
            >
              {it.rank ?? '-'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium text-slate-900">
                {it.city || 'Unknown city'}
              </div>
              <div className="truncate text-xs text-slate-500">
                {it.category || '—'} · score {Math.round(it.totalScore ?? 0)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(it._id)}
              className="rounded-full border border-slate-200 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:border-red-200 hover:text-red-500"
              title="Delete"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
