import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchEmployerJobs,
  createJob,
  updateJob,
  deleteJob,
} from '../store/jobSlice';
import { fetchEmployerApplications } from '../store/applicationSlice';
import { Job, JobFormData } from '../types/job';
import { JobFormModal } from '../components/jobs/JobFormModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { NotificationToast } from '../components/common/NotificationToast';
import {
  Briefcase,
  Users,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Eye,
  CheckCircle,
} from 'lucide-react';

export const EmployerDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { employerJobs, loading } = useAppSelector((state) => state.jobs);
  const { employerApplications } = useAppSelector((state) => state.applications);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEmployerJobs());
    dispatch(fetchEmployerApplications());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleJobSubmit = async (formData: JobFormData) => {
    if (editingJob) {
      await dispatch(updateJob({ id: editingJob.id, data: formData })).unwrap();
      setToastMessage(`Job listing "${formData.title}" updated successfully!`);
    } else {
      await dispatch(createJob(formData)).unwrap();
      setToastMessage(`New job "${formData.title}" published! Confirmation SMS sent.`);
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (window.confirm(`Are you sure you want to remove the job listing "${jobTitle}"?`)) {
      await dispatch(deleteJob(jobId)).unwrap();
      setToastMessage(`Job listing "${jobTitle}" has been removed.`);
    }
  };

  const activeJobs = employerJobs.filter(
    (j) => !j.deadline || new Date(j.deadline) >= new Date()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Employer Management Hub
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your company listings, review incoming applications, and track candidate pipeline.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-emerald-600/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Postings</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{employerJobs.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Listings</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{activeJobs.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Applicants</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{employerApplications.length}</div>
          </div>
        </div>
      </div>

      {/* Jobs Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Job Listings</h2>
          <span className="text-xs text-slate-500 font-medium">
            {employerJobs.length} {employerJobs.length === 1 ? 'position' : 'positions'}
          </span>
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : employerJobs.length === 0 ? (
          <div className="text-center py-16 p-6">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">You haven't posted any jobs yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Create your first job listing to start receiving qualified candidates and automated SMS updates.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Position & Location</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4 text-center">Applicants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employerJobs.map((job) => {
                  const isPast = job.deadline ? new Date(job.deadline) < new Date() : false;
                  return (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{job.title}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.employmentType}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-emerald-700">
                        {job.salary}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className={isPast ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                            {job.deadline}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/employer/applicants/${job.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          <Users className="w-3.5 h-3.5" />
                          {job.applicantCount || 0} candidates
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/employer/applicants/${job.id}`}
                            title="View Candidates"
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(job)}
                            title="Edit Job"
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            title="Delete Job"
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <JobFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleJobSubmit}
          initialJob={editingJob}
          defaultCompany={user?.companyName || user?.name}
        />
      )}

      {/* Toast */}
      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};
