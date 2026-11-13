import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-500 mb-8">
          The page or listing you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-emerald-600/20"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
};
