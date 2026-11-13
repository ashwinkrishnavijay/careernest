export type ApplicationStatus = 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  jobCompany: string;
  employerId: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  seekerPhone: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  employerNotes?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface ApplicationFormData {
  phone: string;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface ApplicationStatusUpdatePayload {
  status: ApplicationStatus;
  notes?: string;
}
