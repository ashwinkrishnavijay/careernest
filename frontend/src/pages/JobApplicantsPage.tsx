import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEmployerApplications, updateApplicationStatus, clearSuccessMessage } from '../store/applicationSlice';
import { ApplicationStatus } from '../types/application';
import { StatusBadge } from '../components/applications/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { NotificationToast } from '../components/common/NotificationToast';
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  FileText,
  Calendar,
  ExternalLink,
  MessageSquare,
  X,
} from 'lucide-react';

export const JobApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const dispatch = useAppDispatch();

  const { employerApplications, loading, successMessage } = useAppSelector((state) => state.applications);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<{ name: string; letter: string } | null>(null);

  useEffect(() => {
    dispatch(fetchEmployerApplications(jobId));
  }, [dispatch, jobId]);

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    await dispatch(
      updateApplicationStatus({
        id: applicationId,
        payload: {
          status: newStatus,
          notes: `Status changed to ${newStatus} by employer`,
        },
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/employer/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Employer Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Candidate Pipeline & Review
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review applicant profiles, inspect resumes, and update hiring statuses. Updating candidate status automatically triggers Twilio SMS alerts.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>Automated Twilio SMS Dispatched on Status Change</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Applicant Submissions ({employerApplications.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : employerApplications.length === 0 ? (
          <div className="text-center py-20 p-6">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No applications received yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              When candidates apply to your postings, their contact information, resumes, and cover letters will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Candidate & Job</th>
                  <th className="px-6 py-4">Contact Info (SMS)</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Documents</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Update Status & Notify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employerApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{app.seekerName}</div>
                      <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                        {app.jobTitle}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.seekerEmail}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{app.seekerPhone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" /> Resume
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No link</span>
                        )}

                        {app.coverLetter && (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCoverLetter({
                                name: app.seekerName,
                                letter: app.coverLetter || '',
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          >
                            <FileText className="w-3 h-3" /> Letter
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as ApplicationStatus)
                        }
                        className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="REVIEWING">Under Review</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="ACCEPTED">Offer Accepted</option>
                        <option value="REJECTED">Not Selected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cover Letter Modal */}
      {selectedCoverLetter && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Cover Letter — {selectedCoverLetter.name}
              </h3>
              <button
                onClick={() => setSelectedCoverLetter(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
              {selectedCoverLetter.letter}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedCoverLetter(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <NotificationToast
        message={successMessage}
        onClose={() => dispatch(clearSuccessMessage())}
      />
    </div>
  );
};
