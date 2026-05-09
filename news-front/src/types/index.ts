export type CityType = 'MEGACITY' | 'OBLAST';

export type Category =
  | 'GENERAL'
  | 'WATER'
  | 'ELECTRICITY'
  | 'HEAT'
  | 'GAS'
  | 'GARBAGE'
  | 'ROAD'
  | 'ANNOUNCEMENT';

export type ProblemType = 'WATER' | 'ELECTRICITY' | 'HEAT' | 'GARBAGE' | 'OTHER';

export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface City {
  id: number;
  name: string;
  type: CityType;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface ArticleAuthor {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl?: string | null;
  category: Category;
  tags: string[];
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  city: City | null;
  cityId: number | null;
  author: ArticleAuthor;
  authorId: string;
  _count?: {
    likes: number;
    comments: number;
  };
  comments?: Comment[];
}

export interface NewsResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NewsFilter {
  cityId?: string;
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateNewsInput {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  category: Category;
  tags?: string[];
  cityId?: number;
  published?: boolean;
}

export type UpdateNewsInput = Partial<CreateNewsInput>;

// Бэк возвращает { user: { id, name }, userId, ... }
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: ArticleAuthor;
  userId: string;
  articleId: string;
}

export interface Like {
  id: string;
  userId: string;
  articleId: string;
}

export interface Complaint {
  id: string;
  address: string;
  problemType: ProblemType;
  phone: string;
  description?: string | null;
  cityId: number;
  city: City;
  userId?: string | null;
  user?: User | null;
  createdAt: string;
}

export interface ComplaintInput {
  address: string;
  problemType: ProblemType;
  phone: string;
  description?: string;
  cityId: number;
}

export interface ComplaintsFilter {
  cityId?: string;
  problemType?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface ComplaintsResponse {
  complaints: Complaint[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  GENERAL: 'Общие новости',
  WATER: 'Водоснабжение',
  ELECTRICITY: 'Электроснабжение',
  HEAT: 'Теплоснабжение',
  GAS: 'Газоснабжение',
  GARBAGE: 'Мусор и ТБО',
  ROAD: 'Дороги',
  ANNOUNCEMENT: 'Объявления',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  GENERAL: 'bg-slate-100 text-slate-700',
  WATER: 'bg-blue-100 text-blue-700',
  ELECTRICITY: 'bg-yellow-100 text-yellow-700',
  HEAT: 'bg-orange-100 text-orange-700',
  GAS: 'bg-purple-100 text-purple-700',
  GARBAGE: 'bg-gray-100 text-gray-700',
  ROAD: 'bg-stone-100 text-stone-700',
  ANNOUNCEMENT: 'bg-green-100 text-green-700',
};

export const PROBLEM_TYPE_LABELS: Record<ProblemType, string> = {
  WATER: 'Вода',
  ELECTRICITY: 'Электричество',
  HEAT: 'Тепло',
  GARBAGE: 'Мусор',
  OTHER: 'Другое',
};