import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchJobs } from '../store/jobSlice';
import { JobCard } from '../components/jobs/JobCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Briefcase,
  Search,
  Users,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { jobs, loading } = useAppSelector((state) => state.jobs);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [searchKw, setSearchKw] = useState('');

  useEffect(() => {
    dispatch(fetchJobs({}));
  }, [dispatch]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKw.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchKw.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const featuredJobs = jobs.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-6 border border-emerald-200 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>The Modern Employer & Job Seeker Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Connecting ambitious <span className="text-emerald-600">job seekers</span> with forward-thinking <span className="text-slate-700">employers</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            CareerNest delivers seamless job posting, intelligent filtering, and real-time Twilio SMS alerts for application updates at every stage.
          </p>

          {/* Quick Search */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-8 max-w-2xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchKw}
                onChange={(e) => setSearchKw(e.target.value)}
                placeholder="Job title, keywords, or company..."
                className="w-full pl-11 pr-4 py-3 text-sm bg-transparent rounded-xl focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              Search Opportunities
            </button>
          </form>

          {/* Quick Stat Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Spring Security & JWT Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Automated Twilio SMS Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Role-based Job Seeker & Employer Dashboards</span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Segmentation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seeker Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-emerald-700/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-emerald-200" />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-200">
                For Job Seekers
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-4">
                Find your next career leap with instant updates
              </h2>
              <ul className="space-y-2.5 text-sm text-emerald-100 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  Browse verified listings with transparent salary ranges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  One-click application submission with resume & cover letter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  Direct SMS updates to your mobile whenever status changes
                </li>
              </ul>
            </div>
            <div>
              <Link
                to={isAuthenticated && user?.role === 'JOB_SEEKER' ? '/seeker/dashboard' : '/jobs'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow hover:bg-emerald-50 transition-colors"
              >
                Browse All Openings <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Employer Card */}
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-slate-900/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                For Employers
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-4">
                Hire world-class talent and manage candidate pipelines
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Publish, update, and manage listings in seconds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Review applications, inspect resumes, and track status
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Automated SMS dispatched to candidate upon review & decision
                </li>
              </ul>
            </div>
            <div>
              <Link
                to={isAuthenticated && user?.role === 'EMPLOYER' ? '/employer/dashboard' : '/register'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow transition-colors"
              >
                Post a Job Listing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Job Openings</h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore the latest curated opportunities from top hiring companies.
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            View all {jobs.length} jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-500 text-sm">No job openings currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
