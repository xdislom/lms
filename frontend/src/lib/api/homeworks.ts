import { api } from './axios';
import { Homework } from '@/types';

export const homeworksApi = {
  getByLesson: async (lessonId: string): Promise<Homework[]> => {
    const response = await api.get(`/homeworks/homeworks/${lessonId}`);
    return response.data.data || response.data;
  },
  create: async (data: FormData): Promise<Homework> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch('http://localhost:4000/api/v1/homeworks/homeworks', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data,
    });
    if (!res.ok) throw new Error(`Request failed with status code ${res.status}`);
    const json = await res.json();
    return json.data || json;
  },
  update: async (id: string, data: { description?: string; lessonId?: number }): Promise<Homework> => {
    const response = await api.patch(`/homeworks/homeworks/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/homeworks/homeworks/${id}`);
  },
};
