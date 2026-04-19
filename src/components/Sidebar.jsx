import { useState, useMemo } from 'react';
import ScoreCard from './ScoreCard.jsx';
import SavedPanel from './SavedPanel.jsx';

const CATEGORIES = [
  'Fast Food',
  'Pizza & Italian',
  'Asian',
  'Mexican',
  'Cafe & Coffee',
  'Healthy',
];

const MENU_BY_CATEGORY = {
  'Fast Food': ['Burgers', 'Fries', 'Nuggets', 'Hot Dogs', 'Milkshakes'],
  'Pizza & Italian': ['Pizza', 'Pasta', 'Calzones', 'Breadsticks'],
  Asian: ['Sushi', 'Ramen', 'Pho', 'Dumplings', 'Boba'],
  Mexican: ['Tacos', 'Burritos', 'Quesadillas', 'Nachos'],
  'Cafe & Coffee': ['Coffee', 'Pastries', 'Sandwiches', 'Smoothies'],
  Healthy: ['Salads', 'Grain Bowls', 'Wraps', 'Juices'],
};

const STRATEGIES = [
  { value: 'gap', label: 'Gap Finder' },
  { value: 'cluster', label: 'Join Hotspot' },
  { value: 'both', label: 'Show Both' },
];

const STRATEGY_HELP = {
  gap: {
    title: 'Gap Finder',
    body: 'Looks for underserved zones where demand signals are strong and direct competition is lighter.',
  },
  cluster: {
    title: 'Hotspot',
    body: 'Looks for proven busy areas where restaurants and activity already cluster together.',
  },
  both: {
    title: 'Show Both',
    body: 'Combines underserved opportunities with established restaurant hotspots for comparison.',
  },
};

export default function Sidebar({
  onAnalyze,
  loading,
  results,
  error,
  onDismissError,
  activeLocation,
  onSelectLocation,
  onLoadHeatmap,
}) {
  const [tab, setTab] = useState('search');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('Fast Food');
  const [menuItems, setMenuItems] = useState([]);
  const [strategy, setStrategy] = useState('gap');

  const availableMenuItems = useMemo(() => MENU_BY_CATEGORY[category] || [], [category]);

  function handleCategoryChange(next) {
    setCategory(next);
    setMenuItems([]);
  }

  function toggleMenuItem(item) {
    setMenuItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!city.trim() || loading) return;
    onAnalyze({ city: city.trim(), category, menuItems, strategy });
  }

  const inputClass =
    'w-full rounded-[10px] border border-cyan-100 bg-white/96 px-4 py-2.5 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100';
  const sectionClass =
    'rounded-[16px] border border-cyan-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(239,252,255,0.78)_100%)] p-4 shadow-[0_16px_28px_rgba(8,145,178,0.12)] backdrop-blur-xl';

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* <header className={sectionClass}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#0891b2_0%,#22c1c3_100%)] text-base text-white shadow-[0_16px_26px_rgba(34,193,195,0.24)]">
            🍔
          </div>
          <div>
            <h1 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-slate-900">
              RestaurantIQ
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              ArcGIS-powered location intelligence
            </p>
          </div>
        </div>
      </header> */}

      <div className="flex gap-1 rounded-[14px] border border-cyan-100/80 bg-white/72 p-1 shadow-[0_10px_24px_rgba(8,145,178,0.12)]">
        {[
          { key: 'search', label: 'Search' },
          { key: 'saved', label: 'Saved' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-[12px] px-3 py-2 text-xs font-medium transition ${
              tab === t.key
                ? 'bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_100%)] text-white shadow-[0_10px_20px_rgba(8,145,178,0.2)]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'search' && (
        <>
          <form onSubmit={handleSubmit} className={`${sectionClass} flex flex-col gap-5`}>
            <div className="space-y-1.5">
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Fullerton, CA"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Restaurant Type
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Menu Items (select all that apply)
              </label>
              <div className="rounded-[10px] border border-cyan-100 bg-white/96 px-2.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
                <div className="flex flex-wrap items-center gap-2">
                  {menuItems.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleMenuItem(item)}
                      className="inline-flex items-center gap-1 rounded-[8px] border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-800"
                    >
                      {item}
                      <span className="text-[0.8rem] leading-none">×</span>
                    </button>
                  ))}
                  {menuItems.length === 0 && (
                    <span className="text-xs text-slate-400">Select menu items below</span>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {availableMenuItems.map((item) => {
                    const active = menuItems.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleMenuItem(item)}
                        className={`rounded-[8px] border px-2.5 py-1.5 text-left text-xs font-medium transition ${
                          active
                            ? 'border-cyan-200 bg-cyan-50 text-cyan-800'
                            : 'border-cyan-100 bg-white text-slate-600 hover:border-cyan-200 hover:text-slate-900'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Strategy
              </label>
              <div className="grid grid-cols-3 gap-1 rounded-[12px] border border-cyan-100 bg-cyan-50/70 p-1">
                {STRATEGIES.map((s) => {
                  const active = strategy === s.value;
                  return (
                    <button
                      type="button"
                      key={s.value}
                      onClick={() => setStrategy(s.value)}
                      className={`flex items-center justify-center rounded-[10px] px-2 py-2.5 text-xs font-medium transition ${
                        active
                          ? 'bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_100%)] text-white shadow-[0_12px_24px_rgba(8,145,178,0.2)]'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {s.label.replace(/^.\s/, '')}
                    </button>
                  );
                })}
              </div>
              <div className="rounded-[12px] border border-cyan-100 bg-white/72 px-3 py-2.5 text-xs leading-5 text-slate-500">
                <span className="font-semibold text-slate-700">
                  {STRATEGY_HELP[strategy].title}:
                </span>{' '}
                {STRATEGY_HELP[strategy].body}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !city.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_52%,#38bdf8_100%)] py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(8,145,178,0.26)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_36px_rgba(8,145,178,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Analyzing...' : '🔍 Find Best Locations'}
            </button>

            {error && (
              <div className="flex items-start gap-2 rounded-[12px] border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700">
                <span className="flex-1">❌ {error}</span>
                <button
                  type="button"
                  onClick={onDismissError}
                  className="text-red-400 transition hover:text-red-700"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}
          </form>

          {results?.top5?.length > 0 && (
            <div className={`${sectionClass} flex flex-col gap-2.5`}>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Top 5 Locations
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="flex flex-col gap-2">
                {results.top5.map((loc) => (
                  <ScoreCard
                    key={loc.id ?? loc.rank}
                    location={loc}
                    isActive={activeLocation?.rank === loc.rank}
                    onClick={() => onSelectLocation(loc)}
                    context={{ city: results.city, category: results.category }}
                    onLoadHeatmap={onLoadHeatmap}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'saved' && <SavedPanel />}
    </div>
  );
}
