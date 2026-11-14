import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchJobById } from '../store/jobSlice';
import { submitApplication, clearSuccessMessage } from '../store/applicationSlice';
import { ApplicationModal } from '../components/applications/ApplicationModal';
import { NotificationToast } from '../components/common/NotificationToast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ApplicationFormData } from '../types/application';
import {
  Building,
  MapPin,
  Banknote,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Users,
  ShieldCheck,
  Send,
  MessageSquare,
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { currentJob, loading } = useAppSelector((state) => state.jobs);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { successMessage } = useAppSelector((state) => state.applications);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [localApplied, setLocalApplied] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }
  }, [dispatch, id]);

  const handleApplySubmit = async (formData: ApplicationFormData) => {
    if (!id) return;
    const result = await dispatch(submitApplication({ jobId: id, data: formData }));
    if (submitApplication.fulfilled.match(result)) {
      setLocalApplied(true);
    }
  };

  const isExpired = currentJob?.deadline ? new Date(currentJob.deadline) < new Date() : false;
  const hasApplied = currentJob?.appliedByCurrentUser || localApplied;

  if (loading || !currentJob) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all jobs
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 mb-8">
        {/* Job Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentJob.employmentType || 'Full-time'}
              </span>
              {hasApplied && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Applied
                </span>
              )}
              {isExpired && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  Listing Expired
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentJob.title}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-base font-semibold text-slate-700">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{currentJob.company}</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="shrink-0">
            {hasApplied ? (
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-sm font-semibold mb-2">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  Application Active
                </div>
                <div>
                  <Link
                    to="/seeker/dashboard"
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 block"
                  >
                    View Status in Dashboard →
                  </Link>
                </div>
              </div>
            ) : user?.role === 'EMPLOYER' ? (
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-800">
                <span className="font-semibold block">Employer Account</span>
                {user.id === currentJob.employerId ? (
                  <Link
                    to={`/employer/applicants/${currentJob.id}`}
                    className="text-purple-700 font-bold underline mt-1 block"
                  >
                    Manage Applicants ({currentJob.applicantCount})
                  </Link>
                ) : (
                  <span>Job posted by {currentJob.employerName}</span>
                )}
              </div>
            ) : isExpired ? (
              <button
                disabled
                className="py-3 px-6 rounded-xl text-sm font-semibold bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                Applications Closed
              </button>
            ) : isAuthenticated ? (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="py-3 px-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> Apply for Position
              </button>
            ) : (
              <Link
                to="/login"
                state={{ from: { pathname: `/jobs/${currentJob.id}` } }}
                className="py-3 px-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all inline-block"
              >
                Sign in to Apply
              </Link>
            )}
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-sm">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Location</div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{currentJob.location}</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Compensation</div>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-700 mt-1">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>{currentJob.salary}</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Deadline</div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{currentJob.deadline}</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Applicants</div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{currentJob.applicantCount} candidates</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="py-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3">About the Position</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {currentJob.description}
            </p>
          </div>

          {/* Requirements */}
          {currentJob.requirements && currentJob.requirements.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Requirements & Skills</h2>
              <ul className="space-y-2">
                {currentJob.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Twilio SMS Notification notice */}
        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center gap-3 text-xs text-emerald-900">
          <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Real-time candidate notifications:</strong> You will receive SMS alerts as your application moves from Applied to Reviewing, Shortlisted, or Accepted!
          </span>
        </div>
      </div>

      {/* Application Modal */}
      {isApplyModalOpen && (
        <ApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSubmit={handleApplySubmit}
          job={currentJob}
          defaultPhone={user?.phone}
        />
      )}

      {/* Toast */}
      <NotificationToast
        message={successMessage}
        onClose={() => dispatch(clearSuccessMessage())}
      />
    </div>
  );
};
