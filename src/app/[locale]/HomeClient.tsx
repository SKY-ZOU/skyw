'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { loc } from '@/lib/locale-utils';
import AnimatedSection from '@/components/ui/AnimatedSection';

// --- Types ---
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

// --- Reusable Utilities ---
const KKR_EASE = [0.22, 1, 0.36, 1] as const;

function AnimatedCounter({ valueStr }: { valueStr: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  // Extract number and suffix (e.g., "100+" -> num: 100, suffix: "+", "20M" -> num: 20, suffix: "M")
  const match = valueStr.match(/([0-9.,]+)(.*)/);
  const numRaw = match ? match[1].replace(/,/g, '') : '0';
  const num = parseFloat(numRaw) || 0;
  const suffix = match ? match[2] : '';
  const isFloat = numRaw.includes('.');

  useEffect(() => {
    if (inView && ref.current) {
      animate(0, num, {
        duration: 2,
        ease: KKR_EASE,
        onUpdate: (latest) => {
          if (ref.current) {
            const displayNum = isFloat ? latest.toFixed(1) : Math.round(latest);
            ref.current.textContent = `${displayNum}${suffix}`;
          }
        }
      });
    }
  }, [inView, num, suffix, isFloat]);

  return <span ref={ref} className="tabular-nums">0</span>;
}

// --- Sections ---

// Ribbon paths — each group has 4 keyframes (same command count) for smooth morphing
const RIBBON_KEYFRAMES = [
  // Ribbon A — main gold, wide diagonal
  [
    "M-200,450 C200,850 500,100 900,400 C1200,600 1300,200 1600,300 L1600,500 C1300,400 1200,800 900,600 C500,300 200,1050 -200,650 Z",
    "M-200,420 C250,800 480,150 920,380 C1180,580 1320,180 1620,280 L1620,520 C1320,420 1180,820 920,620 C480,350 250,1020 -200,670 Z",
    "M-200,470 C180,880 520,80 880,420 C1220,620 1280,220 1580,320 L1580,480 C1280,380 1220,780 880,580 C520,280 180,1060 -200,630 Z",
    "M-200,440 C220,860 510,110 910,410 C1210,610 1310,210 1610,310 L1610,510 C1310,410 1210,810 910,610 C510,310 220,1040 -200,640 Z",
  ],
  // Ribbon B — secondary, counter-diagonal
  [
    "M-200,550 C300,950 600,-50 1000,450 C1200,750 1400,250 1600,450 L1600,600 C1400,400 1200,900 1000,600 C600,100 300,1100 -200,700 Z",
    "M-200,520 C350,980 650,-30 1020,430 C1180,730 1380,230 1580,430 L1580,620 C1380,420 1180,880 1020,620 C650,120 350,1080 -200,720 Z",
    "M-200,570 C280,920 570,-70 980,470 C1220,770 1420,270 1620,470 L1620,580 C1420,380 1220,920 980,580 C570,80 280,1120 -200,680 Z",
    "M-200,540 C320,960 620,-40 1010,450 C1190,760 1410,240 1610,450 L1610,605 C1410,410 1190,900 1010,610 C620,110 320,1090 -200,710 Z",
  ],
  // Ribbon C — accent, upper band
  [
    "M-200,280 C400,680 700,120 1100,320 C1300,420 1500,100 1700,210 L1700,360 C1500,250 1300,510 1100,440 C700,300 400,760 -200,400 Z",
    "M-200,260 C380,710 730,100 1120,300 C1280,410 1480,90 1680,190 L1680,380 C1480,270 1280,520 1120,460 C730,280 380,780 -200,420 Z",
    "M-200,295 C420,660 680,140 1080,330 C1320,430 1520,115 1720,220 L1720,345 C1520,240 1320,500 1080,430 C680,320 420,740 -200,385 Z",
    "M-200,272 C395,695 715,112 1105,312 C1293,417 1493,97 1693,202 L1693,368 C1493,258 1293,515 1105,447 C715,290 395,768 -200,410 Z",
  ],
];

const RIBBON_CONFIG = [
  { gradient: "rbn-a", duration: 9,  delay: 0,   opacity: 0.72, scaleY: 1, xKeyframes: ["0%", "15%", "-10%", "0%"] },
  { gradient: "rbn-b", duration: 11, delay: 1.8, opacity: 0.52, scaleY: -1, xKeyframes: ["0%", "-12%", "8%", "0%"] },
  { gradient: "rbn-c", duration: 7,  delay: 3.5, opacity: 0.38, scaleY: 1, xKeyframes: ["0%", "10%", "-15%", "0%"] },
];

function HeroRibbon() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.8, ease: KKR_EASE, delay: 0.3 }}
        className="absolute inset-0 w-full h-full"
      >
        <svg
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          className="absolute w-[120%] h-[120%] -left-[10%] -top-[10%]"
          style={{ willChange: "transform" }}
        >
          <defs>
            <linearGradient id="rbn-a" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="25%"  stopColor="#E8C94A" stopOpacity="0.9" />
              <stop offset="65%"  stopColor="#C8960C" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rbn-b" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="45%"  stopColor="#F0D060" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rbn-c" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="50%"  stopColor="#D4AF37" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>

          {RIBBON_CONFIG.map((cfg, i) => (
            <motion.path
              key={i}
              d={RIBBON_KEYFRAMES[i][0]}
              fill={`url(#${cfg.gradient})`}
              style={{
                mixBlendMode: "screen",
                opacity: cfg.opacity,
                scaleY: cfg.scaleY,
                willChange: "d, transform",
              }}
              animate={{ 
                d: RIBBON_KEYFRAMES[i],
                x: cfg.xKeyframes,
              }}
              transition={{
                d: {
                  duration: cfg.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: cfg.delay,
                  repeatType: "mirror",
                },
                x: {
                  duration: cfg.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: cfg.delay,
                  repeatType: "mirror",
                },
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

function HomeHero() {
  const t = useTranslations('Home');
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] sm:min-h-[800px] w-full overflow-hidden bg-navy-950">
      <motion.div
        className="absolute inset-0 origin-center"
        style={{ y, opacity, scale }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </motion.div>

      <HeroRibbon />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 sm:pb-24 lg:px-12 lg:pb-32 2xl:px-24">
        <div className="max-w-[75rem]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: KKR_EASE, delay: 0.1 }}
          >
            <p className="mb-6 font-mono text-sm tracking-[0.2em] text-gold-400 uppercase">
              {t('heroSubtitle')}
            </p>
          </motion.div>

          <h1 className="text-display-lg font-extralight leading-[1.05] tracking-tight text-white mb-8">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease: KKR_EASE, delay: 0.2 }}
              >
                {t('heroTitle')}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block text-gold-400"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease: KKR_EASE, delay: 0.3 }}
              >
                {t('heroTitleLine2')}
              </motion.span>
            </span>
          </h1>

          <motion.div
            className="flex flex-wrap gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: KKR_EASE, delay: 0.6 }}
          >
            <Link
              href="/business"
              className="group flex items-center gap-3 border-b border-gold-400/50 pb-2 text-body font-medium uppercase tracking-widest text-gold-400 transition-colors hover:border-gold-400"
            >
              {t('heroCta1')}
              <ArrowRight className="h-5 w-5 transition-transform duration-500 ease-out group-hover:translate-x-2" />
            </Link>
            <Link
              href="/about"
              className="group flex items-center gap-3 border-b border-white/20 pb-2 text-body font-medium uppercase tracking-widest text-white/70 transition-colors hover:border-white hover:text-white"
            >
              {t('heroCta2')}
              <ArrowRight className="h-5 w-5 transition-transform duration-500 ease-out group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MetricsStrip({ metrics }: { metrics: MetricRow[] }) {
  const locale = useLocale();

  return (
    <section className="bg-white px-6 py-20 lg:px-12 2xl:px-24 lg:py-28 relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-navy-950/10" />
      <div className="mx-auto max-w-[90rem]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
          {metrics.map((m, i) => (
            <div key={m.id} className="relative group">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, ease: KKR_EASE, delay: i * 0.1 }}
                className="absolute top-0 left-0 w-full h-[1px] bg-gold-400 origin-left mb-6"
              />
              <div className="pt-8">
                <span className="block text-display-lg text-navy-950 font-light tracking-tight">
                  <AnimatedCounter valueStr={loc(m, 'value', locale)} />
                </span>
                <span className="block mt-3 text-body-sm font-semibold uppercase tracking-[0.15em] text-navy-950/50">
                  {loc(m, 'label', locale)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessSection() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const { divisions } = useSiteData();

  return (
    <section className="bg-navy-50 px-6 py-16 sm:py-24 lg:px-12 2xl:px-24 lg:py-40">
      <div className="mx-auto max-w-[90rem]">
        <AnimatedSection>
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-gold-500 uppercase">
            {t('businessTitle')}
          </p>
          <h2 className="max-w-3xl text-display-lg font-light leading-tight text-navy-950 mb-10 sm:mb-16 lg:mb-20">
            {t('businessSubtitle')}
          </h2>
        </AnimatedSection>

        {/* Staggered Premium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {divisions.map((div, i) => {
            const isOffset = i % 2 !== 0;
            return (
              <AnimatedSection key={div.divisionId} delay={i * 0.1}>
                <Link
                  href={`/business/${div.slug}`}
                  className={`group block w-full relative overflow-hidden bg-white ${isOffset ? 'md:mt-32' : ''}`}
                >
                  <div className="aspect-[4/3] bg-navy-100 overflow-hidden relative">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop')` }}
                    />
                    <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-transparent transition-colors duration-[1.5s] ease-out" />
                  </div>
                  <div className="p-8 lg:p-12">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-navy-950 mb-4 group-hover:text-gold-500 transition-colors duration-500">
                      {loc(div, 'title', locale)}
                    </h3>
                    <p className="text-[#6c757d] text-body leading-relaxed mb-8 max-w-md">
                      {loc(div, 'shortDesc', locale)}
                    </p>
                    <div className="flex items-center gap-2 text-body-sm font-medium uppercase tracking-widest text-navy-950">
                      {t('businessLearnMore')}
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:text-gold-500" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  const t = useTranslations('Home');

  return (
    <section className="bg-navy-950 text-white px-6 py-16 sm:py-24 lg:px-12 2xl:px-24 lg:py-40 overflow-hidden relative">
      <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1579532537598-459ecdaf50f6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[90rem]">
        <div className="max-w-2xl">
          <AnimatedSection>
            <p className="font-mono text-xs tracking-[0.2em] text-gold-400 uppercase mb-8 focus:outline-none">
              {t('aboutTitle')}
            </p>
            <h2 className="text-display font-light leading-[1.2] mb-12">
              {t('aboutDescription')}
            </h2>
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 border-b border-gold-400/50 pb-2 text-body-sm font-medium uppercase tracking-widest text-gold-400 transition-colors hover:border-gold-400"
            >
              {t('aboutLearnMore')}
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8 border-t border-white/10 pt-12">
              {[
                { city: 'Hong Kong', role: 'Headquarters' },
                { city: 'Shenzhen', role: 'GBA Node' },
                { city: 'Singapore', role: 'SEA Node' },
                { city: 'Dubai', role: 'ME Node' },
                { city: 'London', role: 'EU Node' },
              ].map((office, idx) => (
                <div key={office.city}>
                  <p className="text-white/50 text-micro uppercase tracking-[0.15em] mb-2">{office.role}</p>
                  <p className="text-body-md sm:text-xl font-light text-white">{office.city}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

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
    <section className="bg-white px-6 py-24 lg:px-12 2xl:px-24 lg:py-32">
      <div className="mx-auto max-w-[90rem]">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-gold-500 uppercase mb-4">
                {t('insightsTitle')}
              </p>
              <h2 className="text-display font-light text-navy-950">
                {t('insightsSubtitle')}
              </h2>
            </div>
            <Link
              href="/insights"
              className="group flex items-center gap-2 text-body-sm font-medium uppercase tracking-widest text-navy-900 border-b border-navy-900 pb-1 hover:text-gold-500 hover:border-gold-500 transition-colors"
            >
              {t('insightsViewAll')}
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {latest.map((article, i) => (
            <AnimatedSection key={article.slug} delay={i * 0.1}>
              <Link
                href={`/insights/${article.slug}`}
                className="group block h-full border border-navy-950/10 p-8 hover:border-gold-400 transition-colors duration-500 bg-white"
              >
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-micro font-semibold uppercase tracking-[0.15em] text-gold-500">{categoryLabels[article.category]}</span>
                  <span className="w-1 h-1 rounded-full bg-navy-950/20" />
                  <span className="text-body-sm text-navy-950/50">{article.date}</span>
                </div>
                <h3 className="text-xl font-light leading-snug text-navy-950 group-hover:text-gold-500 transition-colors duration-500 mb-6 line-clamp-2">
                  {loc(article, 'title', locale)}
                </h3>
                <p className="text-body text-[#6c757d] line-clamp-3 leading-relaxed mb-10">
                  {loc(article, 'excerpt', locale)}
                </p>
                <div className="flex items-center gap-2 text-body-sm font-medium uppercase tracking-widest text-navy-950">
                  {t('insightsReadMore')}
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:text-gold-500" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  const t = useTranslations('Home');

  return (
    <section className="bg-gold-500 px-6 py-24 lg:px-12 2xl:px-24">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-display-lg font-light text-navy-950 mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-lg text-navy-950/70 font-light">
              {t('ctaSubtitle')}
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-3 bg-navy-950 text-white px-10 py-5 text-body-md font-medium uppercase tracking-[0.15em] transition-transform hover:-translate-y-1 hover:shadow-2xl"
          >
            {t('ctaButton')}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

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
