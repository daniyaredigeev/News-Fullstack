'use client';

import { useAuth } from '@/contexts/AuthContext';
import { apiLogout } from '@/lib/api';
import { formatDateRu } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const ROLE_LABELS: Record<string, string> = {
  USER: 'Пользователь',
  ADMIN: 'Администратор',
  SUPER_ADMIN: 'Супер-администратор',
};

const ROLE_COLORS: Record<string, string> = {
  USER: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-green-100 text-green-700',
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
};

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await apiLogout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Нет доступа</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Профиль</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Avatar header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-extrabold text-2xl">
                  {user.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <span
                  className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold ${
                    ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Имя</span>
              <span className="text-sm font-medium text-gray-900">{user.name}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Роль</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {ROLE_LABELS[user.role] || user.role}
              </span>
            </div>
            {user.createdAt && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Дата регистрации</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDateRu(user.createdAt)}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}