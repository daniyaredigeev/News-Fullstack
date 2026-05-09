'use client';

import { useAuth } from '@/contexts/AuthContext';
import { apiGetLikeStatus, apiToggleLike } from '@/lib/api';
import { useEffect, useState } from 'react';

interface LikeButtonProps {
  articleId: string;
  initialCount: number;
  initialLiked?: boolean;
}

export default function LikeButton({ articleId, initialCount, initialLiked = false }: LikeButtonProps) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiGetLikeStatus(articleId)
      .then((data) => setLiked(data.liked))
      .catch(() => {});
  }, [articleId, isAuthenticated]);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const res = await apiToggleLike(articleId);
      setLiked(res.liked);
      setCount((c) => (res.liked ? c + 1 : c - 1));
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
          liked
            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
        } disabled:opacity-60`}
        title={liked ? 'Убрать лайк' : 'Поставить лайк'}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${animating ? 'scale-125' : 'scale-100'}`}
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{count}</span>
      </button>

      {showHint && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg">
          Войдите, чтобы поставить лайк
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
}