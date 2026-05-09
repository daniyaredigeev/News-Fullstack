'use client';

import { useAuth } from '@/contexts/AuthContext';
import { apiCreateComplaint, apiCreateComplaintAuth, apiGetCities } from '@/lib/api';
import type { City, ProblemType } from '@/types';
import { PROBLEM_TYPE_LABELS } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface ComplaintModalProps {
  open: boolean;
  onClose: () => void;
}

const PROBLEM_TYPES: ProblemType[] = ['WATER', 'ELECTRICITY', 'HEAT', 'GARBAGE', 'OTHER'];

export default function ComplaintModal({ open, onClose }: ComplaintModalProps) {
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
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      apiGetCities().then(setCities).catch(() => {});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.address || !form.phone || !form.cityId) {
      setError('Заполните обязательные поля');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const fn = isAuthenticated ? apiCreateComplaintAuth : apiCreateComplaint;
      await fn({ ...form, cityId: Number(form.cityId) });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при отправке');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setForm({ address: '', problemType: 'WATER', phone: '', description: '', cityId: '' });
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Подать жалобу</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Жалоба отправлена!</h3>
            <p className="text-gray-500 mb-6">Ваша жалоба успешно зарегистрирована. Мы рассмотрим её в ближайшее время.</p>
            <button
              onClick={handleClose}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="ул. Абая, 10"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип проблемы <span className="text-red-500">*</span>
              </label>
              <select
                name="problemType"
                value={form.problemType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {PROBLEM_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {PROBLEM_TYPE_LABELS[pt]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Город <span className="text-red-500">*</span>
              </label>
              <select
                name="cityId"
                value={form.cityId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+7 (777) 123-45-67"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание{' '}
                <span className="text-gray-400 font-normal">(необязательно)</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Подробное описание проблемы..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? 'Отправка...' : 'Отправить жалобу'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}