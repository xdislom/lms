import { api } from './axios';
import { Category } from '@/types';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/category/categiry/all');
    return response.data.data || response.data;
  },
  create: async (data: any): Promise<Category> => {
    const response = await api.post('/category/category', data);
    return response.data.data || response.data;
  },
  update: async (id: string, data: any): Promise<Category> => {
    const response = await api.patch(`/category/category/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/category/category/${id}`);
  },
};
