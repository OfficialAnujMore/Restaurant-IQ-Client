import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { registerAuth } from '../services/api.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { login } = useAuth();
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
      const { user, token } = await registerAuth({ name: name.trim(), email, password });
      login(user, token);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-md bg-[#0f172a] border border-[#334155] px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]';

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-xl p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🍔</span>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            RestaurantIQ
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-sm text-slate-400 mt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login →
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className={inputClass}
              required
            />
            {nameError && <div className="text-xs text-red-400 mt-1">{nameError}</div>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              required
            />
            {emailError && <div className="text-xs text-red-400 mt-1">{emailError}</div>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className={inputClass + ' pr-10'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-200"
                aria-label="Toggle password"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {passwordError && <div className="text-xs text-red-400 mt-1">{passwordError}</div>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
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
            {confirmError && <div className="text-xs text-red-400 mt-1">{confirmError}</div>}
          </div>

          {error && (
            <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 w-full rounded-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 transition-colors"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-200">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
