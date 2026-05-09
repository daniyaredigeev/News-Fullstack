'use client';

import { apiGetUsers, apiUpdateUserRole, apiDeleteUser } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateRu } from '@/lib/utils';
import type { User, Role } from '@/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ROLE_LABELS: Record<Role, string> = {
  USER: 'Пользователь',
  ADMIN: 'Админ',
  SUPER_ADMIN: 'Супер-админ',
};

const ROLE_COLORS: Record<Role, string> = {
  USER: 'bg-gray-100 text-gray-700',
  ADMIN: 'bg-blue-100 text-blue-700',
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
};

export default function UsersPage() {
  const { user: me } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (me && me.role !== 'SUPER_ADMIN') {
      router.replace('/admin');
      return;
    }
    apiGetUsers()
      .then(setUsers)
      .catch(() => setError('Не удалось загрузить пользователей'))
      .finally(() => setLoading(false));
  }, [me, router]);

  const handleRoleChange = async (id: string, role: Role) => {
    if (id === me?.id) return;
    setUpdatingId(id);
    try {
      const updated = await apiUpdateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u)));
    } catch {
      alert('Не удалось изменить роль');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === me?.id) return alert('Нельзя удалить самого себя');
    if (!confirm('Удалить пользователя? Это действие необратимо.')) return;
    try {
      await apiDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Не удалось удалить пользователя');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
          <p className="text-sm text-gray-500 mt-1">Управление ролями и аккаунтами</p>
        </div>
        {!loading && (
          <span className="bg-purple-50 text-purple-700 text-sm font-medium px-3 py-1.5 rounded-full">
            {users.length} пользователей
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-48" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Пользователь</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Роль</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Дата регистрации</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <span className="text-green-700 font-bold text-sm">
                          {u.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        {u.id === me?.id && (
                          <div className="text-xs text-green-600">это вы</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{u.email}</td>
                  <td className="px-5 py-4">
                    {u.id === me?.id ? (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[u.role]}`}>
                        {ROLE_LABELS[u.role]}
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60 cursor-pointer"
                      >
                        <option value="USER">Пользователь</option>
                        <option value="ADMIN">Админ</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-400">{formatDateRu(u.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    {u.id !== me?.id && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        title="Удалить пользователя"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}