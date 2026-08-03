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
};
