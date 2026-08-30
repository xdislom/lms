import { api } from './axios';
import { Student } from '@/types';

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/student/student');
    return response.data.data || response.data;
  },
  create: async (data: any): Promise<Student> => {
    let courceId = data.courceId;
    if (!courceId) {
      try {
        const response = await api.get('/cources/cources/all');
        const list = response.data.data || response.data;
        if (Array.isArray(list) && list.length > 0) {
          courceId = list[0].id;
        }
      } catch (e) {
        console.warn('Could not load course for registration fallback', e);
      }
    }
    
    const payload = {
      name: data.name,
      phone: data.phone,
      password: data.password,
      email: data.email || `${Date.now()}@itlive.uz`,
      courceId: Number(courceId || 1)
    };

    const response = await api.post('/auth/register', payload);
    return response.data.data || response.data;
  },
  update: async (id: string, data: any): Promise<Student> => {
    const response = await api.patch(`/student/student/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/student/student/${id}`);
  },
};
