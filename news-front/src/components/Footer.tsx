import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-green-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-600 rounded-lg px-2 py-1">
                <span className="text-white font-extrabold text-sm">ЖКХ КЗ</span>
              </div>
              <span className="font-bold text-gray-800 text-lg">ЖКХ Казахстан</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Актуальные новости жилищно-коммунального хозяйства Казахстана.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/complaint" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                  Подать жалобу
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                  Войти
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                  Регистрация
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Категории</h3>
            <ul className="space-y-2">
              {[
                'Водоснабжение',
                'Электроснабжение',
                'Теплоснабжение',
                'Дороги',
                'Мусор и ТБО',
              ].map((cat) => (
                <li key={cat}>
                  <span className="text-gray-500 text-sm">{cat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 ЖКХ Казахстан. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            {/* Social placeholders */}
            <a
              href="#"
              aria-label="Telegram"
              className="text-gray-400 hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.16 14.605l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.656.981z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-gray-400 hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}