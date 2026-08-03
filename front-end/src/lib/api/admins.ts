import { api } from './axios';
import { Admin } from '@/types';

export const adminsApi = {
  getAll: async (): Promise<Admin[]> => {
    const response = await api.get('/admin/admin');
    return response.data.data || response.data;
  },
  create: async (data: any): Promise<Admin> => {
    const response = await api.post('/admin/admin', data);
    return response.data.data || response.data;
  },
  update: async (id: string, data: any): Promise<Admin> => {
    const response = await api.patch(`/admin/admin/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/admin/${id}`);
  },
};
