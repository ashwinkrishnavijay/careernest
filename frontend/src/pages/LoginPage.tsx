import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser, clearAuthError } from '../store/authSlice';
import { Briefcase, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as any)?.from?.pathname || null;

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'EMPLOYER') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleQuickFill = (role: 'EMPLOYER' | 'JOB_SEEKER') => {
    if (role === 'EMPLOYER') {
      setEmail('employer@careernest.com');
      setPassword('password123');
    } else {
      setEmail('seeker@careernest.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-white mb-4 shadow-md shadow-emerald-600/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to CareerNest
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your credentials or choose a pre-configured demo account below.
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Instant Demo Logins (Click to autofill):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('EMPLOYER')}
              className="p-2 text-left bg-white rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-[11px]"
            >
              <div className="font-bold text-purple-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Employer
              </div>
              <div className="text-slate-500 truncate">employer@careernest.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('JOB_SEEKER')}
              className="p-2 text-left bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-[11px]"
            >
              <div className="font-bold text-emerald-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Job Seeker
              </div>
              <div className="text-slate-500 truncate">seeker@careernest.com</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {loading ? <LoadingSpinner size="sm" color="text-white" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};
