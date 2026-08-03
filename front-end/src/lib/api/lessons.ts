import { api } from './axios';
import { Lesson } from '@/types';

export const lessonsApi = {
  getBySection: async (sectionId: string): Promise<Lesson[]> => {
    const response = await api.get(`/lessons/section/${sectionId}`);
    return response.data.data || response.data;
  },
  getOne: async (id: string): Promise<Lesson> => {
    const response = await api.get(`/lessons/lesson/${id}`);
    return response.data.data || response.data;
  },
  create: async (data: FormData): Promise<Lesson> => {
    const response = await api.post('/lessons/lesson', data);
    return response.data.data || response.data;
  },
  update: async (id: string, data: { name?: string; description?: string; sectionId?: number }): Promise<Lesson> => {
    const response = await api.patch(`/lessons/lesson/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/lessons/lesson/${id}`);
  },
};
