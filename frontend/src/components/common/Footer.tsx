import React from 'react';
import { Briefcase, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Career<span className="text-emerald-600">Nest</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm mb-4">
              A straightforward job portal application designed to connect ambitious job seekers with world-class employers in a seamless, user-friendly way.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              Real-time Twilio SMS Application & Status Alerts
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/jobs" className="hover:text-emerald-600 transition-colors">Browse All Jobs</a></li>
              <li><a href="/seeker/dashboard" className="hover:text-emerald-600 transition-colors">Track Applications</a></li>
              <li><a href="/register" className="hover:text-emerald-600 transition-colors">Create Free Profile</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/employer/dashboard" className="hover:text-emerald-600 transition-colors">Post a Job</a></li>
              <li><a href="/employer/dashboard" className="hover:text-emerald-600 transition-colors">Candidate Management</a></li>
              <li><a href="/register" className="hover:text-emerald-600 transition-colors">Employer Signup</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CareerNest Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Spring Boot, MongoDB, React, Redux Toolkit & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
