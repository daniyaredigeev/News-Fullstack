import {
  clearAccessToken,
  clearUserInfo,
  getAccessToken,
  saveAccessToken,
  saveUserInfo,
} from '@/lib/auth';
import type {
  Article,
  City,
  Comment,
  Complaint,
  ComplaintInput,
  ComplaintsFilter,
  ComplaintsResponse,
  CreateNewsInput,
  NewsFilter,
  NewsResponse,
  UpdateNewsInput,
  User,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function notifyAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-changed'));
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, options, false);
    } else {
      clearAccessToken();
      clearUserInfo();
      notifyAuthChanged();
      throw new Error('Unauthorized');
    }
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.accessToken) {
      saveAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string): Promise<User> {
  const data = await request<{ accessToken: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveAccessToken(data.accessToken);
  if (data.user) {
    saveUserInfo(data.user);
  }
  notifyAuthChanged();
  return data.user;
}

export async function apiRegister(
  email: string,
  name: string,
  password: string,
): Promise<User> {
  const data = await request<{ accessToken: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, name, password }),
  });
  saveAccessToken(data.accessToken);
  if (data.user) {
    saveUserInfo(data.user);
  }
  notifyAuthChanged();
  return data.user;
}

export async function apiLogout(): Promise<void> {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch {
    // ignore errors on logout
  }
  clearAccessToken();
  clearUserInfo();
  notifyAuthChanged();
}

export async function apiGetProfile(): Promise<User> {
  return request<User>('/auth/me');
}

// ─── Cities ──────────────────────────────────────────────────────────────────

export async function apiGetCities(): Promise<City[]> {
  return request<City[]>('/cities');
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function apiGetNews(filter: NewsFilter = {}): Promise<NewsResponse> {
  const params = new URLSearchParams();
  if (filter.cityId) params.set('cityId', filter.cityId);
  if (filter.category) params.set('category', filter.category);
  if (filter.tag) params.set('tag', filter.tag);
  if (filter.search) params.set('search', filter.search);
  if (filter.page) params.set('page', String(filter.page));
  if (filter.limit) params.set('limit', String(filter.limit));
  const qs = params.toString();
  return request<NewsResponse>(`/news${qs ? `?${qs}` : ''}`);
}

export async function apiGetNewsBySlug(slug: string): Promise<Article> {
  return request<Article>(`/news/${slug}`);
}

export async function apiGetAdminNewsById(id: string): Promise<Article> {
  return request<Article>(`/news/admin/one/${id}`);
}

export async function apiGetAdminNews(filter: NewsFilter = {}): Promise<NewsResponse> {
  const params = new URLSearchParams();
  if (filter.cityId) params.set('cityId', filter.cityId);
  if (filter.category) params.set('category', filter.category);
  if (filter.search) params.set('search', filter.search);
  if (filter.page) params.set('page', String(filter.page));
  if (filter.limit) params.set('limit', String(filter.limit));
  const qs = params.toString();
  return request<NewsResponse>(`/news/admin/all${qs ? `?${qs}` : ''}`);
}

export async function apiCreateNews(data: CreateNewsInput): Promise<Article> {
  return request<Article>('/news', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateNews(id: string, data: UpdateNewsInput): Promise<Article> {
  return request<Article>(`/news/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function apiDeleteNews(id: string): Promise<void> {
  return request<void>(`/news/${id}`, { method: 'DELETE' });
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function apiUploadImage(file: File): Promise<{ url: string }> {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/upload/image`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }
  return res.json();
}

// ─── Likes ────────────────────────────────────────────────────────────────────

export async function apiToggleLike(articleId: string): Promise<{ liked: boolean }> {
  return request<{ liked: boolean }>(`/like/${articleId}`, { method: 'POST' });
}

export async function apiGetLikeStatus(articleId: string): Promise<{ liked: boolean }> {
  return request<{ liked: boolean }>(`/like/${articleId}/me`);
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export async function apiGetComments(articleId: string): Promise<Comment[]> {
  return request<Comment[]>(`/comment/${articleId}`);
}

export async function apiCreateComment(
  articleId: string,
  content: string,
): Promise<Comment> {
  return request<Comment>(`/comment/${articleId}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function apiDeleteComment(id: string): Promise<void> {
  return request<void>(`/comment/${id}`, { method: 'DELETE' });
}

// ─── Complaints ───────────────────────────────────────────────────────────────

export async function apiCreateComplaint(data: ComplaintInput): Promise<Complaint> {
  return request<Complaint>('/complaint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiCreateComplaintAuth(data: ComplaintInput): Promise<Complaint> {
  return request<Complaint>('/complaint/auth', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiGetComplaints(
  filter: ComplaintsFilter = {},
): Promise<ComplaintsResponse> {
  const params = new URLSearchParams();
  if (filter.cityId) params.set('cityId', filter.cityId);
  if (filter.problemType) params.set('problemType', filter.problemType);
  if (filter.from) params.set('from', filter.from);
  if (filter.to) params.set('to', filter.to);
  if (filter.page) params.set('page', String(filter.page));
  if (filter.limit) params.set('limit', String(filter.limit));
  const qs = params.toString();
  return request<ComplaintsResponse>(`/complaint${qs ? `?${qs}` : ''}`);
}

export async function apiGetComplaint(id: string): Promise<Complaint> {
  return request<Complaint>(`/complaint/${id}`);
}

// ─── Users (SuperAdmin) ───────────────────────────────────────────────────────

export async function apiGetUsers(): Promise<User[]> {
  return request<User[]>('/users');
}

export async function apiUpdateUserRole(id: string, role: string): Promise<User> {
  return request<User>(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export async function apiDeleteUser(id: string): Promise<void> {
  return request<void>(`/users/${id}`, { method: 'DELETE' });
}