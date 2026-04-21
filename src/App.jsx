import { useRef, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import MapView from './components/MapView.jsx';
import LayerToggle from './components/LayerToggle.jsx';
import InsightsSidebar from './components/InsightsSidebar.jsx';
import Navbar from './components/Navbar.jsx';
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

  const navItems = [
    {
      label: 'Home',
      to: '/',
      className:
        'hidden rounded-full border border-slate-900/12 bg-white/28 px-4 py-2 text-xs font-medium text-slate-900 transition hover:bg-white/40 md:inline-flex',
      mobileClassName:
        'rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white',
    },
    {
      label: 'Sign Out',
      type: 'button',
      onClick: logout,
      className:
        'rounded-full border border-[#f4ead7]/70 bg-[#f4ead7] px-4 py-2 text-xs font-semibold text-[#6c5332] shadow-[0_10px_24px_rgba(8,145,178,0.14)] transition hover:bg-[#f8f0e2]',
      mobileClassName:
        'rounded-2xl border border-white/30 bg-white/86 px-4 py-3 text-left text-sm font-semibold text-cyan-900',
    },
  ];

  const desktopCenter = (
    <div className="hidden items-center gap-1 rounded-full border border-white/24 bg-white/12 p-1.5 backdrop-blur-sm lg:flex">
      <span className="pl-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/70">
        Map
      </span>
      {BASEMAP_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setBasemapId(opt.id)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            opt.id === basemapId
              ? 'bg-white/88 text-cyan-900 shadow-[0_10px_24px_rgba(8,145,178,0.14)]'
              : 'text-white hover:bg-white/16'
          }`}
        >
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: opt.accent }}
          />
          {opt.label}
        </button>
      ))}
    </div>
  );

  const mobilePanel = (
    <div className="border-t border-white/15 px-4 py-3 lg:hidden sm:px-6">
      <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/24 bg-white/12 p-1.5 backdrop-blur-sm">
        <span className="pl-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/70">
          Map
        </span>
        {BASEMAP_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setBasemapId(opt.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
              opt.id === basemapId
                ? 'bg-white/88 text-cyan-900 shadow-[0_10px_24px_rgba(8,145,178,0.14)]'
                : 'text-white hover:bg-white/16'
            }`}
          >
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: opt.accent }}
            />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[linear-gradient(180deg,#e7fbff_0%,#dff6f7_32%,#edf8ff_100%)] text-slate-900">
      <Navbar
        containerClassName="absolute inset-x-0 top-0 z-20"
        wrapperClassName="flex h-[73px] items-center justify-between gap-4 px-4 sm:px-6"
        brandTextClassName="text-white"
        desktopCenter={desktopCenter}
        mobilePanel={mobilePanel}
        rightItems={[
          {
            label: user?.name || '',
            type: 'text',
            className: 'hidden text-xs font-medium text-slate-900 sm:inline',
          },
          ...navItems,
        ]}
        mobileMenuItems={navItems}
      />

      <div className="flex min-h-0 flex-1 pt-[118px] lg:pt-[73px]">
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
          <div className={`relative flex min-h-0 transition-all duration-300 ease-in-out ${insightsCollapsed ? 'w-0' : 'w-[320px] xl:w-[348px]'} shrink-0`}>
            <div
              className={`absolute inset-0 min-h-0 transition-opacity duration-200 ${
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
