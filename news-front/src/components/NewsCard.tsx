import { formatDateRu } from '@/lib/utils';
import type { Article } from '@/types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
  article: Article;
}

function ImagePlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
      <svg
        className="w-12 h-12 text-white/60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    </div>
  );
}

export default function NewsCard({ article }: NewsCardProps) {
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;
  const categoryColor = CATEGORY_COLORS[article.category] || 'bg-gray-100 text-gray-700';
  const likes = article._count?.likes ?? 0;
  const comments = article._count?.comments ?? 0;

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImagePlaceholder />
        )}
        {/* Category badge over image */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* City + date */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{article.city?.name}</span>
          <span className="text-gray-300">•</span>
          <span>{formatDateRu(article.createdAt)}</span>
        </div>

        {/* Title */}
        <h2 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {article.excerpt}
        </p>

        {/* Footer stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          {/* Views */}
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{article.viewCount}</span>
          </div>

          {/* Likes */}
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likes}</span>
          </div>

          {/* Comments */}
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}