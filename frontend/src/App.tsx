import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobListingPage } from './pages/JobListingPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { EmployerDashboardPage } from './pages/EmployerDashboardPage';
import { JobApplicantsPage } from './pages/JobApplicantsPage';
import { SeekerDashboardPage } from './pages/SeekerDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />

          {/* Protected Employer Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <EmployerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/applicants"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <JobApplicantsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/applicants/:jobId"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <JobApplicantsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Job Seeker Routes */}
          <Route
            path="/seeker/dashboard"
            element={
              <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                <SeekerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
