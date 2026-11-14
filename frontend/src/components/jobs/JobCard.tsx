import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types/job';
import { MapPin, Banknote, Calendar, Building, Users, CheckCircle } from 'lucide-react';

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, showApplyButton = true }) => {
  const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              {job.employmentType || 'Full-time'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-1">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{job.company}</span>
            </div>
          </div>

          {job.appliedByCurrentUser && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
              Applied
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Requirements preview */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.requirements.slice(0, 3).map((req, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className={isExpired ? 'text-rose-600 font-medium' : ''}>
              {isExpired ? 'Expired' : `Due: ${job.deadline}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.applicantCount || 0} applicants</span>
          </div>
        </div>

        {showApplyButton && (
          <Link
            to={`/jobs/${job.id}`}
            className="w-full text-center block py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-emerald-600 transition-colors"
          >
            View Job Details
          </Link>
        )}
      </div>
    </div>
  );
};
