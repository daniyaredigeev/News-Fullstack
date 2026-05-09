'use client';

import { useAuth } from '@/contexts/AuthContext';
import { apiCreateComment, apiDeleteComment, apiGetComments } from '@/lib/api';
import { formatDateRu } from '@/lib/utils';
import type { Comment } from '@/types';
import { useEffect, useState } from 'react';

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetComments(articleId)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [articleId]);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const comment = await apiCreateComment(articleId, content.trim());
      setComments((prev) => [comment, ...prev]);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при отправке комментария');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить комментарий?')) return;
    try {
      await apiDeleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Не удалось удалить комментарий');
    }
  };

  return (
    <section className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Комментарии{' '}
        <span className="text-gray-400 font-normal text-base">({comments.length})</span>
      </h3>

      {/* Add comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                <span className="text-green-700 font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Оставьте ваш комментарий..."
                  rows={3}
                  className="w-full resize-none border-0 outline-none text-gray-800 placeholder-gray-400 text-sm"
                  maxLength={1000}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{content.length}/1000</span>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6 text-center">
          <p className="text-gray-500 text-sm">
            <a href="/login" className="text-green-600 font-medium hover:underline">
              Войдите
            </a>
            , чтобы оставить комментарий
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>Комментариев пока нет. Будьте первым!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <span className="text-green-700 font-bold text-sm">
                    {comment.user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">
                        {comment.user?.name || 'Пользователь'}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {formatDateRu(comment.createdAt)}
                      </span>
                    </div>
                    {(isAdmin || user?.id === comment.userId) && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                        title="Удалить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}