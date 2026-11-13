export type Role = 'JOB_SEEKER' | 'EMPLOYER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  companyName?: string;
  companyWebsite?: string;
  headline?: string;
  skills?: string[];
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  companyName?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
