import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import { loc } from '@/lib/locale-utils';
import HeroSection from '@/components/sections/HeroSection';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = loc(article, 'title', locale);
  const description = loc(article, 'excerpt', locale);
  const keywords = article.keywords || undefined;
  const ogImage = article.coverImage || undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.date,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: 'Insights' });

  const categoryLabels: Record<string, string> = {
    news: t('categoryNews'),
    market: t('categoryMarket'),
    industry: t('categoryIndustry'),
  };

  const title = loc(article, 'title', locale);
  const content = loc(article, 'content', locale);

  return (
    <>
      <HeroSection 
        title={title} 
        backgroundImage={article.coverImage || "/images/home/hero-bg.png"}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400">
              {categoryLabels[article.category]}
            </span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[11px] uppercase tracking-wider text-white/50">
              {article.date}
            </span>
          </div>
        </div>
      </HeroSection>

      <section className="bg-white relative">
        {/* Editorial Layout Wrapper */}
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-8 lg:py-28">
          
          <Link
            href="/insights"
            className="group mb-16 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-navy-900 transition-colors hover:text-gold-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="border-b border-transparent group-hover:border-gold-400 pb-0.5">{t('backToList')}</span>
          </Link>

          <div className="grid lg:grid-cols-[1fr_minmax(300px,350px)] gap-16 items-start">
            <article className="prose prose-lg prose-slate max-w-none prose-headings:font-light prose-headings:text-navy-950 prose-p:font-light prose-p:leading-relaxed prose-p:text-[#495057] prose-a:text-gold-600">
              {content.split('\n\n').map((para, i) => {
                // Drop cap for the first paragraph
                if (i === 0) {
                  return (
                    <p key={i} className="text-[1.1rem] font-light leading-relaxed text-[#495057] first-letter:text-5xl first-letter:font-semibold first-letter:text-navy-950 first-letter:mr-3 first-letter:float-left">
                      {para}
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-[1.05rem] font-light leading-relaxed text-[#495057] mt-6">
                    {para}
                  </p>
                );
              })}
            </article>

            {/* Sticky Sidebar for Social / Share / Meta (Placeholder for future) */}
            <aside className="hidden lg:block sticky top-32">
              <div className="p-8 bg-[#f7f8f9] border border-[#e5e7eb]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy-900/40 mb-4">About this insight</p>
                <div className="h-px w-8 bg-gold-400 mb-6" />
                <p className="text-[13.5px] leading-relaxed text-[#6c757d] mb-8">
                  This material is provided for informational purposes only and should not be construed as investment advice.
                </p>
                <div className="flex gap-4">
                  {/* Share placeholders */}
                  <div className="w-8 h-8 rounded-full border border-[#adb5bd] flex items-center justify-center text-[#adb5bd] hover:border-navy-900 hover:text-navy-900 transition-colors cursor-pointer">in</div>
                  <div className="w-8 h-8 rounded-full border border-[#adb5bd] flex items-center justify-center text-[#adb5bd] hover:border-navy-900 hover:text-navy-900 transition-colors cursor-pointer">tw</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
