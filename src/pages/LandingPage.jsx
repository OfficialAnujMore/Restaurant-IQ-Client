import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

export default function LandingPage() {
  const featuresRef = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🍔</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              RestaurantIQ
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm px-4 py-1.5 rounded-md border border-[#334155] text-slate-200 hover:border-[#3b82f6] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm px-4 py-1.5 rounded-md bg-[#3b82f6] text-white hover:bg-blue-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-slate-200 text-xl"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[#334155] px-6 py-3 flex flex-col gap-2">
            <Link to="/login" className="text-sm text-slate-200 py-1">
              Login
            </Link>
            <Link to="/register" className="text-sm text-blue-400 py-1">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      <section className="min-h-[calc(100vh-57px)] flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold mb-4">
            Powered by Esri ArcGIS
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
            Find the Perfect Location
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-2">
            for Your Restaurant
          </h2>
          <p className="text-slate-400 mt-6 max-w-xl mx-auto">
            AI-powered site selection using real demographic data, competitor mapping, and
            drive-time analysis — built on Esri ArcGIS.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-base transition-colors"
            >
              🚀 Get Started Free
            </button>
            <button
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-lg border border-[#334155] hover:border-[#3b82f6] text-slate-200 font-medium text-base transition-colors"
            >
              ▶ See How It Works
            </button>
          </div>

          <div className="text-xs text-slate-500 mt-4">
            No credit card required · Free forever
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="px-6 py-20 border-t border-[#334155]">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            How RestaurantIQ Works
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: '🎯',
                title: 'Choose Your Concept',
                body: 'Select your restaurant type, cuisine, and menu items',
              },
              {
                icon: '📍',
                title: 'Pick Your City',
                body: 'Enter any US city and your competitive strategy',
              },
              {
                icon: '🗺',
                title: 'Get Your Top 5',
                body: 'ArcGIS analyzes demographics, competitors, and foot traffic',
              },
            ].map((s, i) => (
              <div
                key={s.title}
                className="bg-[#1e293b] border border-[#334155] border-t-2 border-t-[#3b82f6] rounded-lg p-6"
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-xs text-slate-400 mb-1">Step {i + 1}</div>
                <div className="text-lg font-semibold text-white mb-2">{s.title}</div>
                <div className="text-sm text-slate-400">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 border-t border-[#334155]">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Why ArcGIS Makes the Difference
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: '🌍',
                title: 'Real Demographics',
                body: 'Esri GeoEnrichment pulls actual population and income data — not estimates',
              },
              {
                icon: '🔍',
                title: 'Competitor Mapping',
                body: 'ArcGIS Places API locates every competitor within your target city',
              },
              {
                icon: '🚗',
                title: 'Drive-Time Analysis',
                body: 'Network Analyst calculates who can actually reach your location',
              },
              {
                icon: '🏫',
                title: 'Anchor Intelligence',
                body: 'Score locations by proximity to universities and shopping malls',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[#1e293b] border border-[#334155] rounded-lg p-6"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="text-lg font-semibold text-white mb-1">{f.title}</div>
                <div className="text-sm text-slate-400">{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-[#334155] text-center text-xs text-slate-500">
        <div>Built with ❤️ for FullyHacks 2026 · Powered by Esri ArcGIS</div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <Link to="/login" className="hover:text-slate-300">
            Login
          </Link>
          <span>|</span>
          <Link to="/register" className="hover:text-slate-300">
            Register
          </Link>
        </div>
      </footer>
    </div>
  );
}
