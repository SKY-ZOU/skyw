'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/sections/HeroSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { ArrowRight } from 'lucide-react';
import { loc } from '@/lib/locale-utils';

interface ArticleRow {
  id: number;
  slug: string;
  category: string;
  date: string;
  titleZhCN: string; titleZhTW: string; titleEn: string;
  excerptZhCN: string; excerptZhTW: string; excerptEn: string;
}

export default function InsightsClient({ articles }: { articles: ArticleRow[] }) {
  const t = useTranslations('Insights');
  const locale = useLocale();
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { key: 'all', label: t('allCategory') },
    { key: 'news', label: t('categoryNews') },
    { key: 'market', label: t('categoryMarket') },
    { key: 'industry', label: t('categoryIndustry') },
  ];

  const filtered =
    filter === 'all' ? articles : articles.filter((a) => a.category === filter);

  const categoryLabels: Record<string, string> = {
    news: t('categoryNews'),
    market: t('categoryMarket'),
    industry: t('categoryIndustry'),
  };

  return (
    <>
      <HeroSection title={t('heroTitle')} subtitle={t('heroSubtitle')} />

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="mb-12 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-5 py-2 text-body-sm font-medium uppercase tracking-[0.08em] transition-colors ${
                  filter === cat.key
                    ? 'border-b-2 border-navy-900 text-navy-900'
                    : 'text-[#adb5bd] hover:text-[#495057]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid gap-px bg-[#e5e7eb] md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article, i) => (
              <AnimatedSection key={article.slug} delay={i * 0.08}>
                <Link
                  href={`/insights/${article.slug}`}
                  className="group flex h-full flex-col justify-between bg-white p-8 transition-colors hover:bg-[#fafafa]"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-caption font-medium uppercase tracking-wider text-gold-500">
                        {categoryLabels[article.category]}
                      </span>
                      <span className="text-caption text-[#adb5bd]">{article.date}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold leading-snug text-[#1a1a2e] group-hover:text-navy-700">
                      {loc(article, 'title', locale)}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-body text-[#6c757d]">
                      {loc(article, 'excerpt', locale)}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-body-sm font-medium uppercase tracking-[0.08em] text-gold-500 group-hover:text-navy-900">
                    {t('readMore')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
