import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const featureSteps = [
  {
    icon: '🎯',
    title: 'Choose Your Concept',
    body: 'Select restaurant category, menu signals, and strategy before launching analysis.',
  },
  {
    icon: '📍',
    title: 'Scan Your City',
    body: 'Run ArcGIS-backed analysis against demographics, anchors, and competitive pressure.',
  },
  {
    icon: '🗺',
    title: 'Review Top Zones',
    body: 'Inspect ranked pins, soft catchments, and recommended neighborhoods on the map.',
  },
];

const platformFeatures = [
  {
    icon: '🌊',
    title: 'Premium Aquatic UI',
    body: 'Aqua glass surfaces and lighter map-product controls make the interface feel polished.',
  },
  {
    icon: '🌍',
    title: 'ArcGIS Demographics',
    body: 'Use Esri enrichment and places data instead of rough heuristics or sample numbers.',
  },
  {
    icon: '🚗',
    title: 'Drive-Time Thinking',
    body: 'Catchment analysis stays built around accessibility, not just straight-line distance.',
  },
  {
    icon: '📌',
    title: 'Saved Site Review',
    body: 'Keep strong locations around and reopen your dashboard directly from the navbar.',
  },
];

export default function LandingPage() {
  const featuresRef = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();
  const isAuthenticated = !!user && !!token;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#e7fbff_0%,#dff6f7_32%,#edf8ff_100%)] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.44),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_22%)]" />

      <nav className="sticky top-0 z-50 border-b border-white/50 bg-[linear-gradient(90deg,rgba(7,89,133,0.72)_0%,rgba(8,145,178,0.58)_52%,rgba(236,254,255,0.42)_100%)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to={isAuthenticated ? '/app' : '/'} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_100%)] text-base text-white shadow-[0_18px_30px_rgba(8,145,178,0.22)]">
              🍔
            </div>
            <span className="text-base font-semibold tracking-[-0.02em] text-white">
              RestaurantIQ
            </span>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full border border-white/28 bg-white/12 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/20"
            >
              Features
            </button>
            {isAuthenticated ? (
              <>
                <Link
                  to="/app"
                  className="rounded-full border border-white/30 bg-white/14 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/22"
                >
                  Open Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-white/40 bg-white/88 px-4 py-2 text-xs font-semibold text-cyan-900 shadow-[0_10px_24px_rgba(8,145,178,0.14)] transition hover:bg-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-white/30 bg-white/14 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/22"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-white/40 bg-white/88 px-4 py-2 text-xs font-semibold text-cyan-900 shadow-[0_10px_24px_rgba(8,145,178,0.14)] transition hover:bg-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="text-2xl text-white md:hidden"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/20 bg-[rgba(14,116,144,0.38)] px-6 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm text-white"
              >
                Features
              </button>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/app"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="rounded-2xl border border-white/30 bg-white/86 px-4 py-3 text-left text-sm font-semibold text-cyan-900"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl border border-white/30 bg-white/86 px-4 py-3 text-sm font-semibold text-cyan-900"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex rounded-full border border-cyan-200/80 bg-white/60 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-800 shadow-[0_10px_30px_rgba(8,145,178,0.1)] backdrop-blur-xl">
              Powered by ArcGIS
            </div>
            <h1 className="text-5xl font-semibold leading-[1] tracking-[-0.06em] text-slate-900 sm:text-6xl lg:text-7xl">
              Find the best restaurant locations with a
              <span className="block bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_50%,#38bdf8_100%)] bg-clip-text text-transparent">
                cleaner map intelligence workflow
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              RestaurantIQ combines ArcGIS spatial analysis, competitor context, demographics, and
              catchment scoring inside a premium aquatic interface that keeps the map front and
              center.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(isAuthenticated ? '/app' : '/register')}
                className="rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_52%,#38bdf8_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(8,145,178,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_24px_40px_rgba(8,145,178,0.34)]"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
              </button>
              <button
                type="button"
                onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-2xl border border-cyan-200 bg-white/70 px-6 py-3 text-sm font-medium text-slate-700 shadow-[0_14px_28px_rgba(8,145,178,0.1)] transition hover:border-cyan-300 hover:bg-white"
              >
                See How It Works
              </button>
            </div>

            <div className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-500">
              No credit card required · ArcGIS-based analysis retained
            </div>
          </div>

          <div className="rounded-[36px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(236,254,255,0.74)_100%)] p-5 shadow-[0_28px_60px_rgba(8,145,178,0.18)] backdrop-blur-xl sm:p-6">
            <div className="overflow-hidden rounded-[30px] border border-cyan-100 bg-[linear-gradient(180deg,#effcff_0%,#dff7fb_100%)]">
              <div className="flex items-center justify-between border-b border-cyan-100 px-5 py-4">
                <div>
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                    Dashboard Preview
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                    San Francisco
                  </div>
                </div>
                <div className="rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                  Gap Finder
                </div>
              </div>

              <div className="relative h-[360px] bg-[linear-gradient(180deg,#bbe8f1_0%,#d8f4f7_26%,#eefafc_100%)] p-5">
                <div className="absolute left-5 top-5 w-[260px] rounded-[26px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(236,254,255,0.72)_100%)] p-4 shadow-[0_20px_44px_rgba(8,145,178,0.18)] backdrop-blur-xl">
                  <div className="text-sm font-semibold text-slate-900">Top 5 Recommended Zones</div>
                  <div className="mt-1 text-xs text-slate-500">Premium pins, softer catchments, calmer map UI</div>
                  <div className="mt-4 flex gap-2">
                    {['#3B82F6', '#78C6A3', '#F4B860', '#F1D36B', '#F59F65'].map((color, index) => (
                      <span
                        key={color}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white shadow-[0_8px_16px_rgba(15,23,42,0.12)]"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
                      >
                        {index + 1}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 top-0 opacity-80">
                  <div className="absolute left-[8%] top-[22%] h-20 w-20 rounded-full border border-cyan-300/55 bg-cyan-200/18" />
                  <div className="absolute left-[28%] top-[48%] h-26 w-26 rounded-full border border-cyan-300/45 bg-cyan-200/14" />
                  <div className="absolute left-[57%] top-[30%] h-22 w-22 rounded-full border border-cyan-300/40 bg-cyan-200/12" />
                  <div className="absolute left-[70%] top-[58%] h-18 w-18 rounded-full border border-cyan-300/38 bg-cyan-200/10" />
                  <div className="absolute inset-x-10 top-[30%] h-px bg-cyan-100" />
                  <div className="absolute inset-x-16 top-[54%] h-px bg-cyan-100" />
                  <div className="absolute left-[34%] top-[18%] h-[62%] w-px bg-cyan-100" />
                  <div className="absolute left-[64%] top-[12%] h-[70%] w-px bg-cyan-100" />
                </div>

                {[
                  { left: '22%', top: '56%', label: '1', color: '#3B82F6' },
                  { left: '44%', top: '36%', label: '2', color: '#78C6A3' },
                  { left: '68%', top: '26%', label: '3', color: '#F4B860' },
                  { left: '60%', top: '51%', label: '4', color: '#F1D36B' },
                  { left: '78%', top: '60%', label: '5', color: '#F59F65' },
                ].map((pin) => (
                  <div
                    key={pin.label}
                    className="absolute flex h-11 w-11 items-center justify-center rounded-[18px] border-4 border-white text-sm font-semibold text-white shadow-[0_18px_32px_rgba(15,23,42,0.16)]"
                    style={{
                      left: pin.left,
                      top: pin.top,
                      background: `linear-gradient(135deg, ${pin.color}, ${pin.color}CC)`,
                    }}
                  >
                    {pin.label}
                  </div>
                ))}

                <div className="absolute bottom-5 right-5 w-[210px] rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(236,254,255,0.72)_100%)] p-4 shadow-[0_20px_44px_rgba(8,145,178,0.18)] backdrop-blur-xl">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Legend
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#e85b56]" /> Competitor</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-cyan-300/70" /> Catchment</div>
                    <div className="flex items-center gap-2"><span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#3B82F6] text-[9px] font-bold text-white">1</span> Ranked pin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={featuresRef} className="mx-auto max-w-6xl px-6 py-6">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                Workflow
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">
                How RestaurantIQ works
              </h2>
            </div>
            <div className="hidden max-w-sm text-sm leading-6 text-slate-500 md:block">
              The product logic stays the same. The redesign focuses on presentation, hierarchy,
              and map-product polish.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(236,254,255,0.72)_100%)] p-6 shadow-[0_18px_42px_rgba(8,145,178,0.12)] backdrop-blur-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="rounded-full border border-cyan-100 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Step {index + 1}
                  </span>
                </div>
                <div className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                  {step.title}
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-500">{step.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-8 text-center">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Why It Works
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">
              ArcGIS intelligence in a cleaner consumer-style shell
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {platformFeatures.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(236,254,255,0.72)_100%)] p-6 shadow-[0_18px_42px_rgba(8,145,178,0.12)] backdrop-blur-xl"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <div className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                  {item.title}
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-500">{item.body}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-cyan-100/80 px-6 py-8 text-center text-xs text-slate-500">
        <div>Built for FullyHacks 2026 · Powered by Esri ArcGIS</div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <Link to={isAuthenticated ? '/app' : '/login'} className="hover:text-slate-700">
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </Link>
          <span>|</span>
          <Link to={isAuthenticated ? '/app' : '/register'} className="hover:text-slate-700">
            {isAuthenticated ? 'Open App' : 'Register'}
          </Link>
        </div>
      </footer>
    </div>
  );
}
