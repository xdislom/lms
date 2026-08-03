import { api } from './axios';
import { Course } from '@/types';

export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const response = await api.get('/cources/cources/all');
    return response.data.data || response.data;
  },
  getById: async (id: string): Promise<Course> => {
    const response = await api.get(`/cources/cources/${id}`);
    return response.data.data || response.data;
  },
  create: async (data: FormData): Promise<Course> => {
    const response = await api.post('/cources/cources', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },
  update: async (id: string, data: FormData | Record<string, any>): Promise<Course> => {
    const response = await api.patch(`/cources/cources/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/cources/cources/${id}`);
  },
};

