import { api } from './axios';
import { Section } from '@/types';

export const sectionsApi = {
  getByCategory: async (categoryId: string): Promise<Section[]> => {
    const response = await api.get(`/sections/category/${categoryId}`);
    return response.data.data || response.data;
  },
  getOne: async (id: string): Promise<Section> => {
    const response = await api.get(`/sections/section/${id}`);
    return response.data.data || response.data;
  },
  create: async (data: { name: string; categoryId: number }): Promise<Section> => {
    const response = await api.post('/sections/section', data);
    return response.data.data || response.data;
  },
  update: async (id: string, data: { name?: string }): Promise<Section> => {
    const response = await api.patch(`/sections/section/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/sections/section/${id}`);
  },
};
