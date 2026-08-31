import { api } from './axios';

export const purchasesApi = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/purchase-cource/all-purchases');
    return response.data.data || response.data;
  },

  getByUserId: async (userId: number): Promise<any[]> => {
    const response = await api.get(`/purchase-cource/purchased-cource/${userId}`);
    return response.data.data || response.data;
  },

  create: async (data: { userId: number; courceId: number }): Promise<any> => {
    const body = { courceId: data.courceId };
    console.log('🛒 Purchase create request:', body);
    try {
      const response = await api.post('/purchase-cource', body);
      console.log('🛒 Purchase create response:', response.data);
      return response.data.data || response.data;
    } catch (err: any) {
      console.error('🛒 Purchase create error FULL:', JSON.stringify(err.response?.data, null, 2));
      throw err;
    }
  },

  approve: async (purchaseId: number, courseId: number): Promise<any> => {
    const response = await api.patch(`/purchase-cource/${purchaseId}/${courseId}/approve`);
    return response.data.data || response.data;
  },

  delete: async (userId: number, courceId: number): Promise<void> => {
    await api.delete(`/purchase-cource/${userId}/${courceId}/delete`);
  },
};

