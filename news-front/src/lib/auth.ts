import type { User } from '@/types';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_INFO_KEY = 'userInfo';

function setCookie(name: string, value: string, minutes: number) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveAccessToken(token: string): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  setCookie(ACCESS_TOKEN_KEY, token, 15);
}

export function clearAccessToken(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  deleteCookie(ACCESS_TOKEN_KEY);
}

export function getUserInfo(): User | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveUserInfo(info: User): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
}

export function clearUserInfo(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(USER_INFO_KEY);
}