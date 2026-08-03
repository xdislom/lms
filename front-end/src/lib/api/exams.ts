import { api } from './axios';
import { Exam, Answer } from '@/types';

export const examsApi = {
  getByLesson: async (lessonId: string): Promise<Exam[]> => {
    const response = await api.get(`/exams/exam/${lessonId}`);
    return response.data.data || response.data;
  },
  create: async (data: {
    lessonId: number;
    question: string;
    variantA: string;
    variantB: string;
    variantC: string;
    variantD: string;
    answer: Answer;
  }): Promise<Exam> => {
    const response = await api.post('/exams/exam', data);
    return response.data.data || response.data;
  },
  update: async (id: string, data: {
    question?: string;
    variantA?: string;
    variantB?: string;
    variantC?: string;
    variantD?: string;
    answer?: Answer;
  }): Promise<Exam> => {
    const response = await api.patch(`/exams/exam/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/exams/exam/${id}`);
  },
};
