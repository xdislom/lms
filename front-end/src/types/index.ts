export interface User {
  id: number;
  name: string;
  phone: string;
  role: 'admin' | 'mentor' | 'assistent' | 'student' | string;
  create_at?: string;
  password?: string;
  file?: string;
  cources?: { id: number; name: string };
  mentor?: {
    experience?: number;
    job?: string;
    web_link?: string;
    description?: string;
    facebook?: string;
    telegram?: string;
    linkedIn?: string;
    instagtam?: string;
    github?: string;
  };
}

export interface Admin extends User {
  role: 'admin';
}

export interface Mentor extends User {
  role: 'mentor';
}

export interface Assistent extends User {
  role: 'assistent';
}

export interface Student extends User {
  role: 'student';
}

export interface Category {
  id: number;
  name: string;
  create_at?: string;
  update_at?: string;
}

export interface Course {
  id: number;
  banner: string;
  intro_video: string;
  name: string;
  description: string;
  level: 'BEGINNER' | 'ELEMENTRY' | 'PRE_INTERMIDIATE' | 'INTERMIDIATE' | 'ADVANCED';
  price: string | number;
  categoryId: number;
  mentorId: number;
  userId?: number;
  create_at?: string;
  update_at?: string;
  category?: Category;
  mentor?: Mentor;
  users?: User[];
}

export interface Section {
  id: number;
  name: string;
  categoryId?: number;
  courcesId?: number;
  create_at?: string;
  update_at?: string;
  category?: Category;
  cources?: Course;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  name: string;
  sectionId: number;
  description: string;
  introVideo?: string;
  create_at?: string;
  update_at?: string;
  section?: Section;
}



export interface MaterialFile {
  id: number;
  file: string;
}

export interface Material {
  id: number;
  lessonId: number;
  description: string;
  create_at?: string;
  update_at?: string;
  lesson?: { name: string };
  materialFiles?: MaterialFile[];
}

export interface Homework {
  id: number;
  lessonId: number;
  description: string;
  file?: string | null;
  create_at?: string;
  update_at?: string;
}

export type Answer = 'answerA' | 'answerB' | 'answerC' | 'answerD';

export interface Exam {
  id: number;
  lessonId: number;
  question: string;
  variantA: string;
  variantB: string;
  variantC: string;
  variantD: string;
  answer: Answer;
  create_at?: string;
  update_at?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
