'use client';

import { apiGetCities, apiGetComplaints } from '@/lib/api';
import { formatDateRu } from '@/lib/utils';
import type { City, Complaint, ProblemType } from '@/types';
import { PROBLEM_TYPE_LABELS } from '@/types';
import { useCallback, useEffect, useState } from 'react';

const PAGE_SIZE = 15;
const PROBLEM_TYPES: ProblemType[] = ['WATER', 'ELECTRICITY', 'HEAT', 'GARBAGE', 'OTHER'];

const PROBLEM_TYPE_COLORS: Record<ProblemType, string> = {
  WATER: 'bg-blue-100 text-blue-700',
  ELECTRICITY: 'bg-yellow-100 text-yellow-700',
  HEAT: 'bg-orange-100 text-orange-700',
  GARBAGE: 'bg-gray-100 text-gray-700',
  OTHER: 'bg-purple-100 text-purple-700',
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);

  const [filterCityId, setFilterCityId] = useState('');
  const [filterProblemType, setFilterProblemType] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetComplaints({
        cityId: filterCityId || undefined,
        problemType: filterProblemType || undefined,
        from: filterFrom || undefined,
        to: filterTo || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setComplaints(res.complaints);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [filterCityId, filterProblemType, filterFrom, filterTo, page]);

  useEffect(() => {
    apiGetCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchComplaints();
  };

  const handleClearFilters = () => {
    setFilterCityId('');
    setFilterProblemType('');
    setFilterFrom('');
    setFilterTo('');
    setPage(1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Жалобы граждан</h1>
        <p className="text-gray-500 text-sm mt-0.5">Всего: {total}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={filterCityId}
            onChange={(e) => setFilterCityId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Все города</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>

          <select
            value={filterProblemType}
            onChange={(e) => setFilterProblemType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Все типы</option>
            {PROBLEM_TYPES.map((pt) => (
              <option key={pt} value={pt}>{PROBLEM_TYPE_LABELS[pt]}</option>
            ))}
          </select>

          <div>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="От"
              title="От"
            />
          </div>

          <div>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="До"
              title="До"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleApplyFilters}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Применить
          </button>
          <button
            onClick={handleClearFilters}
            className="border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Сбросить
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Жалоб не найдено
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Адрес</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Тип</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Город</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Телефон</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Дата</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Описание</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 text-sm">{complaint.address}</div>
                      {complaint.user && (
                        <div className="text-xs text-gray-400 mt-0.5">{complaint.user.name}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PROBLEM_TYPE_COLORS[complaint.problemType]}`}>
                        {PROBLEM_TYPE_LABELS[complaint.problemType]}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{complaint.city?.name}</span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">{complaint.phone}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-400">{formatDateRu(complaint.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-xs text-gray-500 line-clamp-2 max-w-xs">
                        {complaint.description || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 transition-colors"
          >
            Назад
          </button>
          <span className="text-sm text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 transition-colors"
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}