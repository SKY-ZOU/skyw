import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getArticleBySlug, getAllArticleSlugs, getAdjacentArticles } from '@/lib/data';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const { prev, next } = await getAdjacentArticles(article.id);
  const t = await getTranslations({ locale, namespace: 'Insights' });

  const categoryLabels: Record<string, string> = {
    news: t('categoryNews'),
    market: t('categoryMarket'),
    industry: t('categoryIndustry'),
  };

  const title = loc(article, 'title', locale);
  const content = loc(article, 'content', locale);
  const excerpt = loc(article, 'excerpt', locale);

  return (
    <>
      {/* 1. Simplified Clean Header - Focus on Title */}
      <section className="bg-navy-950 pt-36 pb-16 lg:pt-44 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8 text-center sm:text-left">
          <Link
            href="/insights"
            className="group mb-10 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400/60 transition-colors hover:text-gold-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="border-b border-transparent group-hover:border-gold-400 pb-0.5">{t('backToList')}</span>
          </Link>

          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400">
                {categoryLabels[article.category]}
              </span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[11px] uppercase tracking-wider text-white/40">
                {article.date}
              </span>
            </div>
            <h1 className="text-[clamp(2rem,5vw,3.8rem)] font-extralight tracking-tight text-white leading-[1.15]">
              {title}
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Dedicated Full-Visibility Image Area */}
      {article.coverImage && (
        <section className="bg-white pt-12 lg:pt-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="relative overflow-hidden shadow-2xl bg-[#f7f8f9] border border-[#e5e7eb]">
              {/* Using a larger aspect ratio or natural container to ensure full visibility */}
              <div className="relative w-full overflow-hidden">
                <img 
                  src={article.coverImage} 
                  alt={title}
                  className="w-full h-auto object-contain max-h-[85vh] mx-auto block"
                />
              </div>
              {/* Optional caption bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-20 pointer-events-none" />
            </div>
          </div>
        </section>
      )}

      {/* 3. Refined Editorial Content Layout */}
      <section className="bg-white relative">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid lg:grid-cols-[1fr_minmax(300px,350px)] gap-16 items-start">
            <article className="prose prose-lg prose-slate max-w-none prose-headings:font-light prose-headings:text-navy-950 prose-p:font-light prose-p:leading-relaxed prose-p:text-[#495057] prose-a:text-gold-600">
              {content.split('\n\n').map((para, i) => {
                if (i === 0) {
                  return (
                    <p key={i} className="text-[1.15rem] font-light leading-relaxed text-navy-900 first-letter:text-6xl first-letter:font-semibold first-letter:text-navy-950 first-letter:mr-4 first-letter:float-left first-letter:mt-2">
                      {para}
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-[1.05rem] font-light leading-relaxed text-[#495057] mt-8">
                    {para}
                  </p>
                );
              })}
            </article>

            <aside className="hidden lg:block sticky top-32">
              <div className="p-8 bg-[#f7f8f9] border border-[#e5e7eb] rounded-sm shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-[1px] bg-gold-400" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy-950/60">Insight Summary</p>
                </div>
                <p className="text-[14px] leading-relaxed text-[#495057] mb-8 font-medium">
                  {excerpt}
                </p>
                <div className="h-px w-full bg-[#e5e7eb] mb-8" />
                <div className="space-y-4">
                  <p className="text-[11px] font-semibold text-navy-900 uppercase tracking-widest">Share this dynamic</p>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 border border-[#dee2e6] flex items-center justify-center text-[#adb5bd] hover:border-gold-400 hover:text-gold-500 transition-all cursor-pointer bg-white text-[12px]">LI</div>
                    <div className="w-9 h-9 border border-[#dee2e6] flex items-center justify-center text-[#adb5bd] hover:border-gold-400 hover:text-gold-500 transition-all cursor-pointer bg-white text-[12px]">TW</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* 4. Article Navigation: Prev / Next */}
          <div className="mt-24 pt-12 border-t border-[#e5e7eb]">
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Previous Article */}
              <div className="flex flex-col items-start">
                {prev ? (
                  <Link href={`/insights/${prev.slug}`} className="group max-w-sm">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#adb5bd] group-hover:text-gold-500 transition-colors mb-4">
                      <ChevronLeft className="h-4 w-4" />
                      Previous Insight
                    </p>
                    <h4 className="text-[18px] font-light text-navy-950 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {loc(prev, 'title', locale)}
                    </h4>
                  </Link>
                ) : (
                  <div className="opacity-25 grayscale cursor-not-allowed">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#adb5bd] mb-4">
                      <ChevronLeft className="h-4 w-4" />
                      First Insight
                    </p>
                  </div>
                )}
              </div>

              {/* Next Article */}
              <div className="flex flex-col items-end text-right">
                {next ? (
                  <Link href={`/insights/${next.slug}`} className="group max-w-sm">
                    <p className="flex items-center justify-end gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#adb5bd] group-hover:text-gold-500 transition-colors mb-4">
                      Next Insight
                      <ChevronRight className="h-4 w-4" />
                    </p>
                    <h4 className="text-[18px] font-light text-navy-950 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {loc(next, 'title', locale)}
                    </h4>
                  </Link>
                ) : (
                  <div className="opacity-25 grayscale cursor-not-allowed">
                    <p className="flex items-center justify-end gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#adb5bd] mb-4">
                      Latest Insight
                      <ChevronRight className="h-4 w-4" />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
