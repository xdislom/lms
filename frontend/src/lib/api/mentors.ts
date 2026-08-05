import { api } from './axios';
import { Mentor } from '@/types';

export const mentorsApi = {
  getAll: async (): Promise<Mentor[]> => {
    const response = await api.get('/mentor/mentor');
    return response.data.data || response.data;
  },
  getById: async (id: string): Promise<Mentor> => {
    const response = await api.get(`/mentor/mentor/${id}`);
    return response.data.data || response.data;
  },
  create: async (data: any): Promise<Mentor> => {
    const response = await api.post('/mentor/mentor', data);
    return response.data.data || response.data;
  },
  update: async (id: string, data: any): Promise<Mentor> => {
    const response = await api.patch(`/mentor/mentor/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/mentor/mentor/${id}`);
  },
};
