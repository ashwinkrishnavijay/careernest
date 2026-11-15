import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchSeekerApplications } from '../store/applicationSlice';
import { StatusBadge } from '../components/applications/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Building,
  Calendar,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';

export const SeekerDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { myApplications, loading } = useAppSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchSeekerApplications());
  }, [dispatch]);

  const shortlistedCount = myApplications.filter((a) => a.status === 'SHORTLISTED').length;
  const underReviewCount = myApplications.filter((a) => a.status === 'REVIEWING').length;
  const acceptedCount = myApplications.filter((a) => a.status === 'ACCEPTED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Candidate Application Tracker
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Monitor all your submitted applications and live status updates in real-time.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-emerald-600/25 transition-all"
        >
          <Search className="w-4 h-4" /> Browse More Jobs
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Submitted</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{myApplications.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-600">In Review</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{underReviewCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-600">Shortlisted</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{shortlistedCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Offers Accepted</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{acceptedCount}</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your Submitted Applications</h2>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>SMS updates delivered to: {user?.phone || 'registered phone'}</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : myApplications.length === 0 ? (
          <div className="text-center py-20 p-6">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No applications yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Explore thousands of career opportunities and submit your first application with 1-click.
            </p>
            <Link
              to="/jobs"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 inline-flex items-center gap-1.5"
            >
              Browse Open Positions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="p-6 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                    >
                      {app.jobTitle}
                    </Link>
                    <StatusBadge status={app.status} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.jobCompany}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {app.employerNotes && (
                    <div className="mt-2 text-xs text-slate-600 bg-slate-100/80 p-2.5 rounded-lg max-w-xl">
                      <span className="font-semibold text-slate-700">Employer Note: </span>
                      {app.employerNotes}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="px-4 py-2 border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 rounded-xl text-xs font-semibold transition-colors inline-block"
                  >
                    View Job Posting
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
