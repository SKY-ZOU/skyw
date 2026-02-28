'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { ArrowRight } from 'lucide-react';
import { loc } from '@/lib/locale-utils';

interface ArticleRow {
  id: number;
  slug: string;
  category: string;
  date: string;
  titleZhCN: string;
  titleZhTW: string;
  titleEn: string;
  excerptZhCN: string;
  excerptZhTW: string;
  excerptEn: string;
}

interface MetricRow {
  id: number;
  valueZhCN: string;
  valueZhTW: string;
  valueEn: string;
  labelZhCN: string;
  labelZhTW: string;
  labelEn: string;
}

/* ───────── HERO ───────── */
function HomeHero() {
  const t = useTranslations('Home');

  return (
    <section className="relative flex min-h-screen items-end bg-navy-950">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24 pt-40 lg:px-8 lg:pb-32">
        <div className="max-w-3xl">
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extralight leading-[1.08] tracking-tight text-white">
            {t('heroTitle')}
            <br />
            <span className="font-light text-gold-400">{t('heroTitleLine2')}</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-white/60">
            {t('heroSubtitle')}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/business"
              className="group inline-flex items-center gap-2 border-b border-gold-400 pb-1 text-sm font-medium uppercase tracking-[0.1em] text-gold-400 transition-colors hover:border-white hover:text-white"
            >
              {t('heroCta1')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 border-b border-white/30 pb-1 text-sm font-medium uppercase tracking-[0.1em] text-white/70 transition-colors hover:border-white hover:text-white"
            >
              {t('heroCta2')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── METRICS BAR ───────── */
function MetricsStrip({ metrics }: { metrics: MetricRow[] }) {
  const locale = useLocale();

  return (
    <section className="bg-navy-900">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={m.id}
            className={`flex flex-col items-center justify-center px-6 py-10 lg:py-14 ${
              i < metrics.length - 1 ? 'border-r border-white/10' : ''
            }`}
          >
            <span className="display-number text-gold-400">{loc(m, 'value', locale)}</span>
            <span className="mt-2 text-[13px] font-medium uppercase tracking-[0.1em] text-white/50">
              {loc(m, 'label', locale)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── BUSINESS DIVISIONS ───────── */
function BusinessSection() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const { divisions } = useSiteData();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-gold-500">
            {t('businessTitle')}
          </p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-tight text-[#1a1a2e]">
            {t('businessSubtitle')}
          </h2>
        </AnimatedSection>

        <div className="mt-16 grid gap-px bg-[#e5e7eb] sm:grid-cols-2 lg:grid-cols-3">
          {divisions.map((div, i) => (
            <AnimatedSection key={div.divisionId} delay={i * 0.08}>
              <Link
                href={`/business/${div.slug}`}
                className="group flex h-full flex-col justify-between bg-white p-8 transition-colors hover:bg-[#fafafa] lg:p-10"
              >
                <div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e] lg:text-2xl">
                    {loc(div, 'title', locale)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#6c757d]">
                    {loc(div, 'shortDesc', locale)}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-gold-500 transition-colors group-hover:text-navy-900">
                  {t('businessLearnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── ABOUT PREVIEW ───────── */
function AboutPreview() {
  const t = useTranslations('Home');

  return (
    <section className="bg-[#f7f8f9]">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <AnimatedSection>
            <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-gold-500">
              {t('aboutTitle')}
            </p>
            <p className="mt-6 text-[clamp(1rem,1.8vw,1.25rem)] font-light leading-relaxed text-[#495057]">
              {t('aboutDescription')}
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 border-b border-navy-900 pb-1 text-[13px] font-medium uppercase tracking-[0.08em] text-navy-900 transition-colors hover:border-gold-500 hover:text-gold-500"
            >
              {t('aboutLearnMore')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { city: 'Hong Kong', role: 'HQ' },
                { city: 'Shenzhen', role: 'GBA' },
                { city: 'Singapore', role: 'SEA' },
                { city: 'Dubai', role: 'ME' },
                { city: 'London', role: 'EU' },
              ].map((office) => (
                <div key={office.city} className="border-l-2 border-gold-400 py-3 pl-4">
                  <div className="text-[15px] font-semibold text-[#1a1a2e]">{office.city}</div>
                  <div className="text-[12px] uppercase tracking-widest text-[#adb5bd]">{office.role}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ───────── INSIGHTS PREVIEW ───────── */
function InsightsSection({ articles }: { articles: ArticleRow[] }) {
  const t = useTranslations('Home');
  const tInsights = useTranslations('Insights');
  const locale = useLocale();
  const latest = articles.slice(0, 3);

  const categoryLabels: Record<string, string> = {
    news: tInsights('categoryNews'),
    market: tInsights('categoryMarket'),
    industry: tInsights('categoryIndustry'),
  };

  return (
    <section className="section-separator bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-gold-500">
                {t('insightsTitle')}
              </p>
              <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-light text-[#1a1a2e]">
                {t('insightsSubtitle')}
              </h2>
            </div>
            <Link
              href="/insights"
              className="hidden items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-navy-900 hover:text-gold-500 sm:flex"
            >
              {t('insightsViewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="mt-12 grid gap-px bg-[#e5e7eb] md:grid-cols-3">
          {latest.map((article, i) => (
            <AnimatedSection key={article.slug} delay={i * 0.1}>
              <Link
                href={`/insights/${article.slug}`}
                className="group flex h-full flex-col justify-between bg-white p-8 transition-colors hover:bg-[#fafafa]"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-medium uppercase tracking-wider text-gold-500">
                      {categoryLabels[article.category]}
                    </span>
                    <span className="text-[12px] text-[#adb5bd]">{article.date}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-[#1a1a2e] group-hover:text-navy-700">
                    {loc(article, 'title', locale)}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[15px] text-[#6c757d]">
                    {loc(article, 'excerpt', locale)}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-gold-500 transition-colors group-hover:text-navy-900">
                  {t('insightsReadMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <Link
          href="/insights"
          className="mt-8 flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-navy-900 hover:text-gold-500 sm:hidden"
        >
          {t('insightsViewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ───────── CTA ───────── */
function CtaBanner() {
  const t = useTranslations('Home');

  return (
    <section className="bg-navy-950">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-6 py-20 lg:flex-row lg:items-center lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-light text-white">{t('ctaTitle')}</h2>
          <p className="mt-3 text-lg font-light text-white/50">{t('ctaSubtitle')}</p>
        </div>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 border border-gold-400 px-8 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-gold-400 transition-colors hover:bg-gold-400 hover:text-navy-950"
        >
          {t('ctaButton')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

/* ───────── PAGE ───────── */
export default function HomeClient({
  articles,
  metrics,
}: {
  articles: ArticleRow[];
  metrics: MetricRow[];
}) {
  return (
    <>
      <HomeHero />
      <MetricsStrip metrics={metrics} />
      <BusinessSection />
      <AboutPreview />
      <InsightsSection articles={articles} />
      <CtaBanner />
    </>
  );
}
