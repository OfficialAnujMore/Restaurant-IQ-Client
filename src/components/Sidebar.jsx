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
  { value: 'gap', label: '🎯 Gap Finder' },
  { value: 'cluster', label: '🔥 Join Hotspot' },
  { value: 'both', label: '⚖️ Show Both' },
];

export default function Sidebar({
  onAnalyze,
  loading,
  results,
  error,
  onDismissError,
  activeLocation,
  onSelectLocation,
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
    'w-full rounded-md bg-[#0f172a] border border-[#334155] px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]';

  return (
    <div className="p-5 flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          🍔 RestaurantIQ
        </h1>
        <p className="text-xs text-slate-400 mt-1">ArcGIS-powered location intelligence</p>
      </header>

      <div className="flex gap-1 bg-[#0f172a] border border-[#334155] rounded-full p-0.5">
        {[
          { key: 'search', label: '🔍 Search' },
          { key: 'saved', label: '📌 Saved' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 text-xs py-1.5 rounded-full transition-colors ${
              tab === t.key ? 'bg-[#3b82f6] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'search' && (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Fullerton, CA"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
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

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Menu Items (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {availableMenuItems.map((item) => {
                  const active = menuItems.includes(item);
                  return (
                    <label
                      key={item}
                      className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded border cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#1e293b] border-[#3b82f6] text-slate-100'
                          : 'bg-[#0f172a] border-[#334155] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleMenuItem(item)}
                        className="accent-[#3b82f6]"
                      />
                      {item}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Strategy</label>
              <div className="flex gap-1.5">
                {STRATEGIES.map((s) => {
                  const active = strategy === s.value;
                  return (
                    <button
                      type="button"
                      key={s.value}
                      onClick={() => setStrategy(s.value)}
                      className={`flex-1 text-xs px-2 py-2 rounded-full border transition-colors ${
                        active
                          ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                          : 'bg-[#1e293b] border-[#334155] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !city.trim()}
              className="w-full rounded-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 flex items-center justify-center gap-2 transition-colors"
            >
              {loading && (
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Analyzing...' : '🔍 Find Best Locations'}
            </button>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
                <span className="flex-1">❌ {error}</span>
                <button
                  type="button"
                  onClick={onDismissError}
                  className="text-red-300 hover:text-red-100"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}
          </form>

          {results?.top5?.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-[#334155]" />
                <span className="text-xs uppercase tracking-wider text-slate-400">
                  Top 5 Locations
                </span>
                <div className="h-px flex-1 bg-[#334155]" />
              </div>
              <div className="flex flex-col gap-2">
                {results.top5.map((loc) => (
                  <ScoreCard
                    key={loc.id ?? loc.rank}
                    location={loc}
                    isActive={activeLocation?.rank === loc.rank}
                    onClick={() => onSelectLocation(loc)}
                    context={{ city: results.city, category: results.category }}
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
