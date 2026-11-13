import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { Briefcase, LogOut, Menu, X, PlusCircle, CheckCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Career<span className="text-emerald-600">Nest</span>
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-500 -mt-1">
                Employers & Seekers
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/jobs"
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Browse Jobs
            </Link>

            {isAuthenticated && user?.role === 'JOB_SEEKER' && (
              <Link
                to="/seeker/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                My Applications
              </Link>
            )}

            {isAuthenticated && user?.role === 'EMPLOYER' && (
              <Link
                to="/employer/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                Employer Dashboard
              </Link>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center justify-end gap-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        user.role === 'EMPLOYER' ? 'bg-purple-500' : 'bg-emerald-500'
                      }`}
                    ></span>
                    {user.role === 'EMPLOYER' ? (user.companyName || 'Employer') : 'Job Seeker'}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20 transition-all hover:shadow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Browse Jobs
          </Link>

          {isAuthenticated && user?.role === 'JOB_SEEKER' && (
            <Link
              to="/seeker/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              My Applications
            </Link>
          )}

          {isAuthenticated && user?.role === 'EMPLOYER' && (
            <Link
              to="/employer/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Employer Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="px-3">
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">
                    {user.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'} ({user.email})
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-4 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
