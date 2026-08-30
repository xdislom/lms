import { api } from './axios';
import { Assistent } from '@/types';

export const assistentsApi = {
  getAll: async (): Promise<Assistent[]> => {
    const response = await api.get('/assistent/assistent');
    return response.data.data || response.data;
  },
  getById: async (id: string): Promise<Assistent> => {
    const response = await api.get(`/assistent/assistent/${id}`);
    return response.data.data || response.data;
  },
  create: async (data: any): Promise<Assistent> => {
    const response = await api.post('/assistent/assistent', data);
    return response.data.data || response.data;
  },
  update: async (id: string, data: any): Promise<Assistent> => {
    const response = await api.patch(`/assistent/assistent/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/assistent/assistent/${id}`);
  },
};
