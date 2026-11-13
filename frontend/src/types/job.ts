export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  deadline: string;
  company: string;
  employmentType: string;
  requirements: string[];
  employerId: string;
  employerName: string;
  employerEmail: string;
  active: boolean;
  applicantCount: number;
  appliedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  title: string;
  description: string;
  location: string;
  salary: string;
  deadline: string;
  company?: string;
  employmentType: string;
  requirements: string[];
}
