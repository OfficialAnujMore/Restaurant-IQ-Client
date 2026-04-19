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
    return <div className="text-xs text-slate-400 py-4 text-center">Loading saved…</div>;
  }

  if (error) {
    return (
      <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-xs text-slate-400 py-8 text-center border border-dashed border-[#334155] rounded-lg">
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
            className="rounded-lg bg-[#1e293b] border border-[#334155] p-3 flex items-center gap-3"
          >
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: color }}
            >
              {it.rank ?? '-'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-100 truncate">
                {it.city || 'Unknown city'}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {it.category || '—'} · score {Math.round(it.totalScore ?? 0)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(it._id)}
              className="text-slate-400 hover:text-red-400 transition-colors text-sm"
              title="Delete"
            >
              🗑
            </button>
          </div>
        );
      })}
    </div>
  );
}
