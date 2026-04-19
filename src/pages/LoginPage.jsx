import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { loginAuth } from '../services/api.js';
import Navbar from '../components/Navbar.jsx';

const inputClass =
  'w-full rounded-2xl border border-cyan-100 bg-white/90 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100';

export default function LoginPage() {
  const { login, user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user: nextUser, token: nextToken } = await loginAuth({ email, password });
      login(nextUser, nextToken);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return null;
  if (user && token) return <Navigate to="/app" replace />;

  const navItems = [
    {
      label: 'Home',
      to: '/',
      className:
        'rounded-full border border-slate-900/12 bg-white/28 px-4 py-2 text-xs font-medium text-slate-900 transition hover:bg-white/40',
      mobileClassName:
        'rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white',
    },
    {
      label: 'Create Account',
      to: '/register',
      className:
        'rounded-full border border-white/40 bg-white/88 px-4 py-2 text-xs font-semibold text-cyan-900 shadow-[0_10px_24px_rgba(8,145,178,0.14)] transition hover:bg-white',
      mobileClassName:
        'rounded-2xl border border-white/30 bg-white/86 px-4 py-3 text-sm font-semibold text-cyan-900',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#e7fbff_0%,#dff6f7_35%,#edf8ff_100%)] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.45),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.24),transparent_24%)]" />

      <Navbar brandTo={user && token ? '/app' : '/'} rightItems={navItems} mobileMenuItems={navItems} />

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="max-w-xl">
          {/* <div className="mb-4 inline-flex rounded-full border border-cyan-200/80 bg-white/60 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-800 shadow-[0_10px_30px_rgba(8,145,178,0.1)] backdrop-blur-xl">
            RestaurantIQ
          </div> */}
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-slate-900 sm:text-6xl">
            Sign in to
            <span className="block bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_50%,#38bdf8_100%)] bg-clip-text text-transparent">
              RestaurantIQ
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Analyze cities, compare market signals, and review top recommended restaurant zones.
          </p>
        </section>

        <section className="rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(236,254,255,0.74)_100%)] p-7 shadow-[0_28px_60px_rgba(8,145,178,0.18)] backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Sign In
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-cyan-700 hover:text-cyan-900">
                Register
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition hover:text-cyan-700"
                  aria-label="Toggle password"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_52%,#38bdf8_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(8,145,178,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_24px_40px_rgba(8,145,178,0.34)] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-cyan-100 pt-5 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-700">
              ← Back to home
            </Link>
            <Link to="/app" className="font-medium text-cyan-700 hover:text-cyan-900">
              Dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
