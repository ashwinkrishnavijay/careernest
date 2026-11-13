import api from './api';
import { AuthResponse, User, Role } from '../types/auth';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
  companyName?: string;
  companyWebsite?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/login', data);
    return res.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};
