'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const QUICK_LINKS = [
  {
    href: '/admin/news',
    label: 'Управление новостями',
    description: 'Создание, редактирование и удаление новостей',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0015 3H5" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/admin/news/create',
    label: 'Создать новость',
    description: 'Добавить новую статью',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    color: 'bg-green-50 text-green-600',
  },
  {
    href: '/admin/complaints',
    label: 'Жалобы граждан',
    description: 'Просмотр и обработка жалоб',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: 'bg-orange-50 text-orange-600',
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Добро пожаловать, {user?.name}!
        </h1>
        <p className="text-gray-500 mt-1">
          Панель управления ЖКХ Казахстан
        </p>
      </div>

      {/* Role badge */}
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-8 flex items-center gap-3">
        <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-green-800 text-sm">
            {user?.role === 'SUPER_ADMIN' ? 'Супер-администратор' : 'Администратор'}
          </div>
          <div className="text-green-600 text-xs">
            {user?.email}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Быстрые действия
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-sm transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${link.color}`}>
              {link.icon}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors">
              {link.label}
            </h3>
            <p className="text-gray-400 text-xs mt-1">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}