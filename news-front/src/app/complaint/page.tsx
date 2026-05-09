'use client';

import { useAuth } from '@/contexts/AuthContext';
import { apiCreateComplaint, apiCreateComplaintAuth, apiGetCities } from '@/lib/api';
import type { City, ProblemType } from '@/types';
import { PROBLEM_TYPE_LABELS } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PROBLEM_TYPES: ProblemType[] = ['WATER', 'ELECTRICITY', 'HEAT', 'GARBAGE', 'OTHER'];

export default function ComplaintPage() {
  const { isAuthenticated } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    address: '',
    problemType: 'WATER' as ProblemType,
    phone: '',
    description: '',
    cityId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetCities().then(setCities).catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.address || !form.phone || !form.cityId) {
      setError('Заполните все обязательные поля');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const fn = isAuthenticated ? apiCreateComplaintAuth : apiCreateComplaint;
      await fn({ ...form, cityId: Number(form.cityId) });
      setSuccess(true);
      setForm({ address: '', problemType: 'WATER', phone: '', description: '', cityId: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при отправке');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            На главную
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Подать жалобу</h1>
          <p className="text-gray-500 mt-1">
            Сообщите о проблеме в жилищно-коммунальном хозяйстве вашего города
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Жалоба отправлена!</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Ваша жалоба успешно зарегистрирована. Специалисты рассмотрят её в ближайшее время.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSuccess(false)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Подать ещё одну
              </button>
              <Link
                href="/"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors text-center"
              >
                На главную
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm mb-6 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <Link href="/login" className="font-medium underline">
                    Войдите в аккаунт
                  </Link>
                  , чтобы связать жалобу с вашим профилем. Это не обязательно.
                </span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Адрес <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="г. Алматы, ул. Абая, д. 10, кв. 5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Тип проблемы <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="problemType"
                    value={form.problemType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    {PROBLEM_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {PROBLEM_TYPE_LABELS[pt]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Город <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cityId"
                    value={form.cityId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Выберите город</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Контактный телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+7 (777) 123-45-67"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Описание проблемы{' '}
                  <span className="text-gray-400 font-normal">(необязательно)</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Подробно опишите проблему: что происходит, как давно, что уже предпринималось..."
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
              >
                {submitting ? 'Отправка...' : 'Отправить жалобу'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}