'use client';

import { apiGetAdminNewsById, apiUpdateNews, apiUploadImage, apiGetCities } from '@/lib/api';
import type { Category, City } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: 'GENERAL' as Category,
    cityId: '',
    published: false,
  });
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    apiGetAdminNewsById(id)
      .then((article) => {
        setForm({
          title: article.title,
          excerpt: article.excerpt ?? '',
          content: article.content,
          imageUrl: article.imageUrl ?? '',
          category: article.category,
          cityId: article.cityId != null ? String(article.cityId) : '',
          published: article.published,
        });
        setTags(article.tags ?? []);
      })
      .catch(() => setError('Не удалось загрузить статью'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setForm((f) => ({ ...f, [target.name]: value }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagsInput.trim().replace(/^,|,$/, '');
      if (val && !tags.includes(val)) {
        setTags((t) => [...t, val]);
      }
      setTagsInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags((t) => t.filter((x) => x !== tag));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await apiUploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { cityId: cityIdStr, ...rest } = form;
      await apiUpdateNews(id, {
        ...rest,
        cityId: cityIdStr ? Number(cityIdStr) : undefined,
        tags,
        imageUrl: form.imageUrl || undefined,
      });
      router.push('/admin/news');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Редактировать новость</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm">Основная информация</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Заголовок <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  {CATEGORIES.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Город</label>
                <select
                  name="cityId"
                  value={form.cityId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Выберите город</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Краткое описание <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm">Содержание</h2>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={12}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
            required
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm">Изображение</h2>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          {form.imageUrl ? (
            <div className="space-y-3">
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-green-600 font-medium">
                  Заменить
                </button>
                <button type="button" onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))} className="text-sm text-red-500 font-medium">
                  Удалить
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-gray-300 hover:border-green-400 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-60"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">{uploading ? 'Загрузка...' : 'Загрузить изображение'}</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm">Теги</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full flex items-center gap-1.5">
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-green-400 hover:text-green-700">×</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleTagInput}
            placeholder="Введите тег и нажмите Enter"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
            />
            <div>
              <div className="font-medium text-gray-900 text-sm">Опубликована</div>
              <div className="text-xs text-gray-400">Снимите галочку, чтобы скрыть из публичного списка</div>
            </div>
          </label>
        </div>

        <div className="flex gap-3 pb-6">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}