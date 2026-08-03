import { api } from './axios';
import { Material } from '@/types';

export const materialsApi = {
  getByLesson: async (lessonId: string): Promise<Material[]> => {
    const response = await api.get(`/materials/lesson/${lessonId}`);
    return response.data.data || response.data;
  },
  getOne: async (id: string): Promise<Material> => {
    const response = await api.get(`/materials/material/${id}`);
    return response.data.data || response.data;
  },
  create: async (data: FormData): Promise<Material> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch('http://localhost:3001/api/v1/materials/material', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data,
    });
    if (!res.ok) throw new Error(`Request failed with status code ${res.status}`);
    const json = await res.json();
    return json.data || json;
  },
  update: async (id: string, data: { description?: string; lessonId?: number }): Promise<Material> => {
    const response = await api.patch(`/materials/material/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/materials/material/${id}`);
  },
};
