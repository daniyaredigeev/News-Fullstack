'use client';

import ComplaintModal from '@/components/ComplaintModal';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';
import { apiGetCities, apiGetNews } from '@/lib/api';
import type { Article, Category, City } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

const CATEGORIES: { value: Category | ''; label: string }[] = [
  { value: '', label: 'Все' },
  { value: 'GENERAL', label: 'Общие' },
  { value: 'WATER', label: 'Водоснабжение' },
  { value: 'ELECTRICITY', label: 'Электроснабжение' },
  { value: 'HEAT', label: 'Теплоснабжение' },
  { value: 'GAS', label: 'Газоснабжение' },
  { value: 'GARBAGE', label: 'Мусор' },
  { value: 'ROAD', label: 'Дороги' },
  { value: 'ANNOUNCEMENT', label: 'Объявления' },
];

const PAGE_SIZE = 9;

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [cityId, setCityId] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [complaintOpen, setComplaintOpen] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetNews({
        cityId: cityId || undefined,
        category: category || undefined,
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setArticles(res.articles);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [cityId, category, search, page]);

  useEffect(() => {
    apiGetCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const handleCategoryChange = (cat: Category | '') => {
    setCategory(cat);
    setPage(1);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCityId(e.target.value);
    setPage(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            Новости ЖКХ Казахстана
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            ЖКХ Казахстан
          </h1>
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto">
            Актуальные новости жилищно-коммунального хозяйства. Водоснабжение, электроснабжение,
            теплоснабжение и другие коммунальные вопросы.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setComplaintOpen(true)}
              className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg"
            >
              Подать жалобу
            </button>
            <a
              href="#news"
              className="border-2 border-white/50 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Читать новости
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>
              <span className="font-semibold text-gray-900">{total}</span> новостей
            </span>
            <span>
              <span className="font-semibold text-gray-900">{cities.length}</span> городов
            </span>
          </div>
        </div>
      </div>

      {/* Filters (sticky) */}
      <div id="news" className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* City select */}
            <select
              value={cityId}
              onChange={handleCityChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white min-w-[160px]"
            >
              <option value="">Все города</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchInput}
                placeholder="Поиск новостей..."
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0015 3H5" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Новости не найдены</h3>
            <p className="text-gray-400">Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating complaint button */}
      <button
        onClick={() => setComplaintOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        title="Подать жалобу"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline">Подать жалобу</span>
      </button>

      <ComplaintModal open={complaintOpen} onClose={() => setComplaintOpen(false)} />
    </>
  );
}