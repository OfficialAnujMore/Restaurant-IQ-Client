import { useRef, useState } from 'react';
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0f172a] text-slate-100">
      <header className="h-12 shrink-0 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🍔</span>
          <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            RestaurantIQ
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300">👤 {user?.name}</span>
          <button
            type="button"
            onClick={logout}
            className="text-xs px-3 py-1 rounded border border-[#334155] text-slate-300 hover:border-red-500/50 hover:text-red-300 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="w-[380px] shrink-0 border-r border-[#334155] overflow-y-auto">
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
            <div className="px-5 pb-5">
              <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Layers</div>
              <LayerToggle layers={layerVisibility} onToggle={handleLayerToggle} />
            </div>
          )}
        </div>
        <div className="flex-1 relative">
          <MapView
            results={results}
            activeLocation={activeLocation}
            layerVisibility={layerVisibility}
            loading={loading}
            city={lastCity}
            mapRef={mapRef}
          />
        </div>
      </div>
    </div>
  );
}
