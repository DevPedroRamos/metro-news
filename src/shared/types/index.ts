export interface User {
  id: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name?: string;
  role?: 'corretor' | 'gerente' | 'superintendente' | 'admin';
  phone?: string;
  avatar_url?: string;
  user?: User;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  author: string;
  date: string;
  slug: string;
  content?: string;
  featured?: boolean;
  views?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  type: 'venda' | 'premiacao' | 'saldo_cef' | 'distrato' | 'outros';
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  description?: string;
}

export interface Commission {
  id: string;
  user_id: string;
  amount: number;
  period: string;
  status: string;
  details?: string;
}

export interface Meta {
  id: string;
  user_id: string;
  target: number;
  achieved: number;
  period: string;
  type: string;
}

export interface Champion {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  points: number;
  rank: number;
  period: string;
  category: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: string;
  direction: SortDirection;
}
