import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import MapView from './components/MapView.jsx';
import LayerToggle from './components/LayerToggle.jsx';
import InsightsSidebar from './components/InsightsSidebar.jsx';
import { analyzeCity } from './services/api.js';
import { useAuth } from './context/AuthContext.jsx';

const BASEMAP_OPTIONS = [
  { id: 'streets-vector', label: 'Streets', accent: '#0891b2' },
  { id: 'gray-vector', label: 'Light Gray', accent: '#64748b' },
  { id: 'topo-vector', label: 'Topo', accent: '#0f766e' },
  { id: 'hybrid', label: 'Hybrid', accent: '#7c3aed' },
];

export default function App() {
  const { user, logout } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [lastCity, setLastCity] = useState('');
  const [layerVisibility, setLayerVisibility] = useState({
    competitors: true,
    universities: true,
    malls: true,
    top5: true,
    grid: false,
    rentPressure: false,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [insightsCollapsed, setInsightsCollapsed] = useState(false);
  const [basemapId, setBasemapId] = useState('streets-vector');
  const [insightTarget, setInsightTarget] = useState(null);
  const mapRef = useRef(null);

  async function handleLoadHeatmap(lat, lng) {
    if (mapRef.current?.loadRentHeatmap) {
      const res = await mapRef.current.loadRentHeatmap(lat, lng);
      setLayerVisibility((prev) => ({ ...prev, rentPressure: true }));
      return res;
    }
  }

  async function handleAnalyze(payload) {
    setLoading(true);
    setError(null);
    setActiveLocation(null);
    setLastCity(payload.city);
    try {
      const data = await analyzeCity(payload);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  function handleLayerToggle(key) {
    setLayerVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleOpenInsights({ location, context }) {
    setInsightTarget({ location, context });
    setInsightsCollapsed(false);
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[linear-gradient(180deg,#e7fbff_0%,#dff6f7_32%,#edf8ff_100%)] text-slate-900">
      {/* ── Navbar ── */}
      <header className="absolute inset-x-0 top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-white/20 bg-[linear-gradient(105deg,#06b6d4_0%,#22d3ee_100%,#ffffff_100%)] px-4 shadow-[0_4px_24px_rgba(6,182,212,0.2)] sm:px-6">
        <Link to="/" className="shrink-0">
          <span className="text-sm font-bold tracking-[-0.02em] text-white drop-shadow-[0_1px_2px_rgba(0,120,150,0.4)]">
            RestaurantIQ
          </span>
        </Link>

        {/* Map Theme pills */}
        <div className="flex items-center gap-1 rounded-[12px] border border-cyan-200/60 bg-white/25 p-1 backdrop-blur-sm">
          <span className="pl-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-cyan-800/60">
            Map
          </span>
          {BASEMAP_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setBasemapId(opt.id)}
              className={`flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-xs font-medium transition ${
                opt.id === basemapId
                  ? 'bg-white/60 text-cyan-900 shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                  : 'text-cyan-900/60 hover:bg-white/30 hover:text-cyan-900'
              }`}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: opt.accent }}
              />
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden text-xs font-medium text-cyan-900/70 sm:inline">{user?.name}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-cyan-200 bg-white/50 px-3.5 py-1.5 text-xs font-semibold text-cyan-900 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition hover:bg-white/80"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1 pt-14">
        {/* Left sidebar */}
        <div className={`relative flex transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-0' : 'w-[332px] xl:w-[356px]'} shrink-0`}>
          <aside
            className={`absolute inset-0 z-10 overflow-y-auto border-r border-cyan-100/70 bg-[linear-gradient(180deg,rgba(236,254,255,0.94)_0%,rgba(224,247,250,0.9)_100%)] backdrop-blur-xl transition-opacity duration-200 ${
              sidebarCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          >
            <Sidebar
              onAnalyze={handleAnalyze}
              loading={loading}
              results={results}
              error={error}
              onDismissError={() => setError(null)}
              activeLocation={activeLocation}
              onSelectLocation={setActiveLocation}
              onLoadHeatmap={handleLoadHeatmap}
              onOpenInsights={handleOpenInsights}
            />
            {results && (
              <div className="px-4 pb-4">
                <div className="mb-2 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Layers
                </div>
                <LayerToggle layers={layerVisibility} onToggle={handleLayerToggle} />
              </div>
            )}
          </aside>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="absolute -right-3.5 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-100 bg-white shadow-[0_4px_16px_rgba(8,145,178,0.18)] text-slate-500 text-xs transition hover:border-cyan-200 hover:text-slate-900"
          >
            {sidebarCollapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Map */}
        <main className="relative flex-1 min-w-0">
          <MapView
            results={results}
            activeLocation={activeLocation}
            layerVisibility={layerVisibility}
            loading={loading}
            city={lastCity}
            mapRef={mapRef}
            basemapId={basemapId}
          />
        </main>

        {/* Right insights sidebar */}
        {insightTarget && (
          <div className={`relative flex transition-all duration-300 ease-in-out ${insightsCollapsed ? 'w-0' : 'w-[320px] xl:w-[348px]'} shrink-0`}>
            <div
              className={`absolute inset-0 transition-opacity duration-200 ${
                insightsCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              <InsightsSidebar
                target={insightTarget}
                onClose={() => setInsightTarget(null)}
              />
            </div>

            <button
              type="button"
              onClick={() => setInsightsCollapsed((v) => !v)}
              aria-label={insightsCollapsed ? 'Expand insights' : 'Collapse insights'}
              className="absolute -left-3.5 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-purple-100 bg-white shadow-[0_4px_16px_rgba(124,58,237,0.15)] text-slate-500 text-xs transition hover:border-purple-200 hover:text-slate-900"
            >
              {insightsCollapsed ? '‹' : '›'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
