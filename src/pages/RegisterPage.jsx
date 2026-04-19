import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { registerAuth } from '../services/api.js';
import BrandMark from '../components/BrandMark.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full rounded-2xl border border-cyan-100 bg-white/90 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100';

export default function RegisterPage() {
  const { login, user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const nameError = name && name.trim().length < 2 ? 'Name must be at least 2 characters' : '';
  const emailError = email && !EMAIL_RE.test(email) ? 'Invalid email format' : '';
  const passwordError =
    password && password.length < 8 ? 'Password must be at least 8 characters' : '';
  const confirmError =
    confirm && confirm !== password ? 'Passwords do not match' : '';

  const canSubmit =
    name.trim().length >= 2 &&
    EMAIL_RE.test(email) &&
    password.length >= 8 &&
    confirm === password &&
    !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const { user: nextUser, token: nextToken } = await registerAuth({
        name: name.trim(),
        email,
        password,
      });
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#e7fbff_0%,#dff6f7_35%,#edf8ff_100%)] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.45),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.24),transparent_24%)]" />

      <nav className="relative z-10 border-b border-white/50 bg-[linear-gradient(90deg,rgba(7,89,133,0.72)_0%,rgba(8,145,178,0.58)_52%,rgba(236,254,255,0.42)_100%)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to={user && token ? '/app' : '/'} className="flex items-center gap-3">
            <BrandMark />
            <span className="text-base font-semibold tracking-[-0.02em] text-white">
              RestaurantIQ
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/22"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-white/40 bg-white/88 px-4 py-2 text-xs font-semibold text-cyan-900 shadow-[0_10px_24px_rgba(8,145,178,0.14)] transition hover:bg-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="max-w-xl">
          {/* <div className="mb-4 inline-flex rounded-full border border-cyan-200/80 bg-white/60 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-800 shadow-[0_10px_30px_rgba(8,145,178,0.1)] backdrop-blur-xl">
            Premium Aqua Access
          </div> */}
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-slate-900 sm:text-6xl">
            Build your next
            <span className="block bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_50%,#38bdf8_100%)] bg-clip-text text-transparent">
              location strategy
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Create an account to save recommended sites, compare competitive patterns, and work
            inside the redesigned ArcGIS map experience.
          </p>

          <div className="mt-8 space-y-3">
            {[
              'Save high-performing candidate zones for later review',
              'Open your dashboard directly from the RestaurantIQ brand navbar',
              'Run city analysis with the current ArcGIS workflow unchanged',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(236,254,255,0.72)_100%)] px-4 py-3 text-sm text-slate-600 shadow-[0_16px_34px_rgba(8,145,178,0.1)] backdrop-blur-xl"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_100%)] text-white shadow-[0_10px_20px_rgba(8,145,178,0.2)]">
                  OK
                </span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(236,254,255,0.74)_100%)] p-7 shadow-[0_28px_60px_rgba(8,145,178,0.18)] backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Register
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-cyan-700 hover:text-cyan-900">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className={inputClass}
                required
              />
              {nameError && <div className="text-xs text-red-500">{nameError}</div>}
            </div>

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
              {emailError && <div className="text-xs text-red-500">{emailError}</div>}
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
                  placeholder="Minimum 8 characters"
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
              {passwordError && <div className="text-xs text-red-500">{passwordError}</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                className={inputClass}
                required
              />
              {confirmError && <div className="text-xs text-red-500">{confirmError}</div>}
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_52%,#38bdf8_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(8,145,178,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_24px_40px_rgba(8,145,178,0.34)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
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
