import { api } from './axios';
import { Student } from '@/types';

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/student/student');
    return response.data.data || response.data;
  },
};
