import api from './api';
import { Application, ApplicationFormData, ApplicationStatusUpdatePayload } from '../types/application';

export const applicationService = {
  async applyForJob(jobId: string, data: ApplicationFormData): Promise<Application> {
    const res = await api.post(`/applications/apply/${jobId}`, data);
    return res.data.data;
  },

  async getMyApplications(): Promise<Application[]> {
    const res = await api.get('/applications/my-applications');
    return res.data.data;
  },

  async getEmployerApplications(jobId?: string): Promise<Application[]> {
    const url = jobId ? `/applications/employer?jobId=${jobId}` : '/applications/employer';
    const res = await api.get(url);
    return res.data.data;
  },

  async updateApplicationStatus(id: string, payload: ApplicationStatusUpdatePayload): Promise<Application> {
    const res = await api.patch(`/applications/${id}/status`, payload);
    return res.data.data;
  },
};
