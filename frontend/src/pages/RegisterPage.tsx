import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { registerUser, clearAuthError } from '../store/authSlice';
import { Role } from '../types/auth';
import { Briefcase, User as UserIcon, Building2, Lock, Mail, Phone, ArrowRight, MessageSquare } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, loading, error } = useAppSelector((state) => state.auth);

  const [role, setRole] = useState<Role>('JOB_SEEKER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'EMPLOYER') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        name,
        email,
        password,
        phone,
        role,
        companyName: role === 'EMPLOYER' ? companyName : undefined,
        companyWebsite: role === 'EMPLOYER' ? companyWebsite : undefined,
      })
    );
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-white mb-4 shadow-md shadow-emerald-600/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your CareerNest account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Select your account type to access tailored tools and features.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 text-center">
            Choose Your Platform Role
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('JOB_SEEKER')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === 'JOB_SEEKER'
                  ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <UserIcon
                  className={`w-5 h-5 ${
                    role === 'JOB_SEEKER' ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <span className="font-bold text-slate-900 text-sm">Job Seeker</span>
              </div>
              <p className="text-xs text-slate-500">
                Browse open jobs, submit applications & track status.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('EMPLOYER')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === 'EMPLOYER'
                  ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2
                  className={`w-5 h-5 ${
                    role === 'EMPLOYER' ? 'text-purple-600' : 'text-slate-400'
                  }`}
                />
                <span className="font-bold text-slate-900 text-sm">Employer</span>
              </div>
              <p className="text-xs text-slate-500">
                Post job listings, review candidates & manage hiring.
              </p>
            </button>
          </div>
        </div>

        {/* Twilio SMS Notification notice */}
        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
          <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Provide your phone number to receive an instant welcome SMS and real-time application updates!
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Phone (for SMS) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Employer Fields */}
          {role === 'EMPLOYER' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
              <div>
                <label className="block text-xs font-semibold text-purple-900 uppercase tracking-wider mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-900 uppercase tracking-wider mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-3 px-4 text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all ${
              role === 'EMPLOYER'
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
            }`}
          >
            {loading ? (
              <LoadingSpinner size="sm" color="text-white" />
            ) : (
              <>
                Register as {role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
