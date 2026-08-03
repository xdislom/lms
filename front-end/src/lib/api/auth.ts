import { api } from './axios';
import { AuthResponse } from '@/types';

export const authApi = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data.data || response.data;
  },
};
