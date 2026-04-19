import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import MapView from './components/MapView.jsx';
import LayerToggle from './components/LayerToggle.jsx';
import { analyzeCity } from './services/api.js';
import { useAuth } from './context/AuthContext.jsx';

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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[linear-gradient(180deg,#e7fbff_0%,#dff6f7_32%,#edf8ff_100%)] text-slate-900">
      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-cyan-100/70 bg-[rgba(12,74,110,0.82)] px-4 backdrop-blur-xl sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_100%)] text-base text-white shadow-[0_18px_30px_rgba(8,145,178,0.22)]">
            🍔
          </div>
          <span className="text-sm font-semibold tracking-[-0.02em] text-white">
            RestaurantIQ
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-cyan-50 sm:inline">👤 {user?.name}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-white/30 bg-white/18 px-4 py-2 text-xs font-medium text-white shadow-[0_8px_24px_rgba(8,145,178,0.14)] transition hover:border-white/40 hover:bg-white/24"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 pt-16">
        <aside className="z-10 w-[332px] shrink-0 overflow-y-auto border-r border-cyan-100/70 bg-[linear-gradient(180deg,rgba(236,254,255,0.94)_0%,rgba(224,247,250,0.9)_100%)] backdrop-blur-xl xl:w-[356px]">
          <Sidebar
            onAnalyze={handleAnalyze}
            loading={loading}
            results={results}
            error={error}
            onDismissError={() => setError(null)}
            activeLocation={activeLocation}
            onSelectLocation={setActiveLocation}
            onLoadHeatmap={handleLoadHeatmap}
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
        <main className="relative flex-1">
          <MapView
            results={results}
            activeLocation={activeLocation}
            layerVisibility={layerVisibility}
            loading={loading}
            city={lastCity}
            mapRef={mapRef}
          />
        </main>
      </div>
    </div>
  );
}
