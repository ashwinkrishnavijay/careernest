import api from './api';
import { Job, JobFormData } from '../types/job';

export const jobService = {
  async getAllJobs(keyword?: string, location?: string): Promise<Job[]> {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    const res = await api.get(`/jobs?${params.toString()}`);
    return res.data.data;
  },

  async getJobById(id: string): Promise<Job> {
    const res = await api.get(`/jobs/${id}`);
    return res.data.data;
  },

  async createJob(data: JobFormData): Promise<Job> {
    const res = await api.post('/jobs', data);
    return res.data.data;
  },

  async updateJob(id: string, data: JobFormData): Promise<Job> {
    const res = await api.put(`/jobs/${id}`, data);
    return res.data.data;
  },

  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },

  async getEmployerJobs(): Promise<Job[]> {
    const res = await api.get('/jobs/my-jobs');
    return res.data.data;
  },
};
