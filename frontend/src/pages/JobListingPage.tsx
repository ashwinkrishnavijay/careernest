import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchJobs } from '../store/jobSlice';
import { JobFilter } from '../components/jobs/JobFilter';
import { JobCard } from '../components/jobs/JobCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Briefcase, AlertCircle } from 'lucide-react';

export const JobListingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { jobs, loading, error } = useAppSelector((state) => state.jobs);

  const keyword = searchParams.get('keyword') || '';
  const location = searchParams.get('location') || '';

  useEffect(() => {
    dispatch(fetchJobs({ keyword, location }));
  }, [dispatch, keyword, location]);

  const handleFilterSearch = (filters: { keyword?: string; location?: string }) => {
    const params: Record<string, string> = {};
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.location) params.location = filters.location;
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Career Opportunities
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Browse verified postings from leading employers or filter by title, company, and location.
        </p>
      </div>

      {/* Filter Bar */}
      <JobFilter onSearch={handleFilterSearch} />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-emerald-600" />
          <span>
            {jobs.length} {jobs.length === 1 ? 'position available' : 'positions available'}
          </span>
          {(keyword || location) && (
            <span className="text-xs font-normal text-slate-500">
              (matching {keyword ? `"${keyword}"` : ''} {location ? `in "${location}"` : ''})
            </span>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 mb-6 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No matching jobs found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Try adjusting your search criteria or clearing filters to see all available roles.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};
