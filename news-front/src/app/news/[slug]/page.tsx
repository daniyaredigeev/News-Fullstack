import CommentSection from '@/components/CommentSection';
import LikeButton from '@/components/LikeButton';
import { formatDateRu } from '@/lib/utils';
import type { Article } from '@/types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import ShareButton from './ShareButton';

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/news/${slug}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Статья не найдена' };
  return {
    title: `${article.title} — ЖКХ Казахстан`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Статья не найдена</h1>
        <p className="text-gray-500 mb-6">Возможно, она была удалена или ссылка неверна.</p>
        <Link
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          На главную
        </Link>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;
  const categoryColor = CATEGORY_COLORS[article.category] || 'bg-gray-100 text-gray-700';
  const likes = article._count?.likes ?? 0;

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Hero image */}
      <div className="relative w-full h-64 md:h-96 bg-gray-200">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-800 flex items-center justify-center">
            <svg className="w-20 h-20 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Главная
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}>
              {categoryLabel}
            </span>
          </nav>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColor}`}>
              {categoryLabel}
            </span>
            {article.city && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {article.city.name}
              </span>
            )}
            <span className="text-sm text-gray-400">{formatDateRu(article.createdAt)}</span>
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.viewCount}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-gray-500 text-lg leading-relaxed mb-6 pb-6 border-b border-gray-100">
            {article.excerpt}
          </p>

          {/* Author */}
          {article.author && (
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-bold text-sm">
                  {article.author.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">{article.author.name}</div>
                <div className="text-gray-400 text-xs">Автор</div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-gray max-w-none mb-8">
            {article.content.split('\n').map((para, i) =>
              para.trim() ? (
                <p key={i} className="text-gray-700 leading-relaxed mb-4 text-base">
                  {para}
                </p>
              ) : (
                <br key={i} />
              ),
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-100">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap mb-10">
            <LikeButton
              articleId={article.id}
              initialCount={likes}
            />
            <ShareButton />
          </div>

          {/* Comments */}
          <CommentSection articleId={article.id} />
        </div>
      </div>

      <div className="pb-10" />
    </article>
  );
}