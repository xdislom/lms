import { api } from './axios';
import { AuthResponse } from '@/types';

export const authApi = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data.data || response.data;
  },
  register: async (data: any): Promise<any> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  verifyOtp: async (data: any): Promise<AuthResponse | any> => {
    const response = await api.post('/auth/verify-telegram-otp', data);
    return response.data.data || response.data;
  },
  resetPassword: async (data: any): Promise<any> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }
};
