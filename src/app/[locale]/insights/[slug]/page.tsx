import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import { loc } from '@/lib/locale-utils';

export const dynamic = 'force-dynamic';

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
      <section className="bg-navy-950 pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <Link
            href="/insights"
            className="mb-8 inline-flex items-center gap-1.5 text-body-sm uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToList')}
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-caption font-medium uppercase tracking-wider text-gold-400">
              {categoryLabels[article.category]}
            </span>
            <span className="text-caption text-white/40">
              {t('publishedOn')} {article.date}
            </span>
          </div>

          <h1 className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-extralight leading-[1.1] tracking-tight text-white">
            {title}
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          <article className="max-w-3xl space-y-6">
            {content.split('\n\n').map((para, i) => (
              <p
                key={i}
                className="text-lead font-light leading-relaxed text-[#495057]"
              >
                {para}
              </p>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
