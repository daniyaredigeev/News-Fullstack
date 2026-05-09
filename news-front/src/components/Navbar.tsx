'use client';

import { useAuth } from '@/contexts/AuthContext';
import { apiLogout } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await apiLogout();
    router.push('/');
    setMenuOpen(false);
  };

  return (
    <header className="bg-green-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-white rounded-lg px-2 py-1">
              <span className="text-green-600 font-extrabold text-sm leading-tight">
                ЖКХ
                <br />
                <span className="text-green-700">КЗ</span>
              </span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              ЖКХ Казахстан
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-white/90 hover:text-white font-medium transition-colors"
            >
              Главная
            </Link>
            <Link
              href="/complaint"
              className="text-white/90 hover:text-white font-medium transition-colors"
            >
              Подать жалобу
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-white/20 hover:bg-white/30 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                Админ-панель
              </Link>
            )}
          </nav>

          {/* Auth area (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-white font-medium text-sm">{user?.name}</div>
                  <div className="text-green-200 text-xs">
                    {user?.role === 'SUPER_ADMIN'
                      ? 'Супер-админ'
                      : user?.role === 'ADMIN'
                      ? 'Администратор'
                      : 'Пользователь'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white/90 hover:text-white font-medium transition-colors"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-700 border-t border-green-500">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              className="block text-white py-2 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Главная
            </Link>
            <Link
              href="/complaint"
              className="block text-white py-2 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Подать жалобу
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block text-white py-2 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Админ-панель
              </Link>
            )}
            <div className="border-t border-green-500 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="text-green-200 text-sm py-1">{user?.name}</div>
                  <button
                    onClick={handleLogout}
                    className="block text-white py-2 font-medium w-full text-left"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-white py-2 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link
                    href="/register"
                    className="block text-white py-2 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}