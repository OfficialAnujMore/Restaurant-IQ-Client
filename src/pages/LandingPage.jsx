import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BrandMark from '../components/BrandMark.jsx';

const featureSteps = [
  {
    tag: 'Strategy',
    title: 'Choose Your Concept',
    body: 'Select restaurant category, menu signals, and strategy before launching analysis.',
  },
  {
    tag: 'Market',
    title: 'Scan Your City',
    body: 'Run ArcGIS-backed analysis against demographics, anchors, and competitive pressure.',
  },
  {
    tag: 'Map',
    title: 'Review Top Zones',
    body: 'Inspect ranked pins, soft catchments, and recommended neighborhoods on the map.',
  },
];

const platformFeatures = [
  {
    tag: 'Competitors',
    title: 'Competitor Context',
    body: 'Run ArcGIS-backed analysis against demographics, anchors, and competitive pressure.',
  },
  {
    tag: 'Demographics',
    title: 'Demographic Insights',
    body: 'Use Esri enrichment and places data instead of rough heuristics or sample numbers.',
  },
  {
    tag: 'Scoring',
    title: 'Catchment Scoring',
    body: 'Catchment analysis stays built around accessibility, not just straight-line distance.',
  },
];

const previewPins = [
  { left: '22%', top: '56%', label: '1', color: '#3B82F6' },
  { left: '44%', top: '36%', label: '2', color: '#78C6A3' },
  { left: '68%', top: '26%', label: '3', color: '#F4B860' },
  { left: '60%', top: '51%', label: '4', color: '#F1D36B' },
  { left: '78%', top: '60%', label: '5', color: '#F59F65' },
];

export default function LandingPage() {
  const featuresRef = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();
  const isAuthenticated = !!user && !!token;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fcfd] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.22),transparent_18%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_18%),linear-gradient(180deg,#f8fcfd_0%,#f3fbfc_48%,#ffffff_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,rgba(8,145,178,0.08)_0%,rgba(236,254,255,0.12)_100%)]" />

      <nav className="sticky top-0 z-50 border-b border-white/50 bg-[linear-gradient(90deg,rgba(7,89,133,0.72)_0%,rgba(8,145,178,0.58)_52%,rgba(236,254,255,0.42)_100%)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to={isAuthenticated ? '/app' : '/'} className="flex items-center gap-3">
            <BrandMark />
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
              Product
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
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white transition hover:bg-white/16 md:hidden"
            aria-label="Toggle menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
            </span>
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
                Product
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
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-18 pt-16 lg:min-h-[calc(100vh-81px)] lg:grid-cols-[1fr_1.02fr] lg:pt-20">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex rounded-full border border-cyan-200 bg-white px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-800 shadow-[0_12px_24px_rgba(8,145,178,0.08)]">
              Powered by ArcGIS
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-[4.5rem]">
              Find better restaurant locations with
              <span className="block text-[#155e75]">ArcGIS-based market analysis</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              RestaurantIQ helps restaurant founders and operators analyze cities, compare market
              signals, and review top recommended zones on a single map.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(isAuthenticated ? '/app' : '/register')}
                className="rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(15,23,42,0.18)] transition hover:translate-y-[-1px] hover:bg-slate-800"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
              </button>
              <button
                type="button"
                onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-medium text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.06)] transition hover:border-slate-300"
              >
                See Product
              </button>
            </div>

            <div className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-500">
              No credit card required · ArcGIS-based analysis retained
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-[10%] top-6 h-24 rounded-full bg-cyan-200/35 blur-3xl" />
            <div className="relative rounded-[32px] border border-slate-200/80 bg-white p-4 shadow-[0_35px_80px_rgba(8,145,178,0.14)] sm:p-5">
              <div className="mb-4 flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                    Dashboard Preview
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-900">
                    San Francisco
                  </div>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  Gap Finder
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-cyan-100 bg-[linear-gradient(180deg,#effcff_0%,#dff7fb_100%)]">
                <div className="grid gap-4 p-4 sm:p-5">
                  <div className="grid gap-4 lg:grid-cols-[1.04fr_0.96fr]">
                    <div className="rounded-[24px] border border-white/80 bg-white/80 p-4 shadow-[0_18px_34px_rgba(8,145,178,0.12)] backdrop-blur-xl">
                      <div className="text-sm font-semibold text-slate-900">Top 5 Recommended Zones</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        Premium pins, softer catchments, calmer map UI
                      </div>
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

                    <div className="rounded-[24px] border border-white/80 bg-white/72 p-4 shadow-[0_18px_34px_rgba(8,145,178,0.12)] backdrop-blur-xl">
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Legend
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-[#e85b56]" /> Competitor
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-cyan-300/70" /> Catchment
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#3B82F6] text-[9px] font-bold text-white">
                            1
                          </span>
                          Ranked pin
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-[340px] overflow-hidden rounded-[28px] border border-cyan-100/80 bg-[linear-gradient(180deg,#bbe8f1_0%,#d8f4f7_26%,#eefafc_100%)]">
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

                    {previewPins.map((pin) => (
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={featuresRef} className="border-y border-slate-200 bg-white/92">
          <div className="mx-auto max-w-6xl px-6 py-18">
            <div className="mb-10 max-w-2xl">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                What It Does
              </div>
              <h2 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-5xl">
                A simple workflow for restaurant site selection
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {featureSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                      {step.tag}
                    </span>
                    <span className="text-xs text-slate-400">Step {index + 1}</span>
                  </div>
                  <div className="mt-4 text-base font-semibold tracking-[-0.02em] text-slate-900">
                    {step.title}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-500">{step.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-18">
          <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                Why It&apos;s Useful
              </div>
              <h2 className="mt-3 max-w-lg text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-5xl">
                The key signals in one place
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
                RestaurantIQ combines ArcGIS spatial analysis, competitor context, demographics,
                and catchment scoring to help you compare cities and focus on stronger zones.
              </p>

              <div className="mt-8 grid gap-3">
                {platformFeatures.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                      {item.tag}
                    </div>
                    <div className="mt-2 text-base font-semibold text-slate-900">{item.title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">{item.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                Product Preview
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Review top recommended zones on the map
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">
                Inspect ranked pins, soft catchments, and recommended neighborhoods inside the
                dashboard preview.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {['Ranked zones', 'Map view', 'Saved review'].map((label) => (
                  <div
                    key={label}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs font-medium text-slate-600"
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-cyan-100 bg-[linear-gradient(180deg,#effcff_0%,#dff7fb_100%)] p-4">
                <div className="rounded-[20px] border border-white/80 bg-white/80 p-4 shadow-[0_18px_34px_rgba(8,145,178,0.12)]">
                  <div className="text-sm font-semibold text-slate-900">Top 5 Recommended Zones</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Premium pins, softer catchments, calmer map UI
                  </div>
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
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
              RestaurantIQ
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Analyze a city, compare signals, and review top restaurant zones
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(isAuthenticated ? '/app' : '/register')}
                className="rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
              </button>
              <Link
                to={isAuthenticated ? '/app' : '/login'}
                className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                {isAuthenticated ? 'Open App' : 'Login'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white px-6 py-10 text-center text-xs text-slate-500">
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
