'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/sections/HeroSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { ArrowRight } from 'lucide-react';
import { loc } from '@/lib/locale-utils';
import { motion } from 'framer-motion';

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

  const articleImages = [
    '/images/home/corridor-london.png',
    '/images/home/corridor-singapore.png',
    '/images/home/corridor-dubai.png',
  ];

  return (
    <div className="bg-[#f7f8f9] min-h-screen">
      <HeroSection title={t('heroTitle')} subtitle={t('heroSubtitle')} />

      <section className="relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#1a1a2e 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          
          {/* Premium Filter Tabs with framer-motion */}
          <div className="mb-16 flex flex-wrap gap-4 border-b border-[#e5e7eb] pb-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`relative px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  filter === cat.key
                    ? 'text-navy-900'
                    : 'text-[#adb5bd] hover:text-[#495057]'
                }`}
              >
                <span className="relative z-10">{cat.label}</span>
                {filter === cat.key && (
                  <motion.div
                    layoutId="activeInsightsTab"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-navy-900"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="grid gap-px bg-[#e5e7eb] sm:grid-cols-2 lg:grid-cols-3 border border-[#e5e7eb] shadow-2xl shadow-navy-900/5">
            {filtered.map((article, i) => (
              <AnimatedSection key={article.slug} delay={i * 0.08}>
                <Link
                  href={`/insights/${article.slug}`}
                  className="group relative flex h-full min-h-[420px] flex-col justify-between bg-white p-9 transition-all hover:bg-[#fafafa] overflow-hidden"
                >
                  {/* Immersive Background Image (Lens Effect) */}
                  <div className="absolute inset-0 opacity-[0.03] grayscale transition-all duration-1000 group-hover:opacity-[0.08] group-hover:grayscale-0 group-hover:scale-105">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${articleImages[i % 3]})` }}
                    />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-600">
                        {categoryLabels[article.category]}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-[#adb5bd]" />
                      <span className="text-[11px] font-medium text-[#adb5bd] uppercase tracking-wider">{article.date}</span>
                    </div>
                    <h3 className="mt-6 text-[19px] font-semibold leading-snug text-[#1a1a2e] group-hover:text-gold-700 transition-colors">
                      {loc(article, 'title', locale)}
                    </h3>
                    <div className="mt-4 h-[1px] w-12 bg-gold-400/30 transition-all duration-700 group-hover:w-full" />
                    <p className="mt-6 line-clamp-3 text-[14.5px] leading-relaxed text-[#6c757d] font-light">
                      {loc(article, 'excerpt', locale)}
                    </p>
                  </div>
                  
                  <div className="relative z-10 mt-10 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gold-500 group-hover:text-navy-950 transition-all">
                    <span className="border-b border-transparent group-hover:border-navy-950 pb-0.5">
                      {t('readMore')}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
